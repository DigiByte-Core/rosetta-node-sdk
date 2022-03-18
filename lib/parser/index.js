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

/**
 * @module Parser
 */

const Logger = require('../logger');
const RosettaClient = require('rosetta-node-sdk-client');
const { ParserError } = require('../errors');

const {
  AddValues,
  Hash,
  AmountValue,
  NegateValue,
} = require('../utils');

const { Sign } = require('../models');

const ExpectedOppositesLength = 2;

const EMPTY_OPERATIONS_GROUP = {
  type: '',
  operations: [],
  currencies: [],
  nil_amount_present: false,
};

/**
 * Match contains all operations matching a given OperationDescription and
 * their parsed amounts (if populated).
 * @class
 */
class Match {
  /**
   * @constructor
   * @param {Rosetta:Operation[]} operations - array of operations
   * @param {number[]} amounts - amounts has the same length as Operations. If an operation has
   * a populated Amount, its corresponding number will be not null.
   */
  constructor({operations = [], amounts = []} = {}) {
    this.operations = operations;
    this.amounts = amounts;
  }

  /**
   * OperationGroup is a group of related operations
   * If all operations in a group have the same operation.Type,
   * the Type is also populated.
   * @typedef {object} OperationGroup
   * @property {string} type
   * @property {Rosetta:Operation[]} operations
   * @property {Rosetta:Currency[]} currencies
   * @property {boolean} nil_amount_present
   */

  /**
   * First is a convenience method that returns the first matched operation
   * and amount (if they exist). This is used when parsing matches when
   * AllowRepeats is set to false.
   * @returns {{amount: number|null, operation: Rosetta:Operation|null}} - first matched operation
   * and amount (if they exist)
   */
  first() {
    if (this.operations.length > 0) {
      return {
        operation: this.operations[0],
        amount: this.amounts[0],
      };
    }

    return { operation: null, amount: null };
  }
}

/**
 * Parser provides support for parsing Rosetta blocks.
 * @class
 */
class RosettaParser {
  /**
   * ExemptOperation is a function that returns a boolean indicating
   * if the operation should be skipped eventhough it passes other
   * checks indicating it should be considered a balance change.
   * @typedef {function} ExemptOperation
   * @property {Rosetta:Operation} operation
   * @return {boolean}
   */

  /**
   * @constructor
   * @param {RosettaAsserter} asserter
   * @param {ExemptOperation} exemptFunc
   */
  constructor({asserter, exemptFunc} = {}) {
    this.asserter = asserter;
    this.exemptFunc = exemptFunc;
  }

  /**
   * skipOperation returns a boolean indicating whether
   * an operation should be processed. An operation will
   * not be processed if it is considered unsuccessful.
   *
   * @param {Rosetta:Operation} operation
   * @return {boolean}
   */
  skipOperation(operation) {
    const status = this.asserter.OperationSuccessful(operation);

    if (!status) {
      return true;
    }

    if (operation.account == null) {
      return true;
    }

    if (operation.amount == null) {
      return true;
    }

    if (this.exemptFunc && this.exemptFunc(operation)) {
      Logger.verbose(`Skipping excempt operation: ${JSON.stringify(operation)}`);
      return true;
    }

    return false;
  }

  /**
   * @typedef {object} BalanceChange
   * @property {Rosetta:AccountIdentifier} account_identifier
   * @property {Rosetta:Amount.currency} currency
   * @property {Rosetta:BlockIdentifier} block_identifier
   * @property {Rosetta:Amount.value} difference
   */

  /**
   * BalanceChanges returns all balance changes for a particular block. All balance changes for a
   * particular account are summed into a single BalanceChanges struct. If a block is being
   * orphaned, the opposite of each balance change is returned.
   *
   * @param {Rosetta:Block} block - particular block.
   * @param {boolean} blockRemoved - define is block removed or not.
   * @return {BalanceChange[]} - returns all balance changes for a particular block.
   */
  balanceChanges(block, blockRemoved) {
    const balanceChanges = {};

    for (let tx of block.transactions) {
      for (let op of tx.operations) {
        const skip = this.skipOperation(op);
        if (skip) { continue; }

        const amount = op.amount;
        let blockIdentifier = block.block_identifier;

        if (blockRemoved) {
          const negatedValue = NegateValue(amount.value);
          amount.value = negatedValue;
          blockIdentifier = block.parent_block_identifier;
        }

        const serializedAccount = Hash(op.account);
        const serializedCurrency = Hash(op.amount.currency);
        const key = `${serializedAccount}/${serializedCurrency}`;

        if (balanceChanges[key] == null) {
          balanceChanges[key] = {
            account_identifier: op.account,
            currency: op.amount.currency,
            block_identifier: blockIdentifier,
            difference: amount.value,
          };
          continue;
        }

        const val = balanceChanges[key];
        val.difference = AddValues(val.difference, amount.value);
      }
    }

    // Collect all balance changes and return them.
    const changes = [];
    for (let changeId of Object.keys(balanceChanges)) {
      const change = balanceChanges[changeId];
      changes.push(change);
    }

    return changes;
  }

