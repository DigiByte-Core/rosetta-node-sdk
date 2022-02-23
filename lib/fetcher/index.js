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
 *  Convenience Wrapper Class for `Client`
 *  @class RosettaFetcher
 */

const RosettaClient = require('rosetta-node-sdk-client');
const Asserter = require('../asserter');

const { backOff } = require('exponential-backoff');

const PromisePool = require('../utils/PromisePool');
const { FetcherError } = require('../errors');

class RosettaFetcher {
  /**
   *
   * @param apiClient
   * @param [retryOptions = {}]
   * @param [options = {}]
   * @param [server = {}]
   * @param [asserter = null]
   */
  constructor({apiClient, retryOptions = {}, options = {}, server = {}, asserter = null} = {}) {
    this.apiClient = apiClient || this.defaultApiClient(server);

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

    this.asserter = asserter;
  }

  /**
   * Initialize Asserter.
   *
   * @returns {Promise<{networkStatus: Rosetta:NetworkStatusResponse, primaryNetwork: Rosetta:NetworkIdentifier}>}
   * @throws {FetcherError} if the Asserter already initialized or no Networks available.
   */
  async initializeAsserter() {
    if (this.asserter) {
      throw new FetcherError('Asserter already initialized');
    }

    let networkList;
    try {
      networkList = await this.networkListRetry();
    } catch (e) {
      throw new FetcherError('Can\'t connect to network');
    }

    if (networkList.network_identifiers.length === 0) {
      throw new FetcherError('No Networks available');
    }

    const primaryNetwork = networkList.network_identifiers[0];
    const networkStatus = await this.networkStatusRetry(primaryNetwork);
    const networkOptions = await this.networkOptionsRetry(primaryNetwork);

    this.asserter = Asserter.NewClientWithResponses(
      primaryNetwork,
      networkStatus,
      networkOptions,
    );


    return {
      primaryNetwork,
      networkStatus,
    };
  }

  /**
   * Initialization of ApiClient.
   *
   * @param options - connection options.
   * @returns {Rosetta:ApiClient} - new instance that manages low level client-server communications, parameter marshalling, etc.
   */
  defaultApiClient(options) {
    const apiClient = new RosettaClient.ApiClient();

    const {
      protocol = 'http',
      host = 'localhost',
      port = 8000,
      timeout = 5000,
      requestAgent,
      defaultHeaders = {},
    } = options;

    apiClient.basePath = `${protocol}://${host}:${port}`;
    apiClient.timeout = timeout;
    apiClient.requestAgent = requestAgent;
    apiClient.defaultHeaders = defaultHeaders;

    return apiClient;
  }

  /**
   * AccountBalance returns the validated response from the AccountBalance method.
   * If a block is provided, a historical lookup is performed.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with
   * @param {Rosetta:AccountIdentifier} accountIdentifier - uniquely identifies an account within a network
   * @param {Rosetta:PartialBlockIdentifier} partialBlockIdentifier - partial block identifier that was requested
   * @returns {Promise<{balances: Rosetta:Amount[], metadata: Object<string,any>, coins: Rosetta:Coin[], block: Rosetta:BlockIdentifier}>} - validated response from the AccountBalance method
   */
  async accountBalance(networkIdentifier, accountIdentifier, partialBlockIdentifier) {
    const accountApi = new RosettaClient.promises.AccountApi(this.apiClient);

    const accountBalanceRequest = new RosettaClient.AccountBalanceRequest(
      networkIdentifier,
      accountIdentifier,
      partialBlockIdentifier
    );

    const response = await accountApi.accountBalance(accountBalanceRequest);
    const block = response.block_identifier;
    const balances = response.balances;
    const metadata = response.metadata;
    const coins = response.coins;

    // ToDo: assertion

    return {
      block: block,
      balances: balances,
      metadata: metadata,
      coins: coins,
    };
  }

