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
const RosettaClient = require('rosetta-node-sdk-client');

const Types = RosettaClient;

const { Hash } = require('../utils');

class RosettaAsserter {
  constructor({networkIdentifier, operationTypes = [], operationStatuses = [],
    errorTypes = [], genesisBlockIdentifier, supportedNetworks = [], historicalBalanceLookup = false} = {}) {

    this.networkIdentifier = networkIdentifier;
    this.operationTypes = operationTypes;
    this.genesisBlockIdentifier = genesisBlockIdentifier;
    this.supportedNetworks = supportedNetworks;
    this.historicalBalanceLookup = historicalBalanceLookup;

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
      if (parsedNetworks.includes(Hash(network))) {
        throw new AsserterError(`SupportedNetwork has a duplicate: ${JSON.stringify(network)}`);
      }

      parsedNetworks.push(Hash(network));
    }
  }

  SupportedNetwork(networkIdentifier) {
    const index = this.supportedNetworks.findIndex(network => 
      Hash(network) == Hash(networkIdentifier)
    );

    if (index == -1) {
      throw new AsserterError(`Network ${JSON.stringify(networkIdentifier)} is not supported`);
    }
  }

  ValidSupportedNetwork(requestNetwork) {
    this.NetworkIdentifier(requestNetwork);
    this.SupportedNetwork(requestNetwork);
  }

  AccountBalanceRequest(accountBalanceRequest) {
    if (accountBalanceRequest == null) {
      throw new AsserterError('AccountBalanceRequest is null');
    }

    this.ValidSupportedNetwork(accountBalanceRequest.network_identifier);
    this.AccountIdentifier(accountBalanceRequest.account_identifier);

    if (accountBalanceRequest.block_identifier == null) {
      return;
    }

    if (!this.historicalBalanceLookup) {
      throw new AsserterError(`historical balance loopup is not supported`);
    }

    this.PartialBlockIdentifier(accountBalanceRequest.block_identifier);
  }

  BlockRequest(blockRequest) {
    if (blockRequest == null) {
      throw new AsserterError('BlockRequest is null');
    }

    this.ValidSupportedNetwork(blockRequest.network_identifier);
    this.PartialBlockIdentifier(blockRequest.block_identifier);
  }

  BlockTransactionRequest(blockTransactionRequest) {
    if (blockTransactionRequest == null) {
      throw new AsserterError('BlockTransactionRequest is null');
    }

    this.ValidSupportedNetwork(blockTransactionRequest.network_identifier);
    this.BlockIdentifier(blockTransactionRequest.block_identifier);
    this.TransactionIdentifier(blockTransactionRequest.transaction_identifier);
  }

  ConstructionMetadataRequest(constructionMetadataRequest) {
    if (constructionMetadataRequest == null) {
      throw new AsserterError('ConstructionMetadataRequest is null');
    }

    this.ValidSupportedNetwork(constructionMetadataRequest.network_identifier);

    if (constructionMetadataRequest.options == null) {
      throw new AsserterError('ConstructionMetadataRequest.options is null');
    }   
  }

  ConstructionSubmitRequest(constructionSubmitRequest) {
    if (constructionSubmitRequest == null) {
      throw new AsserterError('ConstructionSubmitRequest.options is null');
    }

    this.ValidSupportedNetwork(constructionSubmitRequest.network_identifier);

    if (!constructionSubmitRequest.signed_transaction) {xr
      throw new AsserterError('ConstructionSubmitRequest.signed_transaction is empty');
    }
  }

  MempoolTransactionRequest(mempoolTransactionRequest) {
    if (mempoolTransactionRequest == null) {
      throw new AsserterError('MempoolTransactionRequest is null');
    }

    this.ValidSupportedNetwork(mempoolTransactionRequest.network_identifier);
    this.TransactionIdentifier(mempoolTransactionRequest.transaction_identifier);
  }

  MetadataRequest(metadataRequest) {
    if (metadataRequest == null) {
      throw new AsserterError('MetadataRequest is null');
    }
  }

  NetworkRequest(networkRequest) {
    if (networkRequest == null) {
      throw new AsserterError('NetworkRequest is null');
    }

    this.ValidSupportedNetwork(networkRequest.network_identifier);
  }

  ConstructionMetadataResponse(constructionMetadataResponse) {
    if (constructionMetadataResponse == null) {
      throw new AsserterError('ConstructionMetadataResponse cannot be null');
    }

    if (constructionMetadataResponse.metadata == null) {
      throw new AsserterError('ConstructionMetadataResponse.metadata is null');
    }
  }

  TransactionIdentifierResponse(transactionIdentifierResponse) {
    if (transactionIdentifierResponse == null) {
      throw new AsserterError('transactionIdentifierResponse cannot be null');
    }

    // Note, this is not in the reference implementation (Go)
    this.TransactionIdentifier(transactionIdentifierResponse.transaction_identifier);
  }

  ConstructionCombineResponse(constructionCombineResponse) {
    if (constructionCombineResponse == null) {
      throw new AsserterError('constructionCombineResponse cannot be null');
    }

    if (typeof constructionCombineResponse.signed_transaction !== 'string') {
      throw new AsserterError('constructionCombineResponse.signed_transaction must be a string');
    }

    if (!constructionCombineResponse.signed_transaction) {
      throw new AsserterError('constructionCombineResponse.signed_transaction cannot be empty');
    }
  }

  ConstructionDeriveResponse(constructionDeriveResponse) {
    if (constructionDeriveResponse == null) {
      throw new AsserterError('constructionDeriveResponse cannot be null');
    }

    if (typeof constructionDeriveResponse.address !== 'string') {
      throw new AsserterError('constructionDeriveResponse.address must be a string');
    }

    if (!constructionDeriveResponse.address) {
      throw new AsserterError('constructionDeriveResponse.address cannot be empty');
    }
  }

  ConstructionDeriveRequest(constructionDeriveRequest) {
    if (constructionDeriveRequest == null) {
      throw new AsserterError('ConstructionDeriveRequest cannot be null');
    }

    this.ValidSupportedNetwork(constructionDeriveRequest.network_identifier);
    this.PublicKey(constructionDeriveRequest.public_key);
  }

  ConstructionPreprocessRequest(constructionPreprocessRequest) {
    if (constructionPreprocessRequest == null) {
      throw new AsserterError('constructionPreprocessRequest cannot be null');
    }

    this.ValidSupportedNetwork(constructionPreprocessRequest.network_identifier);
    this.Operations(constructionPreprocessRequest.operations, true);
  }

  ConstructionPayloadsRequest(constructionPayloadsRequest) {
    if (constructionPayloadsRequest == null) {
      throw new AsserterError('constructionPayloadsRequest cannot be null');
    }

    this.ValidSupportedNetwork(constructionPayloadsRequest.network_identifier);
    this.Operations(constructionPayloadsRequest.operations, true);
  }

  ConstructionCombineRequest(constructionCombineRequest) {
    if (constructionCombineRequest == null) {
      throw new AsserterError('constructionCombineRequest cannot be null');
    }

    this.ValidSupportedNetwork(constructionCombineRequest.network_identifier);

    if (!constructionCombineRequest.unsigned_transaction || 
      constructionCombineRequest.unsigned_transaction.length == 0) {
      throw new AsserterError('unsigned_transaction cannot be empty');
    }

    this.Signatures(constructionCombineRequest.signatures);
  }

  ConstructionHashRequest(constructionHashRequest) {
    if (constructionHashRequest == null) {
      throw new AsserterError('constructionHashRequest cannot be null');
    }

    this.ValidSupportedNetwork(constructionHashRequest.network_identifier);

    if (!constructionHashRequest.signed_transaction || 
      constructionHashRequest.signed_transaction.length == 0) {
      throw new AsserterError('signed_transaction cannot be empty');
    }    
  }

  ConstructionParseRequest(constructionParseRequest) {
    if (constructionParseRequest == null) {
      throw new AsserterError('constructionParseRequest cannot be null');
    }

    this.ValidSupportedNetwork(constructionParseRequest.network_identifier);

    if (!constructionParseRequest.transaction || 
      constructionParseRequest.transaction.length == 0) {
      throw new AsserterError('transaction cannot be empty');
    }    
  }

  ConstructionParseResponse(constructionParseResponse, signed = false) {
    if (constructionParseResponse == null) {
      throw new AsserterError('constructionParseResponse cannot be null');
    }

    if (!constructionParseResponse.operations ||
      constructionParseResponse.operations.length == 0) {
      throw new AsserterError('operations cannot be empty');
    }

    try {
      this.Operations(constructionParseResponse.operations, true);
    } catch (e) {
      throw new AsserterError(`unable to parse operations: ${e.message}`);
    }

    if (signed && (!constructionParseResponse.signers ||
      constructionParseResponse.signers.length == 0)) {
      throw new AsserterError('signers cannot be empty');
    }

    if (!signed) {
      if (Array.isArray(constructionParseResponse.signers) && constructionParseResponse.signers.length > 0) {
        throw new AsserterError('signers should be empty for unsigned txs');
      }
    }

    for (let i = 0; i < (constructionParseResponse.signers || []).length; ++i) {
      const signer = constructionParseResponse.signers[i];
      if (signer.length == 0) {
        throw new AsserterError(`signer ${i} cannot be empty string`);
      }
    }
  }

  ConstructionPayloadsResponse(constructionPayloadsResponse) {
    if (constructionPayloadsResponse == null) {
      throw new AsserterError('constructionPayloadsResponse cannot be null');
    }

    if (!constructionPayloadsResponse.unsigned_transaction ||
      constructionPayloadsResponse.unsigned_transaction.length == 0) {
      throw new AsserterError('unsigned transaction cannot be empty');
    }

    if (!constructionPayloadsResponse.payloads ||
      constructionPayloadsResponse.payloads.length == 0) {
      throw new AsserterError('signing payloads cannot be empty');
    }

    for (let i = 0; i < constructionPayloadsResponse.payloads.length; ++i) {
      const payload = constructionPayloadsResponse.payloads[i];

      try {
        this.SigningPayload(payload);
      } catch (e) {
        throw new AsserterError(`Signing Payload ${i} is invalid: ${e.message}`); 
      }
    }
  }

  PublicKey(publicKey) {
    if (publicKey == null) {
      throw new AsserterError('public_key cannot be null'); 
    }

    if (!publicKey.hex_bytes || publicKey.hex_bytes.length == 0) { // hex
      throw new AsserterError('public key bytes cannot be empty'); 
    }

    if (!this.checkHex(publicKey.hex_bytes)) {
      throw new AsserterError(`hex_bytes must be a valid hexadecimal string`);  
    }

    try {
      this.CurveType(publicKey.curve_type);
    } catch (e) {
      throw new AsserterError(`public key curve type is not supported: ${e.message}`); 
    }
  }

  CurveType(curveType) {
    switch (curveType) {
      case new Types.CurveType().secp256k1:
      case new Types.CurveType().edwards25519:
        break;

      default:
        throw new AsserterError(`${JSON.stringify(curveType)} is not a supported CurveType`); 
    }
  }

  SigningPayload(signingPayload) {
    if (signingPayload == null) {
      throw new AsserterError('signing payload cannot be null'); 
    }

    if (!signingPayload.address || signingPayload.address.length == 0) {
      throw new AsserterError('signing payload cannot be empty'); 
    }

    if (!signingPayload.hex_bytes || signingPayload.hex_bytes.length == 0) {
      throw new AsserterError('signing payload bytes cannot be empty'); 
    }

    if (!this.checkHex(signingPayload.hex_bytes)) {
      throw new AsserterError(`hex_bytes must be a valid hexadecimal string`);  
    }

    if (!signingPayload.signature_type || signingPayload.signature_type.length == 0) {
      return;
    }

    try {
      this.SignatureType(signingPayload.signature_type);
    } catch (e) {
      throw new AsserterError(`signature payload type is not valid: ${e.message}`); 
    }
  }

  checkHex(hexPayload) {
    if (!hexPayload) return false;
    return hexPayload.match(/^[0-9a-fA-F]+$/) != null && hexPayload.length % 2 == 0;
  }

  Signatures(signatureArray = []) {
    if (!signatureArray || signatureArray.length == 0) {
      throw new AsserterError('signatures cannot be empty'); 
    }

    for (let i = 0; i < signatureArray.length; ++i) {
      const signature = signatureArray[i];

      try {
        this.SigningPayload(signature.signing_payload);
      } catch(e) {
        throw new AsserterError(`signature ${i} has invalid signing payload: ${e.message}`); 
      }

      try {
        this.PublicKey(signature.public_key);
      } catch(e) {
        throw new AsserterError(`signature ${i} has invalid public key: ${e.message}`); 
      }

      try {
        this.SignatureType(signature.signature_type);
      } catch(e) {
        throw new AsserterError(`signature ${i} has invalid signature type: ${e.message}`);  
      }

      if (signature.signing_payload.signature_type &&
        signature.signing_payload.signature_type != signature.signature_type) {
        throw new AsserterError(`requested signature type does not match returned signature type`);  
      }

      if (!signature.hex_bytes || signature.hex_bytes.length == 0) {
        throw new AsserterError(`signature ${i}: bytes cannot be empty`);  
      }

      if (!this.checkHex(signature.hex_bytes)) {
        throw new AsserterError(`hex_bytes must be a valid hexadecimal string`);  
      }
    }
  }

  SignatureType(signatureType) {
    switch(signatureType) {
      case new Types.SignatureType().ecdsa:
      case new Types.SignatureType().ecdsa_recovery:
      case new Types.SignatureType().ed25519:
        break;

      default:
        throw new AsserterError(`${JSON.stringify(signatureType)} is not a supported SignatureType`);  
    }
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
    if (!array || array.length == 0) {
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

      statusCodeMap[rosettaError.code] = true;
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
    const networkHash = Hash(network);
    const index = networks.findIndex((n) => Hash(n) == networkHash);
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

  CoinIdentifier(coinIdentifier) {
    if (coinIdentifier == null) {
      throw new AsserterError('coin_identifier cannot be null');
    }

    if ((coinIdentifier.identifier || '').length == 0) {
      throw new AsserterError('coin_identifier cannot be empty');
    }
  }

  CoinAction(coinAction) {
    switch (coinAction) {
      case new Types.CoinAction().created:
      case new Types.CoinAction().spent:
        break;

      default:
        throw new AsserterError(`${JSON.stringify(coinAction)} is not a valid coin action`);
    }
  }

  CoinChange(coinChange) {
    if (coinChange == null) {
      throw new AsserterError('coin change cannot be null');
    }

    try {
      this.CoinIdentifier(coinChange.coin_identifier);
    } catch (e) {
      throw new AsserterError(`coin identifier is invalid: ${e.message}`);
    }

    try {
      this.CoinAction(coinChange.coin_action);
    } catch (e) {
      throw new AsserterError(`coin action is invalid: ${e.message}`);
    }      
  }

  Coin(coin) {
    if (!coin) {
      throw new AsserterError('Coin cannot be null');
    }

    try {
      this.CoinIdentifier(coin.coin_identifier);
    } catch (e) {
      throw new AsserterError(`coin identifier is invalid: ${e.message}`);
    }

    try {
      this.Amount(coin.amount);
    } catch (e) {
      throw new AsserterError(`coin amount is invalid: ${e.message}`);
    }
  }

  Coins(coinArray) {
    const ids = {};

    if (!coinArray) return;

    for (let coin of coinArray) {
      try {
        this.Coin(coin);
      } catch (e) {
        throw new AsserterError(`coin is invalid: ${e.message}`);
      }

      if (ids[coin.coin_identifier.identifier]) {
        throw new AsserterError(`duplicate coin identifier detected: ` + 
          `${coin.coin_identifier.identifier}`);
      }

      ids[coin.coin_identifier.identifier] = true;
    }
  }

  AccountBalanceResponse(partialBlockIdentifier, accountBalanceResponse) {
    this.BlockIdentifier(accountBalanceResponse.block_identifier);
    this.assertBalanceAmounts(accountBalanceResponse.balances);

    if (accountBalanceResponse.coins != null) {
      this.Coins(accountBalanceResponse.coins);
    }

    if (partialBlockIdentifier == null) {
      return;
    }

    if (partialBlockIdentifier.hash != null &&
        partialBlockIdentifier.hash != accountBalanceResponse.block_identifier.hash) {
      throw new AsserterError(`Request BlockHash ${partialBlockIdentifier.hash}` + 
        ` does not match Response block hash ${accountBalanceResponse.block_identifier.hash}`);
    }

    if (partialBlockIdentifier.index != null &&
        partialBlockIdentifier.index != accountBalanceResponse.block_identifier.index) {
      throw new AsserterError(`Request Index ${partialBlockIdentifier.index}` + 
        ` does not match Response block index ${accountBalanceResponse.block_identifier.index}`);
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
      throw new AsserterError(`OperationStatus.status ${status} is not valid`);
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

    try {
      this.OperationIdentifier(operation.operation_identifier, index);
    } catch (e) {
      throw new AsserterError(`Operation.identifier is invalid in operation ${index}: ${e.message}`);
    }

    try {
      this.OperationType(operation.type);
    } catch (e) {
      throw new AsserterError(`Operation.type is invalid in operation ${index}: ${e.message}`);
    }

    if (construction) {
      if (operation.status && operation.status.length > 0) {
        throw new AsserterError('Operation.status must be empty for construction');
      }
    } else {
      try {
        this.OperationStatus(operation.status);
      } catch (e) {
        throw new AsserterError(`Operation.status is invalid in operation ${index}: ${e.message}`);
      }
    }

    if (operation.amount == null) {
      return null;
    }

    try {
      this.AccountIdentifier(operation.account);
    } catch (e) {
      throw new AsserterError(`operation.account is invalid in operation ${index}: ${e.message}`);
    }

    try {
      this.Amount(operation.amount);
    } catch (e) {
      throw new AsserterError(`operation.amount is invalid in operation ${index}: ${e.message}`);
    }

    if (operation.coin_change == null) return null;

    try {
      this.CoinChange(operation.coin_change);
    } catch (e) {
      throw new AsserterError(`operation.coin_change is invalid in operation ${index}: ${e.message}`);
    }
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
      throw new AsserterError('PartialBlockIdentifier is null');
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

  Operations(operations, construction = false) {
    if (!operations) throw new AsserterError('Operations cannot be null');

    if (operations.length == 0 && construction) {
      throw new AsserterError('Operations cannot be empty for construction');
    }

    for (let i = 0; i < operations.length; ++i) {
      const operation = operations[i];
      this.Operation(operation, i, construction);

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

  Transaction(transaction) {
    if (transaction == null) {
      throw new AsserterError('Transaction is null');
    }

    this.TransactionIdentifier(transaction.transaction_identifier);

    if (!Array.isArray(transaction.operations)) {
      throw new AsserterError('Transaction.operations must be an array');
    }

    try {
      this.Operations(transaction.operations)
    } catch (e) {
      throw new AsserterError(`Invalid operation in transaction ` + 
        `${transaction.transaction_identifier.hash}: ${e.message}`);
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

  static NewServer(supportedOperationTypes, historicalBalanceLookup, supportedNetworks) {
    const tmp = new RosettaAsserter(); // ToDo: alter methods to static 

    tmp.OperationTypes(supportedOperationTypes);
    tmp.SupportedNetworks(supportedNetworks);

    return new RosettaAsserter({
      supportedNetworks,
      historicalBalanceLookup,
      operationTypes: supportedOperationTypes,
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