  /**
   * addOperationToGroup adds an Operation to a OperationGroup.
   *
   * @param {OperationGroup} operationsGroup - holds operations of a certain type (= destination).
   * @param {number} destinationIndex - destination index.
   * @param {number[]} assignmentsArray - array of assignments.
   * @param {Rosetta:Operation} operation - the operation that is going to be added.
   */
  addOperationToGroup(operationsGroup = EMPTY_OPERATIONS_GROUP, destinationIndex, assignmentsArray = [], operation) {
    if (operation.type !== operationsGroup.type && operationsGroup.type !== '') {
      operationsGroup.type = '';
    }

    // Add the operation
    operationsGroup.operations.push(operation);
    assignmentsArray[operation.operation_identifier.index] = destinationIndex;

    if (operation.amount == null) {
      operationsGroup.nil_amount_present = true;
      return;
    }

    operationsGroup.nil_amount_present = false;

    if (-1 === operationsGroup.currencies.findIndex(curr =>
      Hash(curr) === Hash(operation.amount.currency),
    )) {
      operationsGroup.currencies.push(operation.amount.currency);
    }
  }

  /**
   * sortOperationsGroup sorts operations of an operationGroup and returns
   * all sorted operations as an array.
   *
   * @param {number} operationsCount - iterate from 0 .. <operationsCount>
   * @param {Object<string,OperationGroup>} operationsGroup - input OperationsGroup, that will be sorted.
   * @return {OperationGroup[]} - operations group array.
   */
  sortOperationsGroup(operationsCount, operationsGroup) {
    const sliceGroups = [];

    for (let i = 0; i < operationsCount; ++i) {
      const v = operationsGroup[i];

      if (v == null) {
        continue;
      }

      v.operations.sort((a, b) => {
        return a.operation_identifier.index -
          b.operation_identifier.index;
      });

      sliceGroups.push(v);
    }

    return sliceGroups;
  }

  /**
   * Derives Operations from a transaction.
   * Must not be called, unless properly validated (asserted for correctness).
   *
   * @param {Rosetta:Transaction} transaction - input transaction.
   * @return {OperationGroup[]} - operations group array.
   */
  groupOperations(transaction) {
    const ops = transaction.operations || [];

    const opGroups = {};
    const opAssignments = new Array(ops.length).fill(0);
    let counter = 0;

    if (ops) {
      for (let i = 0; i < ops.length; ++i) {
        const op = ops[i];

        // Create a new group
        if (!op.related_operations || op.related_operations.length === 0) {
          let key = counter++;

          opGroups[key] = {
            type: op.type,
            operations: [
              RosettaClient.Operation.constructFromObject(op),
            ],
          };

          if (op.amount != null) {
            opGroups[key].currencies = [op.amount.currency];
            opGroups[key].nil_amount_present = false;
          } else {
            opGroups[key].currencies = [];
            opGroups[key].nil_amount_present = true;
          }

          opAssignments[i] = key;
          continue;
        }

        // Find groups to merge
        const groupsToMerge = [];
        for (let relatedOp of (op.related_operations || [])) {
          if (!groupsToMerge.includes(opAssignments[relatedOp.index])) {
            groupsToMerge.push(opAssignments[relatedOp.index]);
          }
        }

        // Ensure that they are sorted, so we can merge other groups.
        groupsToMerge.sort();

        const mergedGroupIndex = groupsToMerge[0];
        const mergedGroup = opGroups[mergedGroupIndex];

        this.addOperationToGroup(mergedGroup, mergedGroupIndex, opAssignments, op);

        for (let otherGroupIndex of groupsToMerge.slice(1)) {
          const otherGroup = opGroups[otherGroupIndex];

          // Add otherGroup ops to mergedGroup
          for (let otherOp of otherGroup.operations) {
            this.addOperationToGroup(mergedGroup, mergedGroupIndex, opAssignments, otherOp);
          }

          delete opGroups[otherGroupIndex];
        }
      }

      return this.sortOperationsGroup(ops.length, opGroups);
    }

    return this.sortOperationsGroup(0, opGroups);
  }

