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

  static SupportedNetworks(supportedNetworks) {
    if (!Array.isArray(supportedNetworks)) {
      throw new AsserterError('SupportedNetworks must be an array');
    }

    if (supportedNetworks.length == 0) {
      throw new AsserterError('NetworkIdentifier Array contains no supported networks');
    }

    const parsedNetworks = [];

    for (let network of supportedNetworks) {
      Asserter.NetworkIdentifier(network);
      if (parsedNetworks.includes(network)) {
        throw new AsserterError(`SupportedNetwork has a duplicate: ${network}`);
      }

      parsedNetworks.push(network);
    }
  }

  static SupportedNetwork(networkIdentifier) {
    if (this.supportedNetworks.includes(networkIdentifier)) {
      throw new AsserterError(`SupportedNetwork ${networkIdentifier} is not supported by this supporter`);
    }
  }

  static AccountBalanceRequest(accountBalanceRequest) {
    if (accountBalanceRequest == null) {
      throw new AsserterError('accountBalanceRequest is null');
    }

    Asserter.NetworkIdentifier(accountBalanceRequest.network_identifier);
    Asserter.SupportedNetwork(accountBalanceRequest.network_identifier);
    Asserter.AccountIdentifier(accountBalanceRequest.account_identifier);

    if (accountBalanceRequest == null) {
      return;
    }

    Asserter.PartialBlockIdentifier((accountBalanceRequest.block_identifier));
  }

  static BlockRequest(blockRequest) {
    if (blockRequest == null) {
      throw new AsserterError('blockRequest is null');
    }

    Asserter.NetworkIdentifier(blockRequest.network_identifier);
    Asserter.SupportedNetwork(blockRequest.network_identifier);

    Asserter.PartialBlockIdentifier(blockRequest.block_identifier);
  }

  static BlockTransactionRequest(blockTransactionRequest) {
    if (blockTransactionRequest == null) {
      throw new AsserterError('blockTransactionRequest is null');
    }

    Asserter.NetworkIdentifier(blockTransactionRequest.network_identifier);
    Asserter.SupportedNetwork(blockTransactionRequest.network_identifier);
    Asserter.BlockIdentifier(blockTransactionRequest.block_identifier);
    Asserter.TransactionIdentifier(blockTransactionRequest.transaction_identifier);
  }

  static ConstructionMetadataRequest(constructionMetadataRequest) {
    if (constructionMetadataRequest == null) {
      throw new AsserterError('constructionMetadataRequest is null');
    }

    Asserter.NetworkIdentifier(constructionMetadataRequest.network_identifier);
    Asserter.SupportedNetwork(constructionMetadataRequest.network_identifier); 

    if (constructionMetadataRequest.options == null) {
      throw new AsserterError('constructionMetadataRequest.options is null');
    }   
  }

  static ConstructionSubmitRequest(constructionSubmitRequest) {
    if (constructionSubmitRequest == null) {
      throw new AsserterError('constructionSubmitRequest.options is null');
    }

    Asserter.NetworkIdentifier(constructionSubmitRequest.network_identifier);
    Asserter.SupportedNetwork(constructionSubmitRequest.network_identifier);

    if (constructionSubmitRequest.signed_transaction == '') {
      throw new AsserterError('constructionSubmitRequest.signed_transaction is empty');
    }
  }

  static MempoolRequest(mempoolRequest) {
    if (mempoolRequest == null) {
      throw new AsserterError('mempoolRequest is null');
    }

    Asserter.NetworkIdentifier(mempoolRequest.network_identifier);
    Asserter.SupportedNetwork(mempoolRequest.network_identifier);
  }

  static MempoolTransactionRequest(mempoolTransactionRequest) {
    if (mempoolTransactionRequest == null) {
      throw new AsserterError('mempoolTransactionRequest is null');
    }

    Asserter.NetworkIdentifier(mempoolTransactionRequest.network_identifier);
    Asserter.SupportedNetworks(mempoolTransactionRequest.network_identifier);
    Asserter.TransactionIdentifier(mempoolTransactionRequest.transaction_identifier);
  }

  static MetadataRequest(metadataRequest) {
    if (metadataRequest == null) {
      throw new AsserterError('metadataRequest is null');
    }
  }

  static NetworkRequest(networkRequest) {
    if (networkRequest == null) {
      throw new AsserterError('networkRequest is null');
    }

    Asserter.NetworkIdentifier(networkRequest.network_identifier);
    Asserter.SupportedNetworks(networkRequest.network_identifier);
  }

  static ConstructionMetadata(constructionMetadataResponse) {
    if (constructionMetadataResponse.metadata == null) {
      throw new AsserterError('constructionMetadataResponse.metadata is null');
    }
  }

  static ConstructionSubmit(constructionSubmitResponse) {
    // ToDo: Null Check?
    // Note, this is not in the reference implementation (Go)
    Asserter.TransactionIdentifier(constructionSubmitResponse.transaction_identifier);
  }

  static MempoolTransactions(transactionIdentifiers) {
    for (let t of transactionIdentifiers) {
      Asserter.TransactionIdentifier(t);
    }
  }

  static NetworkIdentifier(networkIdentifier) {
    if (networkIdentifier == null)
      throw new AsserterError('NetworkIdentifier is null');

    if (!networkIdentifier.blockchain)
      throw new AsserterError('NetworkIdentifier.blockchain is missing');

    if (!networkIdentifier.network)
      throw new AsserterError('NetworkIdentifier.network is missing');

    return Asserter.SubNetworkIdentifier(networkIdentifier.sub_network_identifier);
  }

  static SubNetworkIdentifier(subnetworkIdentifier) {
    // Only check if specified in the response.
    if (subnetworkIdentifier == null) return;

    if (!subnetworkIdentifier.network) {
      throw new AsserterError('NetworkIdentifier.sub_network_identifier.network is missing');
    }
  }

  static Peer(peer) {
    if (peer == null || !peer.peer_id) {
      return new AsserterError('Peer.peer_id is missing');
    }
  }

  static Version(version) {
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

  static StringArray(name, array) {
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

  static NetworkStatusResponse(networkStatusResponse) {
    if (networkStatusResponse == null) {
      return new AsserterError('networkStatusResponse is null');
    }

    Asserter.BlockIdentifier(networkStatusResponse.current_block_identifier);
    Asserter.Timestamp(networkStatusResponse.current_block_timestamp);
    Asserter.BlockIdentifier(networkStatusResponse.genesis_block_identifier);

    for (let peer of networkStatusResponse.peers) {
      Asserter.Peer(peer);
    }
  }

  static OperationStatuses(operationStatuses) {
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

    return Asserter.StringArray("Allow.OperationStatuses", existingStatuses);
  }

  static OperationTypes(types) {
    return Asserter.StringArray('Allow.OperationTypes', types);
  }

  static Error(error) {
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

  static Errors(rosettaErrors) {
    const statusCodeMap = {};

    for (let rosettaError of rosettaErrors) {
      Asserter.Error(rosettaError);

      if (statusCodeMap[rosettaError.code] != null) {
        return new AsserterError('Error code used multiple times');
      }

      statusCodeMap[rosettaErrors.code] = true;
    }
  }

  static Allow(allowed) {
    if (allowed == null) {
      return new AsserterError('Allow is null');
    }

    Asserter.OperationStatuses(allowed.operation_statuses);
    Asserter.OperationStatuses(allowed.operation_types);
    Errors(allowed.errors);
  }

  static NetworkOptionsResponse(networkOptionsResponse) {
    if (networkOptionsResponse == null) {
      return new AsserterError('NetworkOptions Response is null');
    }

    Asserter.Version(networkOptionsResponse.version);
    return Allow(networkOptionsResponse.allow);
  }

  static containsNetworkIdentifier(networks, network) {
    const networkString = String.from(network);
    const index = networks.findIndex((n) => String.from(n) == networkString);
    return index >= 0;
  }

  static NetworkListResponse(networkListResponse) {
    if (networkListResponse == null) {
      return new AsserterError('NetworkListResponse is null');
    }

    const existingNetworks = [];

    for (let network of networkListResponse.network_identifiers) {
      Asserter.NetworkIdentifier(network);
      if (Asserter.containsNetworkIdentifier(existingNetworks, network)) {
        return new AsserterError('NetworkListResponse.Network contains duplicated');
      }

      existingNetworks.push(network);
    }
  }

  static assetBalanceAmounts(amountsArray) {
    const currencies = [];

    for (let amount of amountsArray) {
      let currencyIndex = currencies.findIndex((a) => 
        String.from(a.value) == String.from(amount.value));

      if (currencyIndex >= 0) {
        return new AsserterError(`Currency ${amount.currency} used in balance multiple times`);
      }

      currencies.push(amount.currency);
      Asserter.Amount(amount);
    }
  }

  static Amount(amount) {
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

  static AccountBalanceResponse(partialBlockIdentifier, blockIdentifier, amountArray) {
    Asserter.BlockIdentifier(blockIdentifier);
    Asserter.assetBalanceAmounts(amountArray);

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

  static OperationIdentifier(operationIdentifier, index) {
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

  static AccountIdentifier(accountIdentifier) {
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

  static OperationStatus(status) {
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

  static OperationType(type) {
    if (typeof type !== 'string') {
      return new AsserterError('OperationStatus.type must be a string');
    }

    if (type == '' || !this.operationTypes.includes(type)) {
      return new AsserterError(`Operation.Type ${type} is invalid`);
    }
  }

  static Operation(operation, index) {
    Asserter.OperationIdentifier(operation.operation_identifier, index);
    Asserter.OperationType(operation.type);
    Asserter.OperationStatus(operation.status);

    if (operation.amount == null) {
      return null;
    }

    Asserter.AccountIdentifier(operation.account);
    Asserter.Amount(operation.amount);
  }

  static BlockIdentifier(blockIdentifier) {
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

  static PartialBlockIdentifier(partialBlockIdentifier) {
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

  static TransactionIdentifier(transactionIdentifier) {
    if (transactionIdentifier == null) {
      return new AsserterError('TransactionIdentifier is null');
    }

    if (transactionIdentifier.hash == '') {
      return new AsserterError('TransactionIdentifier.hash is missing');
    }
  }

  static Transaction(transaction) {
    if (transaction == null) {
    }

    Asserter.TransactionIdentifier(transaction.transaction_identifier);

    if (!Array.isArray(transaction.operations)) {
      return new AsserterError('Transaction.operations must be an array');
    }

    for (let i = 0; i < transaction.operations.length; ++i) {
      const operation = transaction.operations[i];
      Asserter.Operation(operation, i);

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

  static Block(block) {
    if (block == null) {
      return new AsserterError('Block is null');
    }

    Asserter.BlockIdentifier(block.block_identifier);
    Asserter.BlockIdentifier(block.parent_block_identifier);

    if (this.genesisBlock.index != block.block_identifier.index) {
      if (block.block_identifier.hash == block.parent_block_identifier.hash) {
        return new AsserterError('BlockIdentifier.hash == ParentBlockIdentifier.hash');
      }

      if (block.block_identifier.index <= block.parent_block_identifier.index) {
        return new AsserterError('BlockIdentifier.index <= ParentBlockIdentifier.index');
      }

      Asserter.Timestamp(block.timestamp);
    }

    for (let transaction of block.transactions) {
      Asserter.transaction(transaction);
    }
  }

  static Server(supportedNetworks) {
    return new Asserter({
      supportedNetworks,
    });
  }

  static ClientWithResponses(networkIdentifier, networkStatus, networkOptions) {
    return new ClientWithOptions({
      networkIdentifier,
      networkstatus,
    });
  }

  static NewClientWithOptions(networkIdentifier, genesisBlockIdentifier,
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