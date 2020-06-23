const RosettaClient = require('rosetta-client');
const { backOff } = require('exponential-backoff');

const PromisePool = require('../utils/PromisePool');
const { FetcherError } = require('../errors');

class RosettaFetcher {
  constructor({ apiClient, retryOptions = {}, options = {} }) {
    this.apiClient = apiClient;

    this.backOffOptions = Object.assign({
      delayFirstAttempt: false,
      jitter: 'none',
      mayDelay: Infinity,
      numOfAttempts: 10,
      retry: () => true,
      startingDelay: 100,
      timeMultiple: 2,
    }, retryOptions);

    this.options = Object.assign({
      promisePoolSize: 8,
    }, options);
  }

  async accountBalance(networkIdentifier, accountIdentifier, partialBlockIdentifier) {
    const accountApi = new RosettaClient.AccountApi(this.apiClient);
    const accountBalanceRequest = new RosettaClient.AccountBalanceRequest(
      networkIdentifier,
      accountIdentifier,
      partialBlockIdentifier
    );

    const response = await accountApi.accountBalance(accountBalanceRequest);
    const responseBlock = response.block_identifier;
    const balances = response.balances;

    // ToDo: assertion

    return {
      responseBlock: response.block_identifier,
      balances: response.balances,
      metadata: response.metadata,
    };
  }

  async accountBalanceRetry(networkIdentifier, accountIdentifier, partialBlockIdentifier, retryOptions = {}) {
    const response = await backOff(() => 
      this.accountBalance(networkIdentifier, accountIdentifier, partialBlockIdentifier),
      Object.assign({}, this.backOffOptions, retryOptions),
    );

    return response;
  }

  async block(networkIdentifier, blockIdentifier) {
    const blockApi = new RosettaClient.BlockApi(this.apiClient);
    
    const blockRequest = new RosettaClient.BlockRequest(networkIdentifier, blockIdentifier);
    const blockResponse = await RosettaClient.blockApi.block(blockRequest);

    if (blockResponse.other_transactions == null || blockResponse.other_transactions.length == 0) {
      return blockResponse.block;
    }

    const transactions = this.transactions(
      networkIdentifier,
      blockIdentifier,
      blockResponse.other_transactions
    );

    blockResponse.block.transactions = [blockResponse.block.transactions, ...transactions];
    return blockResponse.block;
  }

  async transactions(networkIdentifier, blockIdentifier, hashes) {
    // Old Version: Using Promise.all()
    // ToDo: Remove this commented code in future.

    // // Resolve other transactions
    // const promises = hashes.map((otherTx) => {
    //   return this.transaction(networkIdentifier, blockIdentifier, otherTx.hash);
    // });

    // // Wait for all transactions to be fetched.
    // const transactions = await Promise.all(promises);
    // return transactions;

    // Resolve other transactions
    const promiseArguments = hashes.map((otherTx) => {
      return [networkIdentifier, blockIdentifier, otherTx.hash];
    });

    // Wait for all transactions to be fetched
    const transactions = await new PromisePool.create(
      this.options.promisePoolSize,
      promiseArguments,
      this.transaction,
      PromisePool.arrayApplier,
    );

    return transactions;
  }

  async transaction(networkIdentifier, blockIdentifier, hash) {
    const blockApi = new RosettaClient.BlockApi(this.apiClient);
    
    const transactionIdentifier = new RosettaClient.TransactionIdentifier(hash);
    const blockTransactionRequest = new RosettaClient.BlockTransactionRequest(
      networkIdentifier,
      blockIdentifier,
      transactionIdentifier
    );
    const transactionResponse = await RosettaClient.blockApi.blockTransaction(blockRequest);

    // ToDo: Client-side type assertion

    return transactionResponse.transaction;
  }

  async blockRetry(networkIdentifier, blockIdentifier, retryOptions = {}) {
    const response = await backOff(() => 
      this.block(networkIdentifier, blockIdentifier),
      Object.assign({}, this.backOffOptions, retryOptions),
    );

    return response;
  }