  /**
   * Match is coin action the same as expected.
   *
   * @param {Rosetta:CoinAction} requiredCoinAction - coin action.
   * @param {Rosetta:CoinChange} coinChange - coin change.
   * @return {null} - not valid requiredCoinAction.
   * @throws {ParserError} thrown if the provided coinChange is null or not valid coinChange.coin_action.
   */
  coinActionMatch(requiredCoinAction, coinChange) {
    if (!requiredCoinAction || typeof requiredCoinAction !== 'string') {
      return null;
    }

    if (coinChange == null) {
      throw new ParserError(`coin change is null but expected ${requiredCoinAction}`);
    }

    if (coinChange.coin_action !== requiredCoinAction) {
      throw new ParserError(`coin change_action is ${coinChange.coin_action} ` +
        `but expected ${requiredCoinAction}`);
    }
  }

  /**
   * metadataMatch returns an error if a string[] does not meet
   * a slice of *MetadataDescription.
   *
   * @param {MetadataDescription[]} metadataDescriptionArray - array for check.
   * @param {Object<string,any>} metadataMap - metadata.
   * @throws {ParserError} thrown if key not present in metadata or key value is not of expected type.
   */
  metadataMatch(metadataDescriptionArray, metadataMap) {
    if (metadataDescriptionArray.length === 0) {
      return;
    }

    for (let req of metadataDescriptionArray) {
      const val = metadataMap[req.key];

      if (!val) {
        throw new ParserError(`${req.key} not present in metadata`);
      }

      if (typeof val != req.value_kind) {
        throw new ParserError(`${req.key} value is not of type ${req.value_kind}`);
      }
    }
  }

  /**
   * accountMatch returns an error if a *types.AccountIdentifier does not meet an *AccountDescription.
   *
   * @param {AccountDescription} accountDescription - describe a AccountIdentifier.
   * @param {Rosetta:AccountIdentifier} accountIdentifier - uniquely identifies an account within a network.
   * @throws {ParserError} thrown if account or sub_account_identifier is missing or some data from accountIdentifier mismatch accountDescription.
   */
  accountMatch(accountDescription, accountIdentifier) {
    if (accountDescription == null) {
      return;
    }

    if (accountIdentifier == null) {
      if (accountDescription.exists) {
        throw new ParserError(`Account is missing`);
      }
      return;
    }

    if (accountIdentifier.sub_account == null) {
      if (accountDescription.sub_account_exists) {
        throw new ParserError(`sub_account_identifier is missing`);
      }
      return;
    }

    if (!accountDescription.sub_account_exists) {
      throw new ParserError(`sub_account is populated`);
    }

    if (accountDescription.sub_account_address.length > 0 &&
      accountIdentifier.sub_account.address !== accountDescription.sub_account_address) {
      throw new ParserError(`sub_account_identifier.address is ${accountIdentifier.sub_account.address}` +
        ` not ${accountDescription.sub_account_address}`);
    }

    try {
      this.metadataMatch(accountDescription.sub_account_metadata_keys, accountIdentifier.sub_account.metadata);
    } catch (e) {
      throw new ParserError(`${e.message}: account metadata keys mismatch`);
    }
  }

  /**
   * amountMatch returns an error if amount does not meet an AmountDescription.
   *
   * @param {AmountDescription} amountDescription - describe an amount.
   * @param {Rosetta:Amount} amount - amount value.
   * @throws {ParserError} thrown if amount is missing or populated, or amount does not meet an AmountDescription.
   */
  amountMatch(amountDescription, amount) {
    if (amountDescription == null) {
      return;
    }

    if (amount == null) {
      if (amountDescription.exists) {
        throw new ParserError(`amount is missing`);
      }

      return;
    }

    if (!amountDescription.exists) {
      throw new ParserError(`amount is populated`);
    }

    if (!amountDescription.sign.match(amount)) {
      throw new ParserError(`amount sign of ${amount.value} was not ${amountDescription.sign.toString()}`);
    }

    if (amountDescription.currency == null) {
      return;
    }

    if (amount.currency == null || Hash(amount.currency) !== Hash(amountDescription.currency)) {
      throw new ParserError(`Currency ${amountDescription.currency} is not ${amount.currency}`);
    }
  }