  /**
   * AccountBalanceRetry retrieves the validated AccountBalance with a specified number of retries and max elapsed time.
   * If a block is provided, a historical lookup is performed.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {Rosetta:AccountIdentifier} accountIdentifier - uniquely identifies an account within a network.
   * @param {Rosetta:PartialBlockIdentifier} partialBlockIdentifier - partial block identifier that was requested.
   * @param [retryOptions = {}]
   * @returns {Promise<{balances: Rosetta:Amount[], metadata: Object<string,any>, coins: Rosetta:Coin[], block: Rosetta:BlockIdentifier}>} - validated response from the AccountBalance method.
   */
  async accountBalanceRetry(networkIdentifier, accountIdentifier, partialBlockIdentifier, retryOptions = {}) {
    const response = await backOff(() =>
      this.accountBalance(networkIdentifier, accountIdentifier, partialBlockIdentifier),
      Object.assign({}, this.backOffOptions, retryOptions),
    );

    return response;
  }

  /**
   * Block returns the validated response from the block method. This function will
   * automatically fetch any transactions that were not returned by the call to fetch the block.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {Rosetta:BlockIdentifier} blockIdentifier - uniquely identifies a block in a particular network.
   * @returns {Promise<Rosetta:Block>} - validated response from the block method.
   */
  async block(networkIdentifier, blockIdentifier) {
    const blockApi = new RosettaClient.promises.BlockApi(this.apiClient);

    const blockRequest = new RosettaClient.BlockRequest(networkIdentifier, blockIdentifier);
    const blockResponse = await blockApi.block(blockRequest);

    if (typeof blockResponse.block.transactions === 'undefined') {
      delete blockResponse.block.transactions;
    }

    if (blockResponse.other_transactions == null || blockResponse.other_transactions.length === 0) {
      return blockResponse.block;
    }

    const transactions = await this.transactions(
      networkIdentifier,
      blockIdentifier,
      blockResponse.other_transactions
    );

    if (!!blockResponse.block.transactions) {
      blockResponse.block.transactions = [...blockResponse.block.transactions, ...transactions];
    } else {
      blockResponse.block.transactions = transactions;
    }
    return blockResponse.block;
  }

  /**
   * Get information for each block transaction.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {Rosetta:BlockIdentifier} blockIdentifier - uniquely identifies a block in a particular network.
   * @param {Rosetta:TransactionIdentifier[]} hashes - array of items that uniquely identifies a transaction in a particular network and block or in the mempool.
   * @returns {Promise<Rosetta:BlockTransactionResponse.transaction[]>} - array of information about transactions.
   */
  async transactions(networkIdentifier, blockIdentifier, hashes) {
    // Resolve other transactions
    const promiseArguments = hashes.map((otherTx) => {
      return [networkIdentifier, blockIdentifier, otherTx.hash];
    });

    // Wait for all transactions to be fetched
    const transactions = await PromisePool.create(
      this.options.promisePoolSize,
      promiseArguments,
      this.transaction.bind(this),
      PromisePool.arrayApplier,
    );

    return transactions;
  }

  /**
   * Get information about a block transaction.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {Rosetta:BlockIdentifier} blockIdentifier - uniquely identifies a block in a particular network.
   * @param {Rosetta:TransactionIdentifier} hash - uniquely identifies a transaction in a particular network and block or in the mempool.
   * @returns {Promise<Rosetta:BlockTransactionResponse.transaction>} - information about a block transaction.
   */
  async transaction(networkIdentifier, blockIdentifier, hash) {
    const blockApi = new RosettaClient.promises.BlockApi(this.apiClient);

    const transactionIdentifier = new RosettaClient.TransactionIdentifier(hash);
    const blockTransactionRequest = new RosettaClient.BlockTransactionRequest.constructFromObject({
      network_identifier: networkIdentifier,
      block_identifier: blockIdentifier,
      transaction_identifier: transactionIdentifier,
    });
    const transactionResponse = await blockApi.blockTransaction(blockTransactionRequest);

    // ToDo: Client-side type assertion

    return transactionResponse.transaction;
  }