  /**
   * BlockRange fetches blocks from startIndex to endIndex, inclusive.
   * A direct path from startIndex to endIndex may not exist in the response,
   * if called during a re-org. This case must be handled by any callers.
   * @param {NetworkIdentifier} networkIdentifier
   * @param {number} startIndex - index from first block
   * @param {number} endIndex - index from last block
   */
  async blockRange(networkIdentifier, startIndex, endIndex) {
    const ret = [];
    const promiseArguments = [];

    for (let i = startIndex; i <= endIndex; ++i) {
      const partialBlockIdentifier = new RosettaClient.PartialBlockIdentifier({ index: i });
      promiseArguments.push([networkIdentifier, blockIdentifier]);
    }

    // Wait for all blocks to be fetched
    const blocks = await new PromisePool.create(
      this.options.promisePoolSize,
      promiseArguments,
      this.blockRetry,
      PromisePool.arrayApplier,
    );

    return blocks;
  }

  async mempool(networkIdentifier) {
    const mempoolApi = new RosettaClient.MempoolApi(this.apiClient);

    const mempoolRequest = new RosettaClient.MempoolRequest(networkIdentifier);

    const response = await mempoolApi.mempool(mempoolRequest);
    if (response.transaction_identifiers == null || response.transaction_identifiers.length == 0) {
      throw new FetcherError('Mempool is empty');
    }

    // ToDo: Assertion

    return response.transaction_identifiers;
  }

  async mempoolTransaction(networkIdentifier, transactionIdentifier) {
    const mempoolApi = new RosettaClient.MempoolApi(this.apiClient);  

    const mempoolTransactionRequest = new RosettaClient.MempoolTransactionRequest(
      networkIdentifier,
      transactionIdentifier
    );

    const response = new RosettaClient.MempoolTransaction(mempoolTransactionRequest);

    // ToDo: Type Assertion

    return response.transaction;
  }

  async networkStatus(networkIdentifier, metdata = {}) {
    const networkApi = new RosettaClient.NetworkApi(this.apiClient);

    const networkRequest = new RosettaClient.NetworkRequest.constructFromObject({
      network_identifier: networkIdentifier,
      metadata: metadata,
    });

    const networkStatus = await networkApi.NetworkStatus(networkRequest);

    // ToDo: Type Assertion

    return networkStatus;
  }

  async networkStatusRetry(networkIdentifier, metadata = {}, retryOptions = {}) {
    const response = await backOff(() => 
      this.networkStatus(networkIdentifier, metadata),
      Object.assign({}, this.backOffOptions, retryOptions),
    );

    return response;
  }

  async networkList(metdata = {}) {
    const networkApi = new RosettaClient.NetworkApi(this.apiClient);

    const metadataRequest = new RosettaClient.MetadataRequest.constructFromObject({
      metadata,
    });

    const networkList = await networkApi.NetworkList(metadataRequest);

    // ToDo: Type Assertion

    return networkList;
  }

  async networkStatusRetry(metadata = {}, retryOptions = {}) {
    const response = await backOff(() => 
      this.networkList(metadata),
      Object.assign({}, this.backOffOptions, retryOptions),
    );

    return response;
  }

  async networkOptions(networkIdentifier, metdata = {}) {
    const networkApi = new RosettaClient.NetworkApi(this.apiClient);

    const networkRequest = new RosettaClient.MetadataRequest.constructFromObject({
      metadata,
    });

    const networkOptions = await networkApi.NetworkOptions(networkRequest);

    // ToDo: Type Assertion

    return networkOptions;
  }

  async networkOptionsRetry(networkIdentifier, metadata = {}, retryOptions = {}) {
    const response = await backOff(() => 
      this.networkList(networkIdentifier, metadata),
      Object.assign({}, this.backOffOptions, retryOptions),
    );

    return response;
  }

  async constructionMetadata(networkIdentifier, options = {}) {
    const constructionApi = new RosettaClient.ConstructionApi(this.apiClient);

    const constructionMetadataRequest = new RosettaClient.ConstructionMetadataRequest(
      networkIdentifier,
      options,
    );

    const response = await constructionApi.constructionMetadata(constructionMetadataRequest);

    // ToDo: Client-side Type Assertion

    return response.metadata;
  }

  async constructionSubmit(networkIdentifier, signedTransaction) {
    const constructionApi = new RosettaClient.ConstructionApi(this.apiClient);
    
    const constructionSubmitRequest = new RosettaClient.ConstructionSubmitRequest(
      networkIdentifier,
      signedTransaction
    );

    const response = await constructionApi.constructionSubmit(constructionSubmitRequest);

    // ToDo: Client-side Type Assertion

    return {
      transactionIdentifier: response.transaction_identifier,
      metadata: response.metadata,
    };
  }
}

module.exports = RosettaFetcher;