  /**
   * operationMatch returns an error if operation does not match a OperationDescription.
   *
   * @param {Rosetta:Operation} operation - contain all balance-changing information within a transaction.
   * @param {OperationDescription[]} operationsDescriptionArray - describe an operation.
   * @param {Match[]} matchesArray - contains all operations matching a given OperationDescription.
   * @return {boolean} - is matched or not.
   */
  operationMatch(operation, operationsDescriptionArray, matchesArray) {
    for (let i = 0; i < operationsDescriptionArray.length; ++i) {
      const des = operationsDescriptionArray[i];

      if (matchesArray[i] != null && !des.allow_repeats) continue;
      if (des.type.length > 0 && des.type !== operation.type) continue;

      try {
        this.accountMatch(des.account, operation.account);
        this.amountMatch(des.amount, operation.amount);
        this.metadataMatch(des.metadata, operation.metadata);
        this.coinActionMatch(des.coin_action, operation.coin_action);

      } catch (e) {
        continue;
      }

      if (matchesArray[i] == null) {
        matchesArray[i] = new Match();
      }

      if (operation.amount != null) {
        const val = AmountValue(operation.amount);

        matchesArray[i].amounts.push(val);
      } else {
        matchesArray[i].amounts.push(null);
      }

      matchesArray[i].operations.push(operation);
      return true;
    }

    return false;
  }

  /**
   * Check operations array for equal amounts.
   *
   * @param {Rosetta:Operation[]} operationsArray - array of operations.
   * @throws {ParserError} thrown if operations array empty or if a slice of operations does not have equal amounts.
   */
  equalAmounts(operationsArray) {
    if (operationsArray.length === 0) {
      throw new ParserError(`cannot check equality of 0 operations`);
    }

    const val = AmountValue(operationsArray[0].amount);

    for (let op of operationsArray) {
      const otherVal = AmountValue(op.amount);

      if (val !== otherVal) {
        throw new ParserError(`${op.amount.value} is not equal to ${operationsArray[0].amount.value}`);
      }
    }
  }

  /**
   * Check two operations with opposite amounts.
   *
   * @param {Rosetta:Operation} operationA - one operation.
   * @param {Rosetta:Operation} operationB - another operation.
   * @throws {ParserError} thrown if two operations do not have opposite amounts or not equal.
   */
  oppositeAmounts(operationA, operationB) {
    const valA = AmountValue(operationA.amount);
    const valB = AmountValue(operationB.amount);

    if (new Sign(valA).toString() === new Sign(valB).toString()) {
      throw new ParserError(`${valA} and ${valB} have the same sign`);
    }

    if (Math.abs(valA) !== Math.abs(valB)) {
      throw new ParserError(`${valA} and ${valB} are not equal`);
    }
  }

  /**
   * Check operations array for equal addresses.
   *
   * @param {Rosetta:Operation[]} operations - array of operations.
   * @throws {ParserError} thrown if a slice of operations do not have equal addresses.
   */
  equalAddresses(operations) {
    if (operations.length <= 1) {
      throw new ParserError(`Cannot check address equality of ${operations.length} operations`);
    }

    let base;

    for (let op of operations) {
      if (op.account == null) {
        throw new ParserError(`account is null`);
      }

      if (!base) {
        base = op.account.address;
        continue;
      }

      if (base !== op.account.address) {
        throw new ParserError(`${base} is not equal to ${op.account.address}`);
      }
    }
  }

  /**
   * Check match index
   *
   * @param {Match[]} matchesArray - contains all operations matching a given OperationDescription.
   * @param {number} index - index of operations matching.
   * @throws {ParserError} thrown if match index not valid.
   */
  matchIndexValid(matchesArray, index) {
    if (typeof index != 'number') {
      throw new ParserError(`Index must be a number`);
    }

    if (index >= matchesArray.length) {
      throw new ParserError(`Match index ${index} out of range`);
    }

    if (matchesArray[index] == null) {
      throw new ParserError(`Match index ${index} is null`);
    }
  }