  /**
   * BlockRetry retrieves a validated Block with a specified number of retries and max elapsed time.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {Rosetta:BlockIdentifier} blockIdentifier - uniquely identifies a block in a particular network.
   * @param [retryOptions = {}]
   * @returns {Promise<Rosetta:Block>} - validated response from the block method.
   */
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
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {number} startIndex - index from first block
   * @param {number} endIndex - index from last block
   * @returns {Promise<Rosetta:Block[]>} - array of validated response from the block method.
   */
  async blockRange(networkIdentifier, startIndex, endIndex) {
    const ret = [];
    const promiseArguments = [];

    for (let i = startIndex; i <= endIndex; ++i) {
      const partialBlockIdentifier = RosettaClient.PartialBlockIdentifier.constructFromObject({ index: i });
      promiseArguments.push([networkIdentifier, partialBlockIdentifier]);
    }

    // Wait for all blocks to be fetched
    const blocks = await PromisePool.create(
      this.options.promisePoolSize,
      promiseArguments,
      this.blockRetry.bind(this),
      PromisePool.arrayApplier,
    );

    return blocks;
  }

  /**
   * Mempool returns the validated response from the Mempool method.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @returns {Promise<Rosetta:TransactionIdentifier[]>} - uniquely identifies a transaction in a
   *      particular network and block or in the mempool.
   * @throws {FetcherError} thrown if mempool is empty.
   */
  async mempool(networkIdentifier) {
    const mempoolApi = new RosettaClient.promises.MempoolApi(this.apiClient);

    const response = await mempoolApi.mempool(networkIdentifier);
    if (response.transaction_identifiers == null || response.transaction_identifiers.length === 0) {
      throw new FetcherError('Mempool is empty');
    }

    // ToDo: Assertion

    return response.transaction_identifiers;
  }

  /**
   * MempoolTransaction returns the validated response from the MempoolTransaction method.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {Rosetta:TransactionIdentifier} transactionIdentifier - uniquely identifies a transaction in a particular network and block or in the mempool.
   * @returns {Promise<Rosetta:Transaction>} - transaction
   */
  async mempoolTransaction(networkIdentifier, transactionIdentifier) {
    const mempoolApi = new RosettaClient.promises.MempoolApi(this.apiClient);

    const mempoolTransactionRequest = new RosettaClient.MempoolTransactionRequest(
      networkIdentifier,
      transactionIdentifier
    );

    const response = await mempoolApi.mempoolTransaction(mempoolTransactionRequest);

    // ToDo: Type Assertion

    return response.transaction;
  }

  /**
   * NetworkStatus returns the validated response from the NetworkStatus method.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {object} [metadata = {}] - metadata
   * @returns {Promise<Rosetta:NetworkStatusResponse>} - returns the current status of the network requested.
   */
  async networkStatus(networkIdentifier, metadata = {}) {
    const networkApi = new RosettaClient.promises.NetworkApi(this.apiClient);

    const networkRequest = new RosettaClient.NetworkRequest.constructFromObject({
      network_identifier: networkIdentifier,
      metadata: metadata,
    });

    const networkStatus = await networkApi.networkStatus(networkRequest);
    // ToDo: Type Assertion

    return networkStatus;
  }

  /**
   * NetworkStatusRetry retrieves the validated NetworkStatus with a specified number of retries and max elapsed time.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {object} [metadata = {}] - metadata
   * @param {object} [retryOptions = {}]
   * @returns {Promise<Rosetta:NetworkStatusResponse>} - returns the current status of the network requested.
   */
  async networkStatusRetry(networkIdentifier, metadata = {}, retryOptions = {}) {
    const response = await backOff(() =>
      this.networkStatus(networkIdentifier, metadata),
      Object.assign({}, this.backOffOptions, retryOptions),
    );

    return response;
  }

  /**
   * NetworkList returns the validated response from the NetworkList method.
   *
   * @param {object} [metadata = {}] - metadata
   * @returns {Promise<Rosetta:NetworkListResponse>} - returns a list of NetworkIdentifiers that the Rosetta server supports.
   */
  async networkList(metadata = {}) {
    const networkApi = new RosettaClient.promises.NetworkApi(this.apiClient);

    const metadataRequest = RosettaClient.MetadataRequest.constructFromObject({
      metadata,
    });

    const networkList = await networkApi.networkList(metadataRequest);
    // ToDo: Type Assertion

    return networkList;
  }

