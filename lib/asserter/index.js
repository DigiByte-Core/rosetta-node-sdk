const { AsserterError } = require('../errors');

class Asserter {
  constructor({networkIdentifier, operationTypes = [], operationStatusMap,
    errorTypeMap, genesisBlock, supportedNetworks}) {

    this.networkIdentifier = networkIdentifier;
    this.operationTypes = operationTypes;
    this.operationStatusMap = operationStatusMap;
    this.errorTypeMap = errorTypeMap;
    this.genesisBlock = genesisBlock;
    this.supportedNetworks = supportedNetworks;
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

    if (constructionSubmitRequest.signed_transaction == '') {
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
      return new AsserterError('Peer.peer_id is missing');
    }
  }

  Version(version) {
    if (version == null) {
      return new AsserterError('Version is null');
    }

    if (!version.node_version) {
      return new AsserterError('Version.node_version is missing');
    }

    if (version.middleware_version != null && !version.middleware_version) {
      return new AsserterError('Version.middleware_version is missing');
    }
  }

  StringArray(name, array) {
    if (array.length == 0) {
      return new AsserterError(`No ${name} found`);
    }

    const existing = [];

    for (let element of array) {
      if (element == '') {
        return new AsserterError(`${name} has an empty string`);
      }

      if (existing.includes(element)) {
        return new AsserterError(`${name} contains a duplicate element: ${element}`);
      }

      existing.push(element);
    }
  }

  NetworkStatusResponse(networkStatusResponse) {
    if (networkStatusResponse == null) {
      return new AsserterError('networkStatusResponse is null');
    }

    this.BlockIdentifier(networkStatusResponse.current_block_identifier);
    this.Timestamp(networkStatusResponse.current_block_timestamp);
    this.BlockIdentifier(networkStatusResponse.genesis_block_identifier);

    for (let peer of networkStatusResponse.peers) {
      this.Peer(peer);
    }
  }

  OperationStatuses(operationStatuses) {
    if (operationStatuses.length == 0) {
      return new AsserterError('No Allow.OperationStatuses found');
    }

    const existingStatuses = [];
    let foundSuccessful = false;

    for (let status of operationStatuses) {
      if (status.status == '') {
        return new AsserterError('Operation.status is missing');
      }

      if (status.successful) {
        foundSuccessful = true;
      }

      existingStatuses.push(status.status);
    }

    if (!foundSuccessful) {
      return new AsserterError('No successful Allow.OperationStatuses found');
    }

    return this.StringArray("Allow.OperationStatuses", existingStatuses);
  }

  OperationTypes(types) {
    return this.StringArray('Allow.OperationTypes', types);
  }

  Error(error) {
    if (error == null) {
      return new AsserterError('Error is null');
    }

    if (error.code < 0) {
      return new AsserterError('Error.code is negative');
    }

    if (error.message == '') {
      return new AsserterError('Error.message is missing');
    }
  }

  Errors(rosettaErrors) {
    const statusCodeMap = {};

    for (let rosettaError of rosettaErrors) {
      this.Error(rosettaError);

      if (statusCodeMap[rosettaError.code] != null) {
        return new AsserterError('Error code used multiple times');
      }

      statusCodeMap[rosettaErrors.code] = true;
    }
  }

  Allow(allowed) {
    if (allowed == null) {
      return new AsserterError('Allow is null');
    }

    this.OperationStatuses(allowed.operation_statuses);
    this.OperationStatuses(allowed.operation_types);
    Errors(allowed.errors);
  }

  NetworkOptionsResponse(networkOptionsResponse) {
    if (networkOptionsResponse == null) {
      return new AsserterError('NetworkOptions Response is null');
    }

    this.Version(networkOptionsResponse.version);
    return Allow(networkOptionsResponse.allow);
  }

  containsNetworkIdentifier(networks, network) {
    const networkString = String.from(network);
    const index = networks.findIndex((n) => String.from(n) == networkString);
    return index >= 0;
  }

