/**
 * @license
 * Copyright (c) 2020 DigiByte Foundation NZ Limited
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Reconciler: index.js

const Logger = require('../logger');
const { ReconcilerError } = require('../errors');
const sleep = require('../utils/sleep');
const {
  SubtractValues,
  constructPartialBlockIdentifier,
  Hash,
} = require('../utils');

const RECONCILIATION_INACTIVE_SLEEP_MS = 5000;
const RECONCILIATION_INACTIVE_FREQUENCY_BLOCK_COUNT = 200;

const defaults = {
  highWaterMark: -1,
  lookupBalanceByBlock: true,
  requiredDepthInactive: 500,
  waitToCheckDiff: 10 * 1000,
  waitToCheckDiffSleep: 5000,
  inactiveFrequency: RECONCILIATION_INACTIVE_FREQUENCY_BLOCK_COUNT,
  withSeenAccounts: [],
};

const RECONCILIATION_ACTIVE = 'ACTIVE';
const RECONCILIATION_INACTIVE = 'INACTIVE';

const RECONCILIATION_ERROR_HEAD_BEHIND_LIVE = 'ERROR_HEAD_BEHIND_LIVE';
const RECONCILIATION_ERROR_ACCOUNT_UPDATED = 'ACCOUNT_UPDATED';
const RECONCILIATION_ERROR_BLOCK_GONE = 'BLOCK_GONE';

class RosettaReconciler {
  constructor(args = {}) {
    const { networkIdentifier, helper, handler, fetcher } = args;
    const configuration = Object.assign({}, defaults, args);

    this.network = networkIdentifier;
    this.helper = helper;
    this.handler = handler;
    this.fetcher = fetcher;

    this.highWaterMark = configuration.lookupBalanceByBlock;
    this.lookupBalanceByBlock = configuration.lookupBalanceByBlock;

    this.interestingAccounts = configuration.interestingAccounts || [];
    this.inactiveQueue = [];
    this.seenAccounts = this.handleSeenAccounts(configuration.withSeenAccounts);

    this.requiredDepthInactive = configuration.requiredDepthInactive;
    this.waitToCheckDiff = configuration.waitToCheckDiff;
    this.waitToCheckDiffSleep = configuration.waitToCheckDiffSleep;
    this.inactiveFrequency = configuration.inactiveFrequency;

    this.changeQueue = [];
  }

  handleSeenAccounts(seenAccounts) {
    const seen = {};

    seenAccounts.forEach(s => {
      this.inactiveQueue.push({ entry: s });
      seen[Hash(s)] = {};
    });

    return seen;
  }

  /**
   * QueueChanges enqueues a slice of BalanceChanges for reconciliation.
   *
   * @param {Rosetta:BlockIdentifier} blockIdentifier - uniquely identifies a block in a particular network.
   * @param {Rosetta:BalanceChange[]} balanceChangesArray - array of BalanceChanges
   * @return {Promise<void>}
   */
  async queueChanges(blockIdentifier, balanceChangesArray) {
    for (let account of this.interestingAccounts) {
      let skipAccount = false;

      for (let change of balanceChangesArray) {
        if (Hash(account) === Hash(change)) {
          skipAccount = true;
          break;
        }
      }

      if (skipAccount) continue;

      balanceChangesArray.push({
        account_identifier: account.account,
        currency: account.currency,
        block: blockIdentifier,
        difference: "0",
      });
    }

    for (let change of balanceChangesArray) {
      await this.inactiveAccountQueue(
        false,
        new RosettaReconciler.AccountCurrency(change.account_identifier.account, change.currency),
        blockIdentifier
      );

      if (!this.lookupBalanceByBlock) {
        if (blockIdentifier.index < this.highWaterMark) {
          continue;
        }

        this.changeQueue.push(change);
      } else {
        this.changeQueue.push(change);
      }
    }
  }

  /**
   * CompareBalance checks to see if the computed balance of an account
   * is equal to the live balance of an account. This function ensures
   * balance is checked correctly in the case of orphaned blocks.
   *
   * We must transactionally fetch the last synced head,
   * whether the liveBlock is canonical, and the computed
   * balance of the *types.AccountIdentifier and *types.Currency.
   *
   * @param {Rosetta:AccountIdentifier} accountIdentifier - uniquely identifies an account within a network.
   * @param {Rosetta:Currency} currency - currency.
   * @param {Rosetta:Amount} amount - amount.
   * @param {Rosetta:BlockIdentifier} blockIdentifier - uniquely identifies a block in a particular network.
   * @return {Promise<{cachedBalance: string, difference: string, headIndex: number}>}
   * @throws {ReconcilerError} thrown if live block higher than head block or live block gone.
   */
  async compareBalance(accountIdentifier, currency, amount, blockIdentifier) {
    const head = await this.helper.currentBlock();

    if (blockIdentifier.index > head.index) {
      throw new ReconcilerError(
        `Live block ${blockIdentifier.index} > head block ${head.index}`,
        RECONCILIATION_ERROR_HEAD_BEHIND_LIVE,
      );
    }

    const exists = this.helper.blockExists(blockIdentifier);
    if (!exists) {
      throw new ReconcilerError(
        `Block gone! Block hash = ${blockIdentifier.hash}`,
        RECONCILIATION_ERROR_BLOCK_GONE,
      );
    }

    const { cachedBalance, balanceBlock } = await this.helper.accountBalance(accountIdentifier, currency, head);

    if (blockIdentifier.index < balanceBlock.index) {
      throw new ReconcilerError(
        `Account updated: ${JSON.stringify(accountIdentifier)} updated at blockheight ${balanceBlock.index}`,
        RECONCILIATION_ERROR_ACCOUNT_UPDATED,
      );
    }

    const difference = SubtractValues(cachedBalance.value, amount);
    return {
      difference,
      cachedBalance: cachedBalance.value,
      headIndex: head.index,
    };
  }

  /**
   * Get the best currency balance.
   *
   * @param {Rosetta:AccountIdentifier} accountIdentifier - uniquely identifies an account within a network.
   * @param {Rosetta:Currency} currency - currency.
   * @param {Rosetta:BlockIdentifier} partialBlockIdentifier - uniquely identifies a block in a particular network.
   * @return {Promise<{block: *, value: *}|undefined>}
   */
  async bestBalance(accountIdentifier, currency, partialBlockIdentifier) {
    if (this.lookupBalanceByBlock) {
      partialBlockIdentifier = null;
    }

    return await this.getCurrencyBalance(
      this.fetcher,
      this.network,
      accountIdentifier,
      currency,
      partialBlockIdentifier,
    );
  }

  /**
   * Indicating whether inactive reconciliation should be attempted based on syncing status.
   *
   * @return {Promise<{head: Rosetta:BlockIdentifier, shouldAttempt: boolean}>}
   */
  async shouldAttemptInactiveReconciliation() {
    try {
      const head = await this.helper.currentBlock();

      if (head.index < this.highWaterMark) {
        if (this.debugLogging)
          this.logger.verbose('Waiting to continue inactive reconciliation until reaching high water mark...');

        return { shouldAttempt: false, head: null };
      }

      return { shouldAttempt: true, head: head };
    } catch (e) {
      if (this.debugLogging)
        this.logger.verbose('Waiting to start inactive reconciliation until a block is synced...');
    }

    return { shouldAttempt: false, head: null };
  }

  /**
   * Account reconciliation.
   *
   * @param {Rosetta:AccountIdentifier} accountIdentifier - uniquely identifies an account within a network.
   * @param {Rosetta:Currency} currency - currency.
   * @param {Rosetta:Amount} amount - amount.
   * @param {Rosetta:BlockIdentifier} blockIdentifier - uniquely identifies a block in a particular network.
   * @param {boolean} isInactive - is inactive reconciliation.
   * @return {Promise<void>}
   * @throws {Error} thrown if the provided AccountAndCurrency's live balance cannot be reconciled with the computed balance.
   */
  async accountReconciliation(accountIdentifier, currency, amount, blockIdentifier, isInactive) {
    const accountCurrency = {
      account_identifier: accountIdentifier,
      currency: currency,
    };

    while (true) {
      let difference;
      let cachedBalance;
      let headIndex;

      try {
        const result = await this.compareBalance(
          accountIdentifier,
          currency,
          amount,
          blockIdentifier,
        );

        ({ difference, cachedBalance, headIndex } = result);
      } catch (e) {
        if (e instanceof ReconcilerError) {
          switch (e.type) {
            case RECONCILIATION_ERROR_HEAD_BEHIND_LIVE: {
              // This error will only occur when lookupBalanceByBlock
              // is disabled and the syncer is behind the current block of
              // the node. This error should never occur when
              // lookupBalanceByBlock is enabled.
              const diff = blockIdentifier.index - headIndex;
              if (diff < this.waitToCheckDiff) {
                await sleep(this.waitToCheckDiffSleep);
                continue;
              }

              // Don't wait to check if we are very far behind
              Logger.info(`Skipping reconciliation for ${JSON.stringify(accountCurrency)}:` +
                ` ${diff} blocks behind`);

              // Set a highWaterMark to not accept any new
              // reconciliation requests unless they happened
              // after this new highWaterMark.
              this.highWaterMark = partialBlockIdentifier.index;
              break;
            }

            case RECONCILIATION_ERROR_ACCOUNT_UPDATED: {
              // Either the block has not been processed in a re-org yet
              // or the block was orphaned
              break;
            }

            case RECONCILIATION_ERROR_BLOCK_GONE: {
              // If account was updated, it must be
              // enqueued again
              break;
            }

            default:
              break;
          }

        } else {
          throw e;
        }
      }

      let reconciliationType = RECONCILIATION_ACTIVE;

      if (isInactive) {
        reconciliationType = RECONCILIATION_INACTIVE;
      }

      if (difference != "0") {
        const error = await this.handler.reconciliationFailed(
          reconciliationType,
          accountCurrency.account_identifier,
          accountCurrency.currency,
          cachedBalance,
          amount,
          blockIdentifier,
        );

        if (error) throw error;
      }

      await this.inactiveAccountQueue(isInactive, accountCurrency, blockIdentifier);

      return await this.handler.reconciliationSucceeded(
        reconciliationType,
        accountCurrency.account_identifier,
        accountCurrency.currency,
        amount,
        blockIdentifier,
      );
    }
  }

  /**
   * Check for containing of account currency.
   *
   * @param accountCurrencyMap - array for check.
   * @param accountCurrency - account currency.
   * @return {boolean} - indicating if a AccountCurrency set already contains an Account and Currency combination.
   */
  static ContainsAccountCurrency(accountCurrencyMap, accountCurrency) {
    const element = accountCurrencyMap[Hash(accountCurrency)];
    return element != null;
  }

  /**
   * Set inactive account to queue
   *
   * @param {boolean} isInactive - indicate inactive account.
   * @param {RosettaReconciler.AccountCurrency} accountCurrency - account and its currency.
   * @param {Rosetta:BlockIdentifier} blockIdentifier - uniquely identifies a block in a particular network.
   * @return {Promise<void>}
   */
  async inactiveAccountQueue(isInactive, accountCurrency, blockIdentifier) {
    // Only enqueue the first time we see an account on an active reconciliation.
    let shouldEnqueueInactive = false;

    if (!isInactive && !RosettaReconciler.ContainsAccountCurrency(this.seenAccounts, accountCurrency)) {
      this.seenAccounts[Hash(accountCurrency)] = {};
      shouldEnqueueInactive = true;
    }

    if (isInactive || shouldEnqueueInactive) {
      this.inactiveQueue.push({
        entry: accountCurrency,
        last_check: blockIdentifier,
      });
    }
  }

  /**
   * Selects an account from the Reconciler account queue and reconciles the balance. This is useful
   * for detecting if balance changes in operations were correct.
   *
   * @return {Promise<void>}
   */
  async reconcileActiveAccounts(isInfinite = true) {
    while (true) {
      const balanceChange = this.changeQueue.shift();
      if (!balanceChange || balanceChange.block.index < this.highWaterMark) continue;

      const { block, value } = await this.bestBalance(
        balanceChange.account_identifier.account,
        balanceChange.currency,
        constructPartialBlockIdentifier(balanceChange.block),
      );

      await this.accountReconciliation(
        balanceChange.account_identifier.account,
        balanceChange.currency,
        value,
        block,
        false,
      );

      if (!isInfinite) {
        break;
      }
    }
  }

  /**
   * Selects a random account from all previously seen accounts and reconciles
   * the balance. This is useful for detecting balance changes that were not returned in operations.
   *
   * @return {Promise<void>}
   */
  async reconcileInactiveAccounts(isInfinite = true) {
    while (true) {
      const { shouldAttempt, head } = await this.shouldAttemptInactiveReconciliation();
      if (!shouldAttempt) {
        await sleep(RECONCILIATION_INACTIVE_SLEEP_MS);
        continue;
      }

      const queueLen = this.inactiveQueue.length;
      if (queueLen === 0) {
        if (this.debugLogging) {
          this.logger.verbose('No accounts ready for inactive reconciliation (0 accounts in queue)');
        }

        await sleep(RECONCILIATION_INACTIVE_SLEEP_MS);
        continue;
      }

      const nextAccount = this.inactiveQueue[0];
      let nextValidIndex = -1;

      if (nextAccount.last_check != null) {
        nextValidIndex = nextAccount.last_check.index + this.inactiveFrequency;
      }

      if (nextValidIndex <= head.index) {
        this.inactiveQueue.shift();

        const { block, value } = await this.bestBalance(
          nextAccount.entry.account,
          nextAccount.entry.currency,
          constructPartialBlockIdentifier(head),
        );

        await this.accountReconciliation(
          nextAccount.entry.account,
          nextAccount.entry.currency,
          value,
          block,
          true,
        );

        // Always re-enqueue accounts after they have been inactively
        // reconciled. If we don't re-enqueue, we will never check
        // these accounts again.
        this.inactiveAccountQueue(true, nextAccount.entry, block);

      } else {
        if (this.debugLogging) {
          this.logger.verbose(`No accounts ready for inactive reconciliation ` +
            `(${queueLen} account(s) in queue, will reconcile next account at index ${nextValidIndex})`);
        }

        await sleep(RECONCILIATION_INACTIVE_SLEEP_MS);
      }

      if (!isInfinite) {
        break;
      }
    }
  }

  /**
   * Reconcile starts the active and inactive Reconciler goroutines.
   * If any goroutine errors, the function will return an error.
   *
   * @return {Promise<void>}
   */
  async reconcile() {
    // ToDo: Multithreading support (worker?)
    await Promise.all([
      this.reconcileActiveAccounts(),
      this.reconcileInactiveAccounts(),
    ]);
  }

  /**
   * Get amount from a slice of Balance pertaining to an AccountAndCurrency.
   *
   * @param {Rosetta:Amount[]} amountArray - array of amounts.
   * @param {Rosetta:Currency} currency - currency.
   * @return {Rosetta:Amount} - amount from a slice of Balance pertaining to an AccountAndCurrency.
   * @throws {Error} thrown if it could not extract amount.
   */
  static extractAmount(amountArray, currency) {
    for (let b of amountArray) {
      if (Hash(b.currency) !== Hash(currency)) continue;
      return b;
    }

    throw new Error(`Could not extract amount for ${JSON.stringify(currency)}`);
  }

  /**
   * Get currency balance.
   *
   * @param {RosettaFetcher} fetcher - instance of Fetcher.
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {Rosetta:AccountIdentifier} accountIdentifier - uniquely identifies an account within a network.
   * @param {Currency} currency - currency.
   * @param {Rosetta:PartialBlockIdentifier} partialBlockIdentifier - uniquely identifies a block in a particular network.
   * @return {Promise<{block: Rosetta:BlockIdentifier, value: Rosetta:Amount.value}>} - return block and balance.
   */
  async getCurrencyBalance(fetcher, networkIdentifier, accountIdentifier, currency, partialBlockIdentifier) {
    const { block, balances } = await fetcher.accountBalanceRetry(
      networkIdentifier,
      accountIdentifier,
      partialBlockIdentifier
    );

    try {
      const liveAmount = RosettaReconciler.extractAmount(balances, currency);

      return {
        block: block,
        value: liveAmount.value,
      };
    } catch (e) {
      throw new ReconcilerError(`Could not get ${JSON.stringify(currency)} currency balance` +
        ` for ${JSON.stringify(accountIdentifier)}: ${e.message}`);
    }
  }
}

/**
 * AccountCurrency is a simple struct combining
 * a *types.Account and *types.Currency. This can
 * be useful for looking up balances.
 *
 * @type {RosettaReconciler.AccountCurrency}
 */
RosettaReconciler.AccountCurrency = class AccountCurrency {
  constructor(opts) {
    if (typeof opts == 'object' && opts.accountIdentifier) {
      const { accountIdentifier, currency } = opts;
      this.account = accountIdentifier;
      this.currency = currency;
    } else {
      const [ accountIdentifier, currency ] = arguments;
      this.account = arguments[0];
      this.currency = arguments[1];
    }
  };
};

RosettaReconciler.defaults = defaults;

module.exports = RosettaReconciler;