  /**
   * NetworkListRetry retrieves the validated NetworkList with a specified number of retries and max elapsed time.
   *
   * @param {object} [metadata = {}] - metadata
   * @param {object} [retryOptions = {}]
   * @returns {Promise<Rosetta:NetworkListResponse>} - returns a list of NetworkIdentifiers that the Rosetta server supports.
   */
  async networkListRetry(metadata = {}, retryOptions = {}) {
    const response = await backOff(() =>
      this.networkList(metadata),
      Object.assign({}, this.backOffOptions, retryOptions),
    );

    return response;
  }

  /**
   * NetworkOptions returns the validated response from the NetworkOptions method.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {object} [metadata = {}] - metadata
   * @returns {Promise<Rosetta:NetworkOptionsResponse>} - return information about the versioning of the node and the allowed operation statuses, operation types, and errors.
   */
  async networkOptions(networkIdentifier, metadata = {}) {
    const networkApi = new RosettaClient.promises.NetworkApi(this.apiClient);

    const networkRequest = new RosettaClient.NetworkRequest.constructFromObject({
      network_identifier: networkIdentifier,
      metadata,
    });

    try {
      const networkOptions = await networkApi.networkOptions(networkRequest);
      // ToDo: Type Assertion

      return networkOptions;
    } catch(e) {
      console.error(e);
    }
  }

  /**
   * NetworkOptionsRetry retrieves the validated NetworkOptions with a specified number of retries and max elapsed time.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {object} [metadata = {}] - metadata
   * @param {object} [retryOptions = {}]
   * @returns {Promise<Rosetta:NetworkOptionsResponse>} - return information about the versioning of the node and the allowed operation statuses, operation types, and errors.
   */
  async networkOptionsRetry(networkIdentifier, metadata = {}, retryOptions = {}) {
    const response = await backOff(() =>
      this.networkOptions(networkIdentifier, metadata),
      Object.assign({}, this.backOffOptions, retryOptions),
    );

    return response;
  }

  /**
   * Get Metadata for Transaction Construction.
   * Get any information required to construct a transaction for a specific network.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {object} [options = {}] - some blockchains require different metadata for different types of transaction construction (ex: delegation versus a transfer).
   * @returns {Promise<Rosetta:ConstructionMetadataResponse>} - metadata returned here could be a recent hash to use, an account sequence number, or even arbitrary chain state.
   */
  async constructionMetadata(networkIdentifier, options = {}) {
    const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);

    const constructionMetadataRequest = new RosettaClient.ConstructionMetadataRequest(
      networkIdentifier,
      options,
    );

    const response = await constructionApi.constructionMetadata(constructionMetadataRequest);

    // ToDo: Client-side Type Assertion