  NetworkListResponse(networkListResponse) {
    if (networkListResponse == null) {
      return new AsserterError('NetworkListResponse is null');
    }

    const existingNetworks = [];

    for (let network of networkListResponse.network_identifiers) {
      this.NetworkIdentifier(network);
      if (this.containsNetworkIdentifier(existingNetworks, network)) {
        return new AsserterError('NetworkListResponse.Network contains duplicated');
      }

      existingNetworks.push(network);
    }
  }

  assetBalanceAmounts(amountsArray) {
    const currencies = [];

    for (let amount of amountsArray) {
      let currencyIndex = currencies.findIndex((a) => 
        String.from(a.value) == String.from(amount.value));

      if (currencyIndex >= 0) {
        return new AsserterError(`Currency ${amount.currency} used in balance multiple times`);
      }

      currencies.push(amount.currency);
      this.Amount(amount);
    }
  }

  Amount(amount) {
    if (amount == null || amount.value == '') {
      return new AsserterError(`Amount.value is missing`);

    }

    // Allow all numbers, except e notation, or negative numbers.
    if (!isNaN(+amount.value) && !/^[0-9]+$/.test(amount.value)) {
      return new AsserterError(`Amount.value is not an integer: ${amount.value}`);
    }

    if (amount.currency == null) {
      return new AsserterError('Amount.currency is null');
    }

    if (amount.currency.symbol == '') {
      return new AsserterError('Amount.currency does not have a symbol');
    }

    if (amount.currency.decimals < 0) {
      return new AsserterError(`Amount.currency.decimals must be positive. Found: ${amount.currency.decimals}`);
    }
  }

  AccountBalanceResponse(partialBlockIdentifier, blockIdentifier, amountArray) {
    this.BlockIdentifier(blockIdentifier);
    this.assetBalanceAmounts(amountArray);

    if (partialBlockIdentifier == null) {
      return;
    }

    if (partialBlockIdentifier.hash != null && partialBlockIdentifier.hash != blockIdentifier.hash) {
      return new AsserterError(`Request BlockHash ${partialBlockIdentifier.hash}` + 
        ` does not match Response block hash ${blockIdentifier.hash}`);
    }

    if (partialBlockIdentifier.index != null && partialBlockIdentifier.index != blockIdentifier.index) {
      return new AsserterError(`Request Index ${partialBlockIdentifier.index}` + 
        ` does not match Response block index ${blockIdentifier.index}`);
    }    
  }

  OperationIdentifier(operationIdentifier, index) {
    if (typeof index !== 'number') {
      return new AsserterError('OperationIdentifier: index must be a number');
    }

    if (operationIdentifier == null) {
      return new AsserterError('OperationIdentifier is null');
    }

    if (operationIdentifier.index != index) {
      return new AsserterError(`OperationIdentifier.index ${operationIdentifier.index} is out of order, expected ${index}`);
    }

    if (operationIdentifier.network_index != null && operationIdentifier.network_index < 0) {
      return new AsserterError('OperationIdentifier.network_index is invalid');
    }
  }

  AccountIdentifier(accountIdentifier) {
    if (accountIdentifier == null) {
      return new AsserterError('Account is null');
    }

    if (accountIdentifier.address == '') {
      return new AsserterError('Account.address is missing');
    }

    if (accountidentifier.sub_account == null) {
      return;
    }

    if (accountIdentifier.sub_account.address == '') {
      return new AsserterError('Account.sub_account.address is missing');
    }
  }

  OperationStatus(status) {
    if (status == null) {
      throw new AsserterError('Asserter not initialized');
    }

    if (typeof status !== 'string') {
      return new AsserterError('OperationStatus.status must be a string');
    }

    if (status == '') {
      return new AsserterError('OperationStatus.status is empty');
    }

    if (this.operationStatusMap[status] == null) {
      return new AsserterError(`OperationStatus.status ${status} is not valid within this Asserter`);
    }
  }

  OperationType(type) {
    if (typeof type !== 'string') {
      return new AsserterError('OperationStatus.type must be a string');
    }

    if (type == '' || !this.operationTypes.includes(type)) {
      return new AsserterError(`Operation.Type ${type} is invalid`);
    }
  }