  /**
   * Check operations
   *
   * @param {number[][]} requests2dArray - array for check.
   * @param {Match[]} matchesArray - contains all operations matching a given OperationDescription.
   * @param {function} validCallback - callback function.
   * @throws {ParserError} thrown if index not valid or validCallback not a function.
   */
  checkOps(requests2dArray, matchesArray, validCallback) {
    for (let batch of requests2dArray) {
      const ops = [];

      for (let reqIndex of batch) {
        try {
          this.matchIndexValid(matchesArray, reqIndex);
        } catch (e) {
          throw new ParserError(`${e.message}: index ${reqIndex} not valid`);
        }
        ops.push(...matchesArray[reqIndex].operations);
      }

      if (typeof validCallback !== 'function') {
        throw new ParserError(`validCallback must be a function`);
      }

      validCallback(ops);
    }
  }

  /**
   * ExpectedOperation returns an error if an observed operation
   * differs from the intended operation. An operation is considered
   * to be different from the intent if the AccountIdentifier,
   * Amount, or Type has changed.
   *
   * @param {Rosetta:Operation} intentOperation - intent operation.
   * @param {Rosetta:Operation} observedOperation - observed operation.
   * @throws {ParserError} thrown if an observed operation differs from the intended operation.
   */
  expectedOperation(intentOperation, observedOperation) {
    if (Hash(intentOperation.account) !== Hash(observedOperation.account)) {
      throw new ParserError(`Intended Account ${intentOperation.account} did not ` +
      `match observed account ${observedOperation.account}`);
    }

    if (Hash(intentOperation.amount) !== Hash(observedOperation.amount)) {
      throw new ParserError(`Intended amount ${intentOperation.amount} did not ` +
      `match observed amount ${observedOperation.amount}`);
    }

    if (intentOperation.type !== observedOperation.type) {
      throw new ParserError(`Intended type ${intentOperation.type} did not ` +
      `match observed type ${observedOperation.type}`);
    }
  }

  /**
   * ExpectedOperations returns an error if a slice of intended
   * operations differ from observed operations. Optionally,
   * it is possible to error if any extra observed operations
   * are found or if operations matched are not considered
   * successful.
   *
   * @param {Rosetta:Operation[]} intentOperations - intent operations.
   * @param {Rosetta:Operation[]} observedOperations - observed operations.
   * @param {boolean} errExtra - is possible to error if any extra observed operations are found.
   * @param {boolean} confirmSuccess - check operation success.
   * @throws {ParserError} thrown if a slice of intended operations differ from observed operations.
   */
  expectedOperations(intentOperations, observedOperations, errExtra = false, confirmSuccess = false) {
    if (!Array.isArray(intentOperations))
      throw new ParserError('intentOperations must be an array');

    if (!Array.isArray(observedOperations))
      throw new ParserError('observedOperations must be an array');

    const matches = {};
    const failedMatches = [];

    for (let observed of observedOperations) {
      let foundMatch = false;

      for (let i = 0; i < intentOperations.length; ++i) {
        const intent = intentOperations[i];
        if (matches[i] != null) continue;

        try {
          this.expectedOperation(intent, observed);
        } catch (e) {
          continue;
        }

        if (confirmSuccess) {
          let obsSuccess;
          try {
            obsSuccess = this.asserter.OperationSuccessful(observed);
          } catch (e) {
            throw new ParserError(`Unable to check operation success: ${e.message}`);
          }

          if (!obsSuccess) {
            failedMatches.push(observed);
          }
        }

        matches[i] = true;
        foundMatch = true;
        break;
      }

      if (!foundMatch && errExtra) {
        throw new ParserError(`Found extra operation: ${JSON.stringify(observed)}`);
      }
    }

    const missingIntent = [];
    for (let i = 0; i < intentOperations.length; ++i) {
      if (matches[i] == null) missingIntent.push(i);
    }

    if (missingIntent.length > 0) {
      let errMessage = `Could not intent match ${JSON.stringify(missingIntent)}`;

      if (failedMatches.length > 0) {
        errMessage = `${errMessage}: found matching ops with unsuccessful status: ${errMessage}`;
      }

      throw new ParserError(errMessage);
    }
  }