    return response.metadata;
  }

  /**
   * Submit a Signed Transaction.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {string} signedTransaction - signed transaction.
   * @returns {Promise<{metadata: object, transactionIdentifier: Rosetta:TransactionIdentifier}>} - validated response from the ConstructionSubmit method
   */
  async constructionSubmit(networkIdentifier, signedTransaction) {
    const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);

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

  /**
   * Create Network Transaction from Signatures.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {string} unsignedTransaction - unsigned transaction.
   * @param {Rosetta:Signature[]} signatureArray - required signatures to create a network transaction.
   * @returns {Promise<string>} - signed transaction.
   */
  async constructionCombine(networkIdentifier, unsignedTransaction, signatureArray) {
    const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);

    const constructionCombineRequest = new RosettaClient.ConstructionCombineRequest(
      networkIdentifier,
      unsignedTransaction,
      signatureArray,
    );

    const response = await constructionApi.constructionCombine(constructionCombineRequest);

    // ToDo: Client-side Assertions

    return response.signed_transaction;
  }

  /**
   * Derive an Address from a PublicKey.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {Rosetta:PublicKey} publicKey - contains a public key byte array for a particular CurveType encoded in hex.
   * @param {Object<string,any>} metadataMap - array of metadata.
   * @returns {Promise<{metadata: object, address: string}>} - Derive returns the network-specific address associated with a public key.
   */
  async constructionDerive(networkIdentifier, publicKey, metadataMap) {
    const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);

    const constructionDeriveRequest = new RosettaClient.ConstructionDeriveRequest(
      networkIdentifier,
      publicKey,
      metadataMap,
    );

    const response = await constructionApi.constructionDerive(constructionDeriveRequest);

    // ToDo: Client-side Assertions

    return {
      address: response.address,
      metadata: response.metadata,
    };
  }

  /**
   * Get the Hash of a Signed Transaction.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {string} signedTransaction - signed transaction.
   * @returns {Promise<Rosetta:TransactionIdentifier>} - network-specific transaction hash for a signed transaction.
   */
  async constructionHash(networkIdentifier, signedTransaction) {
    const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);

    const constructionHashRequest = new RosettaClient.ConstructionHashRequest(
      networkIdentifier,
      signedTransaction,
    );

    const response = await constructionApi.constructionHash(constructionHashRequest);

    // ToDo: Client-side Assertions

    return response.transaction_identifier;
  }

  /**
   * Parse a Transaction.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {boolean} signed - indicating whether the transaction is signed.
   * @param {string} transaction - this must be either the unsigned transaction blob.
   * @returns {Promise<{signers: string[], operations: Rosetta:Operation[]}>} - contains an array of operations that occur in a transaction blob.
   */
  async constructionParse(networkIdentifier, signed, transaction) {
    const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);

    const constructionParseRequest = new RosettaClient.ConstructionParseRequest(
      networkIdentifier,
      signed,
      transaction,
    );

    const response = await constructionApi.constructionParse(constructionParseRequest);

    // ToDo: Client-side Assertions

    return {
      operations: response.operations,
      signers: response.signers,
      metadata: response.metadata,
    };
  }

  /**
   * ConstructionPayloads is called with an array of operations and the response from `/construction/metadata`.
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {Rosetta:Operation[]} operationArray - array of operations.
   * @param {Object<string,any>} metadataMap - array of metadata.
   * @returns {Promise<{unsigned_transaction: string, payloads: Rosetta:SigningPayload[]}>} - returns an
   *      unsigned transaction blob and a collection of payloads that must
   *      be signed by particular addresses using a certain SignatureType.
   */
  async constructionPayloads(networkIdentifier, operationArray, metadataMap) {
    const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);

    const constructionPayloadsRequest = new RosettaClient.ConstructionPayloadsRequest(
      networkIdentifier,
      operationArray,
    );

    constructionPayloadsRequest.metadata = metadataMap;

    const response = await constructionApi.constructionPayloads(constructionPayloadsRequest);

    // ToDo: Client-side Assertions

    return {
      unsigned_transaction: response.unsigned_transaction,
      payloads: response.payloads,
    };
  }

  /**
   * ConstructionPreprocess is called prior to `/construction/payloads` to construct a
   * request for any metadata that is needed for transaction construction given (i.e. account nonce).
   *
   * @param {Rosetta:NetworkIdentifier} networkIdentifier - specifies which network a particular object is associated with.
   * @param {Rosetta:Operation[]} operationArray - array of operations.
   * @param {Object<string,any>} metadataMap - array of metadata.
   * @returns {Promise<Rosetta:Operation[]>} - contains an array of operations that occur in a transaction blob.
   */
  async constructionPreprocess(networkIdentifier, operationArray, metadataMap) {
    const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);

    const constructionPreprocessRequest = new RosettaClient.ConstructionPreprocessRequest(
      networkIdentifier,
      operationArray,
    );

    constructionPreprocessRequest.metadata = metadataMap;

    const response = await constructionApi.constructionPreprocess(constructionPreprocessRequest);

    // ToDo: Client-side Assertions

    return response.options;
  }

}

module.exports = RosettaFetcher;