  Operation(operation, index) {
    this.OperationIdentifier(operation.operation_identifier, index);
    this.OperationType(operation.type);
    this.OperationStatus(operation.status);

    if (operation.amount == null) {
      return null;
    }

    this.AccountIdentifier(operation.account);
    this.Amount(operation.amount);
  }

  BlockIdentifier(blockIdentifier) {
    if (blockIdentifier == null) {
      return new AsserterError('BlockIdentifier is null');
    }

    if (blockIdentifier.hash == '') {
      return new AsserterError('BlockIdentifier.hash is missing');
    }

    if (blockIdentifier.index < 0) {
      return new AsserterError('BlockIdentifier.index is negative');
    }
  }

  PartialBlockIdentifier(partialBlockIdentifier) {
    if (partialBlockIdentifier == null) {
      return new AsserterError('BlockIdentifier.hash is missing');
    }

    if (!!partialBlockIdentifier.hash) {
      return null;
    }

    if (partialBlockIdentifier.index != null && partialBlockIdentifier.index >= 0) {
      return null;
    }

    return new AsserterError('Neither PartialBlockIdentifier.hash nor PartialBlockIdentifier.index is set');
  }

  TransactionIdentifier(transactionIdentifier) {
    if (transactionIdentifier == null) {
      return new AsserterError('TransactionIdentifier is null');
    }

    if (transactionIdentifier.hash == '') {
      return new AsserterError('TransactionIdentifier.hash is missing');
    }
  }

  Transaction(transaction) {
    if (transaction == null) {
    }

    this.TransactionIdentifier(transaction.transaction_identifier);

    if (!Array.isArray(transaction.operations)) {
      return new AsserterError('Transaction.operations must be an array');
    }

    for (let i = 0; i < transaction.operations.length; ++i) {
      const operation = transaction.operations[i];
      this.Operation(operation, i);

      const relatedIndices = [];

      for (let relatedOperation of operation.related_operations) {
        if (relatedOperation.index >= operation.operation_identifier.index) {
          return new AsserterError(`Related operation index ${relatedOperation.index}` +
            ` >= operation index ${operation.operation_identifier.index}`);
        }

        if (relatedIndices.includes(relatedOperation.index)) {
          return new AsserterError(`Found duplicate related operation index`+
            ` ${relatedOperation.index} for operation index ${operation.operation_identifier.index}`);
        }

        relatedIndices.push(relatedOperation.index);
      }
    }
  }

  Block(block) {
    if (block == null) {
      return new AsserterError('Block is null');
    }

    this.BlockIdentifier(block.block_identifier);
    this.BlockIdentifier(block.parent_block_identifier);

    if (this.genesisBlock.index != block.block_identifier.index) {
      if (block.block_identifier.hash == block.parent_block_identifier.hash) {
        return new AsserterError('BlockIdentifier.hash == ParentBlockIdentifier.hash');
      }

      if (block.block_identifier.index <= block.parent_block_identifier.index) {
        return new AsserterError('BlockIdentifier.index <= ParentBlockIdentifier.index');
      }

      this.Timestamp(block.timestamp);
    }

    for (let transaction of block.transactions) {
      this.transaction(transaction);
    }
  }

  Server(supportedNetworks) {
    return new Asserter({
      supportedNetworks,
    });
  }

  ClientWithResponses(networkIdentifier, networkStatus, networkOptions) {
    return new ClientWithOptions({
      networkIdentifier,
      networkstatus,
    });
  }

  NewClientWithOptions(networkIdentifier, genesisBlockIdentifier,
    operationTypes, operationStatuses, errors) {

    return new Asserter({
      networkIdentifier,
      operationTypes,
      genesisBlock: genesisBlockIdentifier,

      operationStatusesMap: (() => {
        const ret = {};

        for (let status of operationStatuses) {
          ret[status.status] = status.successful;
        }

        return ret;
      })(),

      errorTypeMap: (() => {
        const ret = {};

        for (let error of errors) {
          ret[status.code] = err;
        }

        return ret;        
      })(),
    });
  }
}