  /**
   * ExpectedSigners returns an error if a slice of SigningPayload
   * has different signers than what was observed (typically populated
   * using the signers returned from parsing a transaction).
   *
   * @param {Rosetta:SigningPayload[]} intentSigningPayloadArray - SigningPayload array.
   * @param {Rosetta:AccountIdentifier[]} observedArray - observed array.
   * @throws {ParserError} thrown if a slice of SigningPayload has different signers than what was observed.
   */
  expectedSigners(intentSigningPayloadArray, observedArray) {
    if (!Array.isArray(intentSigningPayloadArray))
      throw new ParserError('intentSigningPayloadArray must be an array');

    if (!Array.isArray(observedArray))
      throw new ParserError('observedArray must be an array');

    try {
      this.asserter.StringArray('observed signers', observedArray);
    } catch (e) {
      throw new ParserError(`Found duplicate signer: ${e.message}`);
    }

    const intendedSigners = {};
    for (let payload of intentSigningPayloadArray) {
      intendedSigners[payload.address] = true;
    }

    const seenSigners = {};
    const unmatched = {};

    for (let signer of observedArray) {
      if (intendedSigners[signer] == null) {
        unmatched.push(signer);
      } else {
        seenSigners[signer] = true;
      }
    }

    for (let i = 0; i < Object.keys(intendedSigners).length; ++i) {
      if (seenSigners[i] == null) {
        throw new ParserError(`Could not find match for intended signer: ${i}`);
      }
    }

    if (unmatched.length !== 0) {
      throw new ParserError(`Found unexpected signers: ${JSON.stringify(unmatched)}`);
    }
  }

  /**
   * Ensures collections of operations have either equal or opposite amounts.
   *
   * @param {Descriptions} descriptions - operation descriptions.
   * @param {Match[]} matchesArray - contains all operations matching a given operation description.
   * @throws {ParserError} thrown if operation description not equal to expected.
   */
  comparisonMatch(descriptions, matchesArray) {
    try {
      this.checkOps(descriptions.equal_amounts, matchesArray, this.equalAmounts);
    } catch (e) {
      throw new ParserError(`${e.message}: operation amounts are not equal`);
    }

    try {
      this.checkOps(descriptions.equal_addresses, matchesArray, this.equalAddresses);
    } catch (e) {
      throw new ParserError(`${e.message}: operation addresses are not equal`);
    }

    for (let amountMatch of descriptions.opposite_amounts) {
      if (amountMatch.length !== ExpectedOppositesLength) {
        throw new ParserError(`Cannot check opposites of ${amountMatch.length} operations`);
      }

      // Compare all possible pairs
      try {
        this.matchIndexValid(matchesArray, amountMatch[0]);
      } catch (e) {
        throw new ParserError(`${e.message}: opposite amounts comparison error`);
      }

      try {
        this.matchIndexValid(matchesArray, amountMatch[1]);
      } catch (e) {
        throw new ParserError(`${e.message}: opposite amounts comparison error`);
      }

      const match0Ops = matchesArray[amountMatch[0]].operations;
      const match1Ops = matchesArray[amountMatch[1]].operations;

      this.equalAmounts(match0Ops);
      this.equalAmounts(match1Ops);

      this.oppositeAmounts(match0Ops[0], match1Ops[0]);
    }
  }

  /**
   * MatchOperations attempts to match a slice of operations with a slice of
   * OperationDescriptions (high-level descriptions of what operations are
   * desired). If matching succeeds, a slice of matching operations in the
   * mapped to the order of the descriptions is returned.
   *
   * @param {Descriptions} descriptions - operation descriptions.
   * @param {Rosetta:Operation[]} operationsArray - array of operations.
   * @return {Match[]} - slice of matching operations in the mapped to the order of the descriptions.
   * @throws {ParserError} thrown if operations or description arrays empty or problem with match for operation.
   */
  MatchOperations(descriptions, operationsArray) {
    if (operationsArray.length === 0) {
      throw new ParserError(`Unable to match anything to zero operations`);
    }

    const operationDescriptions = descriptions.operation_descriptions;
    const matches = new Array(operationDescriptions.length).fill(null);

    if (operationDescriptions.length === 0) {
      throw new ParserError(`No descriptions to match`);
    }

    for (let i = 0; i < operationsArray.length; ++i) {
      const op = operationsArray[i];
      const matchFound = this.operationMatch(op, operationDescriptions, matches);

      if (!matchFound && descriptions.err_unmatched) {
        throw new ParserError(`Unable to find match for operation at index ${i}`);
      }
    }

    for (let i = 0; i < matches.length; ++i) {
      if (matches[i] === null && !descriptions.operation_descriptions[i].optional) {
        throw new ParserError(`Could not find match for description ${i}`);
      }
    }

    try {
      this.comparisonMatch(descriptions, matches);
    } catch (e) {
      throw new ParserError(`${e.message}: group descriptions not met`);
    }

    return matches;
  }
}

RosettaParser.Match = Match;

module.exports = RosettaParser;
