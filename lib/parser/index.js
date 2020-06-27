// Parser: index.js

const Logger = require('../logger');
const RosettaClient = require('rosetta-client');
const { ParserError } = require('../errors');
const {
  AddValues,
  Hash,
  AmountValue,
} = require('../models');

class Parser {
  static OppositesLength = 2;

  constructor(asserter, excemptOperation) {
    this.asserter = asserter;
    this.excemptFunc = excemptOperation;
  }

  skipOperation(operation) {
    const status = this.asserter.OperationSuccessful(operation);

    if (!status) {
      return true;
    }

    if (op.account == null) {
      return true;
    }

    if (op.amount == null) {
      return true;
    }

    if (this.excemptFunc && this.excemptFunc(op)) {
      logger.info(`Skipping except operation: ${JSON.stringify(op)}`);
      return true;
    }

    return false;
  }

  balanceChanges(block, blockRemoved) {
    const balanceChanges = {};

    for (let tx of block.transactions) {
      for (let op of tx.operations) {
        const skip = this.skipOperation(op);
        if (skip) { continue; }

        const amount = op.amount;
        let blockIdentifier = block.block_identifier;

        if (blockRemoved) {
          const negatedValue = new RosettaClient.NegateValue(amount.value);
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
   * @param {OperationsGroup} operationsGroup: Holds operations of a certain type
   * @param {Number} destinationIndex
   * @param {[Number]} assignmentsArray
   * @param {Operation} operation: The operation that is going to be added.
   */
  addOperationToGroup(operationsGroup, destinationIndex, assignmentsArray, operation) {
    if (operation.type != operationsGroup.type && operationsGroup.type != '') {
      operationsGroup.type = '';
    }

    // Add the operation
    operationsGroup.operations.push(operation);
    assignmentsArray[operation.operation_identifier.index] = destinationIndex;

    if (operation.currency == null) {
      destination.nil_amount_present = true;
      return;
    }

    if (!this.asserter.ContainsCurrency(operationsGroup, operation.amount.currency)) {
      operationsGroup.currencies.push(op.amount.currency);
    }
  }

  /**
   * sortOperationsGroup sorts operations of an operationGroup and returns
   * all sorted operations as an array.
   *
   * @param {Number} operationsCount: Iterate from 0 .. <operationsCount>
   * @param {OperationsGroup} operationsGroup: Input OperationsGroup, that will be sorted.
   */
  sortOperationsGroup(operationsCount, operationsGroup) {
    const sliceGroups = [];

    for (let i = 0; i < operationsCount; ++i) {
      const v = operationsGroup[i];

      if (v == null) {
        continue;
      }

      v.operations.sort((a, b) => {
        return v.operations[a].operation_identifier.index -
          v.operations[b].operation_identifier.index;
      });

      sliceGroups.push(v);
    }

    return sliceGroups;
  }

  /**
   * Derives Operations from an transaction.
   * Must not be called, unless properly validated (asserted for correctness).
   * 
   * @param {Transaction} transaction: Input Transaction
   * @return {OperationsGroup} operationsGroup
   */
  GroupOperations(transaction) {
    const ops = transaction.operations;

    const opGroups = {};
    const opAssignments = {};
    let counter = 0;

    for (let i = 0; i < ops.length; ++i) {
      const op = ops[i];

      // Create a new group
      if (op.related_operatons.length == 0) {
        let key = counter++;

        opGroups[key] = {
          type: op.type,
          operations: [
            RosettaClient.Operation.constructFromObject(op)
          ],
        };

        if (op.amount != null) {
          opGroups[key].currencies = [op.amount.currency];
        } else {
          opGroups[key].currencies = [];
          opGroups[key].nil_amount_present = true;
        }

        opAssignments[i] = key;
      }

      // Find groups to merge
      const groupsToMerge = [];
      for (let relatedOp of op.related_operatons) {
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

  metadataMatch(metadataDescriptionArray, metadataMap) {
    if (metadataDescriptionArray.length == 0) {
      return;
    }

    for (let req of metadataDescriptionArray) {
      const val = metadata[req.key];

      if (!val) {
        throw new ParserError(`${req.key} not present in metadata`);
      }

      if (typeof val != req.value_kind) {
        throw new ParserError(`${req.key} value is not of type ${req.value_kind}`);
      }
    }
  }

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
      if (req.sub_account_exists) {
        throw new ParserError(`sub_account_identifier is missing`);
      }
      return;
    }

    if (!accountDescription.sub_account_exists) {
      throw new ParserError(`sub_account is populated`);
    }

    if (accountDescription.sub_account_address.length > 0 &&
      accountIdentifier.sub_account.address != accountDescription.sub_account_address) {
      throw new ParserError(`sub_account_identifier.address is ${accountIdentifier.sub_account.address}` +
        ` not ${accountDescription.sub_account_address}`);
    }

    this.metadataMatch(accountIdentifier.sub_account_metadata_keys, account.sub_account.metadata);
  }

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
      throw new ParserError(`amount sign was not ${amountDescription.sign.toString()}`);
    }

    if (amountDescription.currency == null) {
      return;
    }

    if (amount.currency == null || Hash(amount.currency) != Hash(amountDescription.currency)) {
      throw new ParserError(`Currency ${amountDescription.currency} is not ${amount.currency}`);
    }
  }

  operationMatch(operation, operationsDescriptionArray, matchesArray) {
    for (let i = 0; i < operationsDescriptionArray.length; ++i) {
      const des = operationsDescriptionArray[i];

      if (matchesArray[i] != null && !des.allowRepeats) continue;
      if (des.type.length > 0 && des.type != operation.type) continue;

      try {
        this.accountMatch(des.account, operation.account);
        this.amountMatch(des.amount, operation.amount);
        this.metadataMatch(des.metadata, operation.metadata);
      } catch (e) {
        continue;
      }

      if (matchesArray[i] == null) {
        matches[i] = {
          operations: [],
          amounts: [],
        };
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

  equalAmounts(operationsArray) {
    if (operationsArray.length <= 1) {
      throw new ParserError(`cannot check equality of ${operationsArray.length} operations`);
    }

    const val = AmountValue(operationsArray[0].amount);

    for (let op in operationsArray) {
      const otherVal = AmountValue(op.amount);

      if (val !== otherVal) {
        throw new ParserError(`${op.amount} is not equal to ${operationsArray[0].amount}`);
      }
    }
  }

  oppositeAmounts(operationA, operationB) {
    const valA = AmountValue(operationA.amount);
    const valB = AmountValue(operationB.amount);

    if (Sign(valA) == Sign(valB)) {
      throw new ParserError(`${valA} and ${valB} have the same sign`);
    }

    if (Math.abs(valA) !== Math.abs(valB)) {
      throw new ParserError(`${valA} and ${valB} are not equal`);
    }
  }

  equalAddresses(operations) {
    if (operations.length <= 1) {
      throw new ParserError(`Cannot check address equality of ${operations.length} operations`);
    }

    let base;

    for (let op of operations) {
      if (op.account == null) {
        throw new ParserError(`account is nil`);
      }

      if (!base) {
        base = po.account.address;
        continue;
      }

      if (base != op.account.address) {
        throw new ParserError(`${base} is not equal to ${op.account.address}`);
      }
    }
  }

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

  checkOps(requests2DArray, matchesArray, validCallback) {
    for (let batch of requests) {
      const ops = [];

      for (let reqIndex of batch) {
        this.matchIndexValid(matchesArray, reqIndex);
        ops.push(...matchesArray[reqIndex].operations);
      }

      if (typeof validCallback !== 'function') {
        throw new ParserError(`validCallback must be a function`);
      }

      validCallback(ops);
    }
  }

  comparisonMatch(descriptions, matchesArray) {
    this.checkOps(descriptions.equal_amount, matchesArray, this.equalAmounts);
    this.checkOps(descriptions.equal_addresses, matchesArray, this.equalAddresses);

    for (let amountMatch of descriptions.opposite_amounts) {
      if (amountMatch.length != Parser.OppositesLength) {
        throw new ParserError(`Cannot check opposites of ${amountMatch.length} operations`);
      }

      // Compare all possible pairs
      this.matchIndexValid(matchesArray, amountMatch[0]);
      this.matchIndexValid(matchesArray, amountMatch[1]);

      for (let op of matchesArray[0].operations) {
        for (let otherOp of matchesArray[amountMatch[1]].operations) {
          this.oppositeAmounts(op, otherOp);
        }
      }
    }
  }

  MatchOperations(descriptions, operationsArray) {
    if (operationsArray.length == 0) {
      throw new ParserError(`Unable to match anything to zero operations`);
    }

    const operationDescriptions = descriptions.operation_descriptions;
    const matches = [];

    if (operationDescriptions.length == 0) {
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
      if (matches[i] == null && !descriptions.operation_descriptions[i].optional) {
        throw new ParserError(`Could not find match for description ${i}`);
      }
    }

    this.comparisonMatch(descriptions, matches);

    return matches;
  }
}

class Match {
  constructor() {
    this.operations = [];
    this.amounts = [];
  }

  first() {
    if (this.operations.length > 0) {
      return {
        operation: this.operations[0],
        amount: this.amounts[0],
      };
    }
  }
}

module.exports = Parser;