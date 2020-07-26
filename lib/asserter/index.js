/**
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

const fs = require('fs');

const { AsserterError } = require('../errors');
const RosettaClient = require('rosetta-client');

const { Hash } = require('../utils');

class RosettaAsserter {
  constructor({networkIdentifier, operationTypes = [], operationStatuses = [],
    errorTypes = [], genesisBlockIdentifier, supportedNetworks} = {}) {

    this.networkIdentifier = networkIdentifier;
    this.operationTypes = operationTypes;
    this.genesisBlockIdentifier = genesisBlockIdentifier;
    this.supportedNetworks = supportedNetworks;

    this.operationStatusMap = {};
    this.errorTypeMap = {};

    if (operationStatuses && typeof operationStatuses == 'object' && Array.isArray(operationStatuses)) {
      for (const operationStatus of operationStatuses) {
        this.operationStatusMap[operationStatus.status] = operationStatus.successful;
      }
    }

    if (errorTypes && typeof errorTypes == 'object' && Array.isArray(errorTypes)) {
      for (const errorType of errorTypes) {
        this.errorTypeMap[errorType.code] = errorType;
      }
    }    
  }

  SupportedNetworks(supportedNetworks) {
    if (!Array.isArray(supportedNetworks)) {
      throw new AsserterError('SupportedNetworks must be an array');
    }

    if (supportedNetworks.length == 0) {
      throw new AsserterError('NetworkIdentifier Array contains no supported networks');
    }

    const parsedNetworks = [];

    for (let network of supportedNetworks) {
      this.NetworkIdentifier(network);
      if (parsedNetworks.includes(network)) {
        throw new AsserterError(`SupportedNetwork has a duplicate: ${network}`);
      }

      parsedNetworks.push(network);
    }
  }

  SupportedNetwork(networkIdentifier) {
    if (this.supportedNetworks.includes(networkIdentifier)) {
      throw new AsserterError(`SupportedNetwork ${networkIdentifier} is not supported by this supporter`);
    }
  }

  AccountBalanceRequest(accountBalanceRequest) {
    if (accountBalanceRequest == null) {
      throw new AsserterError('accountBalanceRequest is null');
    }

    this.NetworkIdentifier(accountBalanceRequest.network_identifier);
    this.SupportedNetwork(accountBalanceRequest.network_identifier);
    this.AccountIdentifier(accountBalanceRequest.account_identifier);

    if (accountBalanceRequest == null) {
      return;
    }

    this.PartialBlockIdentifier((accountBalanceRequest.block_identifier));
  }

  BlockRequest(blockRequest) {
    if (blockRequest == null) {
      throw new AsserterError('blockRequest is null');
    }

    this.NetworkIdentifier(blockRequest.network_identifier);
    this.SupportedNetwork(blockRequest.network_identifier);

    this.PartialBlockIdentifier(blockRequest.block_identifier);
  }

  BlockTransactionRequest(blockTransactionRequest) {
    if (blockTransactionRequest == null) {
      throw new AsserterError('blockTransactionRequest is null');
    }

    this.NetworkIdentifier(blockTransactionRequest.network_identifier);
    this.SupportedNetwork(blockTransactionRequest.network_identifier);
    this.BlockIdentifier(blockTransactionRequest.block_identifier);
    this.TransactionIdentifier(blockTransactionRequest.transaction_identifier);
  }

  ConstructionMetadataRequest(constructionMetadataRequest) {
    if (constructionMetadataRequest == null) {
      throw new AsserterError('constructionMetadataRequest is null');
    }

    this.NetworkIdentifier(constructionMetadataRequest.network_identifier);
    this.SupportedNetwork(constructionMetadataRequest.network_identifier); 

    if (constructionMetadataRequest.options == null) {
      throw new AsserterError('constructionMetadataRequest.options is null');
    }   
  }

  ConstructionSubmitRequest(constructionSubmitRequest) {
    if (constructionSubmitRequest == null) {
      throw new AsserterError('constructionSubmitRequest.options is null');
    }

    this.NetworkIdentifier(constructionSubmitRequest.network_identifier);
    this.SupportedNetwork(constructionSubmitRequest.network_identifier);

    if (!constructionSubmitRequest.signed_transaction) {
      throw new AsserterError('constructionSubmitRequest.signed_transaction is empty');
    }
  }

  MempoolRequest(mempoolRequest) {
    if (mempoolRequest == null) {
      throw new AsserterError('mempoolRequest is null');
    }

    this.NetworkIdentifier(mempoolRequest.network_identifier);
    this.SupportedNetwork(mempoolRequest.network_identifier);
  }

  MempoolTransactionRequest(mempoolTransactionRequest) {
    if (mempoolTransactionRequest == null) {
      throw new AsserterError('mempoolTransactionRequest is null');
    }

    this.NetworkIdentifier(mempoolTransactionRequest.network_identifier);
    this.SupportedNetworks(mempoolTransactionRequest.network_identifier);
    this.TransactionIdentifier(mempoolTransactionRequest.transaction_identifier);
  }

  MetadataRequest(metadataRequest) {
    if (metadataRequest == null) {
      throw new AsserterError('metadataRequest is null');
    }
  }

  NetworkRequest(networkRequest) {
    if (networkRequest == null) {
      throw new AsserterError('networkRequest is null');
    }

    this.NetworkIdentifier(networkRequest.network_identifier);
    this.SupportedNetworks(networkRequest.network_identifier);
  }

  ConstructionMetadata(constructionMetadataResponse) {
    if (constructionMetadataResponse.metadata == null) {
      throw new AsserterError('constructionMetadataResponse.metadata is null');
    }
  }

  ConstructionSubmit(constructionSubmitResponse) {
    // ToDo: Null Check?
    // Note, this is not in the reference implementation (Go)
    this.TransactionIdentifier(constructionSubmitResponse.transaction_identifier);
  }

  MempoolTransactions(transactionIdentifiers) {
    for (let t of transactionIdentifiers) {
      this.TransactionIdentifier(t);
    }
  }

  NetworkIdentifier(networkIdentifier) {
    if (networkIdentifier == null)
      throw new AsserterError('NetworkIdentifier is null');

    if (!networkIdentifier.blockchain)
      throw new AsserterError('NetworkIdentifier.blockchain is missing');

    if (!networkIdentifier.network)
      throw new AsserterError('NetworkIdentifier.network is missing');

    return this.SubNetworkIdentifier(networkIdentifier.sub_network_identifier);
  }

  SubNetworkIdentifier(subnetworkIdentifier) {
    // Only check if specified in the response.
    if (subnetworkIdentifier == null) return;

    if (!subnetworkIdentifier.network) {
      throw new AsserterError('NetworkIdentifier.sub_network_identifier.network is missing');
    }
  }

  Peer(peer) {
    if (peer == null || !peer.peer_id) {
      throw new AsserterError('Peer.peer_id is missing');
    }
  }

  Version(version) {
    if (version == null) {
      throw new AsserterError('Version is null');
    }

    if (!version.node_version) {
      throw new AsserterError('Version.node_version is missing');
    }

    if (version.middleware_version != null && !version.middleware_version) {
      throw new AsserterError('Version.middleware_version is missing');
    }
  }

  StringArray(name, array) {
    if (array.length == 0) {
      throw new AsserterError(`No ${name} found`);
    }

    const existing = [];

    for (let element of array) {
      if (!element) {
        throw new AsserterError(`${name} has an empty string`);
      }

      if (existing.includes(element)) {
        throw new AsserterError(`${name} contains a duplicate element: ${element}`);
      }

      existing.push(element);
    }
  }

  Timestamp(timestamp = 0) {
    if (timestamp < RosettaAsserter.MinUnixEpoch) {
      throw new AsserterError(`Timestamp ${timestamp} is before 01/01/2000`);      
    } else if (timestamp > RosettaAsserter.MaxUnixEpoch) {
        throw new AsserterError(`Timestamp ${timestamp} is after 01/01/2040`);
    } else {
      return null;
    }
  }

  NetworkStatusResponse(networkStatusResponse) {
    if (networkStatusResponse == null) {
      throw new AsserterError('networkStatusResponse is null');
    }

    this.BlockIdentifier(networkStatusResponse.current_block_identifier);
    this.Timestamp(networkStatusResponse.current_block_timestamp);
    this.BlockIdentifier(networkStatusResponse.genesis_block_identifier);

    for (let peer of networkStatusResponse.peers) {
      this.Peer(peer);
    }
  }

  OperationStatuses(operationStatuses) {
    if (operationStatuses == null || operationStatuses.length == 0) {
      throw new AsserterError('No Allow.operation_statuses found');
    }

    const existingStatuses = [];
    let foundSuccessful = false;

    for (let status of operationStatuses) {
      if (!status.status) {
        throw new AsserterError('Operation.status is missing');
      }

      if (status.successful) {
        foundSuccessful = true;
      }

      existingStatuses.push(status.status);
    }

    if (!foundSuccessful) {
      throw new AsserterError('No successful Allow.operation_statuses found');
    }

    return this.StringArray("Allow.operation_statuses", existingStatuses);
  }

  OperationTypes(types) {
    return this.StringArray('Allow.operation_statuses', types);
  }

  Error(error) {
    if (error == null) {
      throw new AsserterError('Error is null');
    }

    if (error.code < 0) {
      throw new AsserterError('Error.code is negative');
    }

    if (!error.message) {
      throw new AsserterError('Error.message is missing');
    }
  }

  Errors(rosettaErrors = []) {
    const statusCodeMap = {};

    for (let rosettaError of rosettaErrors) {
      this.Error(rosettaError);

      if (statusCodeMap[rosettaError.code] != null) {
        throw new AsserterError('Error code used multiple times');
      }

      statusCodeMap[rosettaErrors.code] = true;
    }
  }

  Allow(allowed) {
    if (allowed == null) {
      throw new AsserterError('Allow is null');
    }

    this.OperationStatuses(allowed.operation_statuses);
    this.OperationTypes(allowed.operation_types);
    this.Errors(allowed.errors);
  }

  NetworkOptionsResponse(networkOptionsResponse) {
    if (networkOptionsResponse == null) {
      throw new AsserterError('NetworkOptions Response is null');
    }

    this.Version(networkOptionsResponse.version);
    return this.Allow(networkOptionsResponse.allow);
  }

  containsNetworkIdentifier(networks, network) {
    const networkString = String.from(network);
    const index = networks.findIndex((n) => String.from(n) == networkString);
    return index >= 0;
  }

  NetworkListResponse(networkListResponse) {
    if (networkListResponse == null) {
      throw new AsserterError('NetworkListResponse is null');
    }

    const existingNetworks = [];

    for (let network of networkListResponse.network_identifiers) {
      this.NetworkIdentifier(network);
      if (this.containsNetworkIdentifier(existingNetworks, network)) {
        throw new AsserterError('NetworkListResponse.Network contains duplicated');
      }

      existingNetworks.push(network);
    }
  }

  containsCurrency(currencies, currency) {
    let currencyIndex = currencies.findIndex((a) => 
        Hash(a) == Hash(currency));

    return currencyIndex >= 0;
  }

  assertBalanceAmounts(amountsArray) {
    const currencies = [];

    for (let amount of amountsArray) {
      let containsCurrency = this.containsCurrency(currencies, amount.currency);
      
      if (containsCurrency) {
        throw new AsserterError(`Currency ${amount.currency.symbol} used in balance multiple times`);
      }

      currencies.push(amount.currency);
      this.Amount(amount);
    }
  }

  Amount(amount) {
    if (amount == null || amount.value == '') {
      throw new AsserterError(`Amount.value is missing`);

    }

    // Allow all numbers, except e notation, or negative numbers.
    if (!/^-?[0-9]+$/.test(amount.value)) {
      throw new AsserterError(`Amount.value is not an integer: ${amount.value}`);
    }

    if (amount.currency == null) {
      throw new AsserterError('Amount.currency is null');
    }

    if (!amount.currency.symbol) {
      throw new AsserterError('Amount.currency does not have a symbol');
    }

    if (amount.currency.decimals < 0) {
      throw new AsserterError(`Amount.currency.decimals must be positive. Found: ${amount.currency.decimals}`);
    }
  }

  AccountBalanceResponse(partialBlockIdentifier, blockIdentifier, amountArray) {
    this.BlockIdentifier(blockIdentifier);
    this.assertBalanceAmounts(amountArray);

    if (partialBlockIdentifier == null) {
      return;
    }

    if (partialBlockIdentifier.hash != null && partialBlockIdentifier.hash != blockIdentifier.hash) {
      throw new AsserterError(`Request BlockHash ${partialBlockIdentifier.hash}` + 
        ` does not match Response block hash ${blockIdentifier.hash}`);
    }

    if (partialBlockIdentifier.index != null && partialBlockIdentifier.index != blockIdentifier.index) {
      throw new AsserterError(`Request Index ${partialBlockIdentifier.index}` + 
        ` does not match Response block index ${blockIdentifier.index}`);
    }
  }

  OperationIdentifier(operationIdentifier, index) {
    if (typeof index !== 'number') {
      throw new AsserterError('OperationIdentifier: index must be a number');
    }

    if (operationIdentifier == null) {
      throw new AsserterError('OperationIdentifier is null');
    }

    if (operationIdentifier.index != index) {
      throw new AsserterError(`OperationIdentifier.index ${operationIdentifier.index} is out of order, expected ${index}`);
    }

    if (operationIdentifier.network_index != null && operationIdentifier.network_index < 0) {
      throw new AsserterError('OperationIdentifier.network_index is invalid');
    }
  }

  AccountIdentifier(accountIdentifier) {
    if (accountIdentifier == null) {
      throw new AsserterError('Account is null');
    }

    if (!accountIdentifier.address) {
      throw new AsserterError('Account.address is missing');
    }

    if (accountIdentifier.sub_account == null) {
      return;
    }

    if (!accountIdentifier.sub_account.address) {
      throw new AsserterError('Account.sub_account.address is missing');
    }
  }

  OperationStatus(status) {
    if (status == null) {
      throw new AsserterError('Asserter not initialized');
    }

    if (typeof status !== 'string') {
      throw new AsserterError('OperationStatus.status must be a string');
    }

    if (status == '') {
      throw new AsserterError('OperationStatus.status is empty');
    }

    if (this.operationStatusMap[status] == null) {
      throw new AsserterError(`OperationStatus.status ${status} is not valid within this Asserter`);
    }
  }

  OperationType(type) {
    if (typeof type !== 'string') {
      throw new AsserterError('OperationStatus.type must be a string');
    }

    if (type == '' || !this.operationTypes.includes(type)) {
      throw new AsserterError(`Operation.type ${type} is invalid`);
    }
  }

  Operation(operation, index, construction = false) {
    if (operation == null) {
      throw new AsserterError('Operation is null');
    }

    this.OperationIdentifier(operation.operation_identifier, index);
    this.OperationType(operation.type);

    if (construction) {
      if (operation.status && operation.status.length > 0) {
        throw new AsserterError('Operation.status must be empty for construction');
      }
    } else {
      this.OperationStatus(operation.status);
    }

    if (operation.amount == null) {
      return null;
    }

    this.AccountIdentifier(operation.account);
    this.Amount(operation.amount);
  }

  BlockIdentifier(blockIdentifier) {
    if (blockIdentifier == null) {
      throw new AsserterError('BlockIdentifier is null');
    }

    if (!blockIdentifier.hash) {
      throw new AsserterError('BlockIdentifier.hash is missing');
    }

    if (blockIdentifier.index < 0) {
      throw new AsserterError('BlockIdentifier.index is negative');
    }
  }

  PartialBlockIdentifier(partialBlockIdentifier) {
    if (partialBlockIdentifier == null) {
      throw new AsserterError('BlockIdentifier.hash is missing');
    }

    if (!!partialBlockIdentifier.hash) {
      return null;
    }

    if (partialBlockIdentifier.index != null && partialBlockIdentifier.index >= 0) {
      return null;
    }

    throw new AsserterError('Neither PartialBlockIdentifier.hash nor PartialBlockIdentifier.index is set');
  }

  TransactionIdentifier(transactionIdentifier) {
    if (transactionIdentifier == null) {
      throw new AsserterError('TransactionIdentifier is null');
    }

    if (!transactionIdentifier.hash) {
      throw new AsserterError('TransactionIdentifier.hash is missing');
    }
  }

  Transaction(transaction) {
    if (transaction == null) {
    }

    this.TransactionIdentifier(transaction.transaction_identifier);

    if (!Array.isArray(transaction.operations)) {
      throw new AsserterError('Transaction.operations must be an array');
    }

    for (let i = 0; i < transaction.operations.length; ++i) {
      const operation = transaction.operations[i];
      this.Operation(operation, i);

      const relatedIndices = [];

      if (!operation.related_operations) continue;

      for (let relatedOperation of operation.related_operations) {
        if (relatedOperation.index >= operation.operation_identifier.index) {
          throw new AsserterError(`Related operation index ${relatedOperation.index}` +
            ` >= operation index ${operation.operation_identifier.index}`);
        }

        if (relatedIndices.includes(relatedOperation.index)) {
          throw new AsserterError(`Found duplicate related operation index`+
            ` ${relatedOperation.index} for operation index ${operation.operation_identifier.index}`);
        }

        relatedIndices.push(relatedOperation.index);
      }
    }
  }

  Block(block) {
    if (block == null) {
      throw new AsserterError('Block is null');
    }

    this.BlockIdentifier(block.block_identifier);
    this.BlockIdentifier(block.parent_block_identifier);

    if (this.genesisBlockIdentifier.index != block.block_identifier.index) {
      if (block.block_identifier.hash == block.parent_block_identifier.hash) {
        throw new AsserterError('BlockIdentifier.hash == ParentBlockIdentifier.hash');
      }

      if (block.block_identifier.index <= block.parent_block_identifier.index) {
        throw new AsserterError('BlockIdentifier.index <= ParentBlockIdentifier.index');
      }

      this.Timestamp(block.timestamp);
    }

    for (let transaction of block.transactions) {
      this.Transaction(transaction);
    }
  }

  static NewServer(supportedNetworks) {
    return new Asserter({
      supportedNetworks,
    });
  }

  static NewClientWithFile(filePath) {
    const buffer = fs.readFileSync(filePath);
    const contents = buffer.toString();
    const json = JSON.parse(contents);

    return RosettaAsserter.NewClientWithOptions(
      json.network_identifier,
      json.genesis_block_identifier,
      json.allowed_operation_types,
      json.allowed_operation_statuses,
      json.allowed_errors,
    );
  }

  static NewClientWithResponses(networkIdentifier, networkStatus, networkOptions) {
    const tmp = new RosettaAsserter();

    tmp.NetworkIdentifier(networkIdentifier);
    tmp.NetworkStatusResponse(networkStatus);
    tmp.NetworkOptionsResponse(networkOptions);

    return RosettaAsserter.NewClientWithOptions(
      networkIdentifier,
      networkStatus.genesis_block_identifier,
      networkOptions.allow.operation_types,
      networkOptions.allow.operation_statuses,
      networkOptions.allow.errors,
    );
  }

  OperationSuccessful(operation) {
    const status = this.operationStatusMap[operation.status];

    if (status == null) {
      throw new AsserterError(`${operation.status} not found in possible statuses`);
    }

    return status;
  }

  getClientConfiguration() {
    const operationStatuses = [];
    const errors = [];

    for (let key of Object.keys(this.operationStatusMap)) {
      const value = this.operationStatusMap[key];
      const operationStatus = new RosettaClient.OperationStatus(key, value);

      // Validate
      // this.OperationStatus(operationStatus);

      operationStatuses.push(operationStatus);
    }

    for (let key of Object.keys(this.errorTypeMap)) {
      const value = this.errorTypeMap[key];
      errors.push(value);
    }

    const ret = {
      network_identifier: this.networkIdentifier,
      genesis_block_identifier: this.genesisBlockIdentifier,
      allowed_operation_types: this.operationTypes,
      allowed_operation_statuses: operationStatuses,
      allowed_errors: errors,
    };

    return ret;
  }

  static NewClientWithOptions(networkIdentifier, genesisBlockIdentifier,
    operationTypes, operationStatuses = [], errors = []) {

    const tmp = new RosettaAsserter();

    tmp.NetworkIdentifier(networkIdentifier);
    tmp.BlockIdentifier(genesisBlockIdentifier);
    tmp.OperationStatuses(operationStatuses);
    tmp.OperationTypes(operationTypes);  

    const r = new RosettaAsserter({
      networkIdentifier,
      operationTypes,
      genesisBlockIdentifier: genesisBlockIdentifier,
    });

    r.errorTypeMap = (() => {
      const ret = {};

      for (let error of errors) {
        ret[error.code] = error;
      }

      return ret;        
    })();

    r.operationStatusMap = (() => {
      const ret = {};

      for (let status of operationStatuses) {
        ret[status.status] = status.successful;
      }

      return ret;
    })();

    return r;
  }
}

RosettaAsserter.MinUnixEpoch = 946713600000; // 01/01/2000 at 12:00:00 AM.
RosettaAsserter.MaxUnixEpoch = 2209017600000; // 01/01/2040 at 12:00:00 AM.

module.exports = RosettaAsserter;