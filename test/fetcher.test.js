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

// fetcher.test.js
const { expect } = require('chai');
const Rosetta = require('..');
const { constructPartialBlockIdentifier } = require('../lib/utils');
const bodyParser = require('body-parser');
const RosettaSDK = require('../index');

let START_PORT = 8000;

function getPort() {
  return START_PORT++;
}

const c = (arg) => JSON.parse(JSON.stringify(arg));

const basicNetwork = {
  blockchain: "blockchain",
  network:    "network",
};

const noMempoolNetwork = {
  blockchain: "blockchain",
  network:    "noMempoolNetwork",
};

const basicAccount = {
  address: "address",
};

const basicBlock = {
  index: 1,
  hash:  "block 1",
};

const basicBlockWithTx = {
  index: 2,
  hash:  "block 2",
};

const basicAmounts = [{
  value: "1000",
  currency: {
    symbol:   "BTC",
    decimals: 8,
  },
}];

const basicFullBlock = {
  block_identifier: basicBlock,
  parent_block_identifier: {
    index: 0,
    hash: "block 0",
  },
  timestamp: 1582833600000,
};

const basicTransactions = [{ hash: 'transaction 1' }];

const basicTransaction = {
  transaction_identifier: basicTransactions[0],
  operations: [],
  metadata: {},
};

const basicMempool = basicTransactions;

const basicFullBlockWithTx = {
  block_identifier: basicBlockWithTx,
  parent_block_identifier: {
    index: 1,
    hash: "block 1",
  },
  timestamp: 1582833700000,
};

const basicNetworkStatus = {
  current_block_identifier: basicBlock,
  current_block_timestamp:  1582833600000,
  genesis_block_identifier: {
    index: 0,
    hash:  "block 0",
  },
  peers: [
    { peer_id: 'peer 1' },
  ],
};

const basicNetworkList = [
  basicNetwork,
];


const basicNetworkOptions = {
  version: {
    rosetta_version: "1.4.0",
    node_version:    "0.0.1",
  },
  allow: {
    operation_statuses: [
      {
        status:     "SUCCESS",
        successful: true,
      },
    ],
    operation_types: ["transfer"],
  },
};

const unsignedTransaction = 'unsigned transaction 1';

const signedTransaction = 'signed transaction 1';

const transactionHash = 'transaction hash';

const baseAddress = 'wallet address';

const publicKey = {
  hex_bytes: '',
  curve_type: '',
};

async function createServer(params) {
  const app = require('express')();
  let tries = 0;

  app.use(bodyParser.json());

  app.post('/account/balance', (req, res) => {
    const expected = {
      network_identifier: basicNetwork,
      account_identifier: basicAccount,
    };

    expect(req.body).to.deep.equal(expected);

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = new Rosetta.Client.AccountBalanceResponse(basicBlock, basicAmounts);
    res.json((response));
  });

  app.post('/block', (req, res) => {
    let isWithTx = false;
    if (req.body.block_identifier.index === 2) {
      isWithTx = true;
    }
    const expected = {
      network_identifier: basicNetwork,
      block_identifier: constructPartialBlockIdentifier(Object.assign({}, isWithTx ? basicBlockWithTx : basicBlock)),
    };

    delete req.body.block_identifier.hash;
    delete expected.block_identifier.hash;
    expect(c(req.body)).to.deep.equal(c(expected));

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = new Rosetta.Client.BlockResponse.constructFromObject({
      block: isWithTx ? basicFullBlockWithTx : basicFullBlock,
      other_transactions: isWithTx ? basicTransactions : undefined,
    });
    res.json((response));
  });

  app.post('/mempool', (req, res) => {
    let isEmptyMempool = false;
    if (req.body.network === 'noMempoolNetwork') {
      expect(c(req.body)).to.deep.equal(noMempoolNetwork);
      isEmptyMempool = true;
    } else {
      expect(c(req.body)).to.deep.equal(basicNetwork);
    }

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = new Rosetta.Client.MempoolResponse.constructFromObject({
      transaction_identifiers: isEmptyMempool ? [] : basicMempool
    });
    res.json((response));
  });

  app.post('/mempool/transaction', (req, res) => {
    const expected = {
      network_identifier: basicNetwork,
      transaction_identifier: basicTransactions[0],
    };
    expect(c(req.body)).to.deep.equal(expected);

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = new Rosetta.Client.MempoolTransactionResponse.constructFromObject({
      transaction: basicTransaction,
      metadata: {},
    });
    res.json((response));
  });

  app.post('/block/transaction', (req, res) => {
    const expected = {
      network_identifier: basicNetwork,
      block_identifier: Object.assign({}, basicBlockWithTx),
      transaction_identifier: basicTransactions[0],
    };

    delete req.body.block_identifier.hash;
    delete expected.block_identifier.hash;
    expect(req.body).to.deep.equal(expected);

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = new Rosetta.Client.BlockTransactionResponse.constructFromObject({ transaction: basicTransaction });
    res.json((response));
  });

  app.post('/network/status', (req, res) => {
    const expected = {
      network_identifier: basicNetwork,
      metadata: {},
    };

    expect(req.body).to.deep.equal(expected);

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = Rosetta.Client.NetworkStatusResponse.constructFromObject(basicNetworkStatus);
    res.json(response);
  });

  app.post('/network/list', (req, res) => {
    const metadataRequest = new Rosetta.Client.MetadataRequest.constructFromObject({ metadata: {} });
    const expected = metadataRequest;

    expect(req.body).to.deep.equal(expected);

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = new Rosetta.Client.NetworkListResponse(params.noNetwork ? [] : basicNetworkList);
    res.json(response);
  });

  app.post('/network/options', (req, res) => {
    const expected = {
      network_identifier: basicNetwork,
      metadata: {},
    };

    expect(req.body).to.deep.equal(expected);

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = new Rosetta.Client.NetworkOptionsResponse(basicNetworkOptions.version, basicNetworkOptions.allow);
    res.json(response);
  });

  app.post('/construction/metadata', (req, res) => {
    const expected = {
      network_identifier: basicNetwork,
      options: {},
    };
    expect(c(req.body)).to.deep.equal(expected);

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = new Rosetta.Client.ConstructionMetadataResponse.constructFromObject({
      metadata: {},
    });
    res.json((response));
  });

  app.post('/construction/submit', (req, res) => {
    const expected = {
      network_identifier: basicNetwork,
      signed_transaction: false,
    };
    expect(c(req.body)).to.deep.equal(expected);

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = new Rosetta.Client.TransactionIdentifierResponse.constructFromObject({
      transaction_identifier: basicTransactions[0],
      metadata: {},
    });
    res.json((response));
  });

  app.post('/construction/combine', (req, res) => {
    const expected = {
      network_identifier: basicNetwork,
      unsigned_transaction: unsignedTransaction,
      signatures: [],
    };
    expect(c(req.body)).to.deep.equal(expected);

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = new Rosetta.Client.ConstructionCombineResponse.constructFromObject({
      signed_transaction: signedTransaction
    });
    res.json((response));
  });

  app.post('/construction/derive', (req, res) => {
    const expected = {
      network_identifier: basicNetwork,
      public_key: publicKey,
    };
    expect(c(req.body)).to.deep.equal(expected);

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = new Rosetta.Client.ConstructionDeriveResponse.constructFromObject({
      address: baseAddress,
      metadata: {},
    });
    res.json((response));
  });

  app.post('/construction/hash', (req, res) => {
    const expected = {
      network_identifier: basicNetwork,
      signed_transaction: true,
    };
    expect(c(req.body)).to.deep.equal(expected);

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = new Rosetta.Client.TransactionIdentifierResponse.constructFromObject({
      transaction_identifier: {
        hash: transactionHash,
      },
    });
    res.json((response));
  });

  app.post('/construction/parse', (req, res) => {
    const expected = {
      network_identifier: basicNetwork,
      signed: true,
      transaction: signedTransaction,
    };
    expect(c(req.body)).to.deep.equal(expected);

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = new Rosetta.Client.ConstructionParseResponse.constructFromObject({
      operations: [],
      signers: [],
      metadata: {},
    });
    res.json((response));
  });

  app.post('/construction/payloads', (req, res) => {
    const expected = {
      network_identifier: basicNetwork,
      operations: [],
      metadata: {},
    };
    expect(c(req.body)).to.deep.equal(expected);

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = new Rosetta.Client.ConstructionPayloadsResponse.constructFromObject({
      unsigned_transaction: unsignedTransaction,
      payloads: [],
    });
    res.json((response));
  });

  app.post('/construction/preprocess', (req, res) => {
    const expected = {
      network_identifier: basicNetwork,
      operations: [],
      metadata: {},
    };
    expect(c(req.body)).to.deep.equal(expected);

    if (tries < params.errorsBeforeSuccess) {
      tries++;
      res.status(500);
      return res.json({});
    }

    const response = new Rosetta.Client.ConstructionPreprocessResponse.constructFromObject({
      options: [],
    });
    res.json((response));
  });

  const server = app.listen(params.port || 8000, null);

  return server;
};

const launchServer = (options) => {
  return new Promise((fulfill, reject) => {
    let server;

    const cb = () => {
      createServer(options).then(s => {
        server = s;
        fulfill();
      });
    };

    if (server)
      server.close(cb);
    else
      cb();
  });
};
module.exports = { launchServer, getPort };

describe('Fetcher', function () {

  describe('Initialize block',  function () {
    it('should pass initialization', async function () {
      let thrown = false;
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const blockMap = await fetcher.blockRange(
        basicNetwork,
        basicBlock.index,
        basicBlock.index + 1,
      );
      expect(thrown).to.equal(false);
      expect(c(blockMap[0])).to.deep.equal(basicFullBlock);
    });
  });

  describe('Initialize Asserter Test',  function () {
    it('should pass initialization', async function () {
      let thrown = false;
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const { primaryNetwork, networkStatus } = await fetcher.initializeAsserter();

      expect(thrown).to.equal(false);
      expect(c(primaryNetwork)).to.deep.equal(basicNetwork);
      expect(c(networkStatus)).to.deep.equal(basicNetworkStatus);
    });

    it('should throw when asserter already initialized', async function () {
      let thrown = false;
      const port = getPort();

      const asserter = RosettaSDK.Asserter.NewClientWithResponses(
        basicNetwork,
        basicNetworkStatus,
        basicNetworkOptions,
      );

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
        asserter,
      });

      try {
        await fetcher.initializeAsserter();
      } catch (e) {
        expect(e.name).to.equal('FetcherError');
        expect(e.message).to.equal('Asserter already initialized');
        thrown = true;
      }

      expect(thrown).to.equal(true);
    });

    it('should throw when can\'t connect to network', async function () {
      let thrown = false;
      const port = getPort();

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port: port + 1
        }
      });

      try {
        await fetcher.initializeAsserter();
      } catch (e) {
        expect(e.name).to.equal('FetcherError');
        expect(e.message).to.equal('Can\'t connect to network');
        thrown = true;
      }

      expect(thrown).to.equal(true);
    });

    it('should throw when no networks available', async function () {
      let thrown = false;
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
        noNetwork: true,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port
        }
      });

      try {
        await fetcher.initializeAsserter();
      } catch (e) {
        expect(e.name).to.equal('FetcherError');
        expect(e.message).to.equal('No Networks available');
        thrown = true;
      }

      expect(thrown).to.equal(true);
    });
  });

  describe('Test AccountBalanceRetry', function () {
    this.timeout(5000);

    it('no failures', async function () {
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const { block, balances, metadata, coins } =
        await fetcher.accountBalanceRetry(basicNetwork, basicAccount, null);

      expect(block).to.deep.equal(basicBlock);
      expect(basicAmounts.map((amount) => {
        return Rosetta.Client.Amount.constructFromObject(amount);
      })).to.deep.equal(balances);

      return true;
    });

    it('retry failures', async function () {
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 2,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const { block, balances, metadata } =
        await fetcher.accountBalanceRetry(basicNetwork, basicAccount, null);

      expect(basicBlock).to.deep.equal(block);
      expect(basicAmounts.map((amount) => {
        return Rosetta.Client.Amount.constructFromObject(amount);
      })).to.deep.equal(balances);
      expect(metadata).to.deep.equal(metadata);
      return true;
    });

    it('exhausted failures', async function () {
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 2,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 1,
        },
        server: {
          port,
        },
      });

      try {
        const { block, balances, metadata } =
        await fetcher.accountBalanceRetry(basicNetwork, basicAccount, null);

      } catch(e) {
        expect(e.status).to.equal(500);
        return true;
      }

      throw new Error('Fetcher did exceed its max number of allowed retries');
    });
  });

  /**
   * BlockRetry
   */

  describe('Test BlockRetry', function () {
    this.timeout(5000);

    it('no failures', async function () {
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const block =
        await fetcher.blockRetry(basicNetwork, constructPartialBlockIdentifier(basicBlock));

      expect(c(block)).to.deep.equal(basicFullBlock);
      return true;
    });

    it('no failures with block transactions', async function () {
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const block =
        await fetcher.blockRetry(basicNetwork, constructPartialBlockIdentifier(basicBlockWithTx));

      expect(c(block)).to.deep.equal({ ...basicFullBlockWithTx, transactions: [basicTransaction] });
      return true;
    });

    it('retry failures', async function () {
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 2,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const block =
        await fetcher.blockRetry(basicNetwork, constructPartialBlockIdentifier(basicBlock));

      expect(c(block)).to.deep.equal(basicFullBlock);
      return true;
    });

    it('exhausted failures', async function () {
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 2,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 1,
        },
        server: {
          port,
        },
      });

      try {
        const block =
          await fetcher.blockRetry(basicNetwork, constructPartialBlockIdentifier(basicBlock));

      } catch(e) {
        expect(e.status).to.equal(500);
        return true;
      }

      throw new Error('Fetcher did exceed its max number of allowed retries');
    });
  });

  /**
   * Block transactions
   */

  describe('Test block transaction', function () {
    this.timeout(5000);

    it('no failures', async function () {
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const transactions = await fetcher.transactions(
        basicNetwork,
        constructPartialBlockIdentifier(basicBlockWithTx),
        basicTransactions,
      );

      expect(c(transactions[0])).to.deep.equal(basicTransaction);
      return true;
    });
  });

  /*
   * NETWORK
   */

  describe('Test NetworkListRetry', function () {
    this.timeout(5000);

    it('no failures', async function () {
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const networkList =
        await fetcher.networkListRetry({});

      const expectedResponse = new Rosetta.Client.NetworkListResponse(basicNetworkList);

      expect(c(networkList)).to.deep.equal(expectedResponse);
      return true;
    });

    it('retry failures', async function () {
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 2,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const networkList =
        await fetcher.networkListRetry({});

      const expectedResponse = new Rosetta.Client.NetworkListResponse(basicNetworkList);

      expect(c(networkList)).to.deep.equal(expectedResponse);
      return true;
    });

    it('exhausted retries', async function () {
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 2,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 1,
        },
        server: {
          port,
        },
      });

      try {
        const networkList =
          await fetcher.networkListRetry({});

      } catch(e) {
        expect(e.status).to.equal(500);
        return true;
      }

      throw new Error('Fetcher did exceed its max number of allowed retries');
    });
  });

  describe('Test NetworkStatusRetry', function () {
    this.timeout(5000);

    it('no failures', async function () {
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const networkList =
        await fetcher.networkStatusRetry(basicNetwork);

      expect(c(networkList)).to.deep.equal(basicNetworkStatus);
      return true;
    });

    it('retry failures', async function () {
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 2,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const networkList =
        await fetcher.networkStatusRetry(basicNetwork);

      expect(c(networkList)).to.deep.equal(basicNetworkStatus);
      return true;
    });

    it('exhausted retries', async function () {
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 2,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 1,
        },
        server: {
          port,
        },
      });

      try {
        const networkList =
          await fetcher.networkStatusRetry(basicNetwork);

      } catch(e) {
        expect(e.status).to.equal(500);
        return true;
      }

      throw new Error('Fetcher did exceed its max number of allowed retries');
    });
  });

  describe('Test Mempool',  function () {
    it('should throw when empty mempool', async function () {
      let thrown = false;
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      try {
        await fetcher.mempool(noMempoolNetwork);
      } catch (e) {
        expect(e.name).to.equal('FetcherError');
        expect(e.message).to.equal('Mempool is empty');
        thrown = true;
      }

      expect(thrown).to.equal(true);
    });

    it('should pass mempool', async function () {
      let thrown = false;
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const mempool = await fetcher.mempool(basicNetwork);

      expect(thrown).to.equal(false);
      expect(c(mempool)).to.deep.equal(basicMempool);
    });

    it('should pass mempool transaction', async function () {
      let thrown = false;
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const mempoolTransaction = await fetcher.mempoolTransaction(basicNetwork, basicTransactions[0]);

      expect(thrown).to.equal(false);
      expect(c(mempoolTransaction)).to.deep.equal(basicTransaction);
    });
  });

  describe('Test Construction',  function () {
    it('should pass construction metadata', async function () {
      let thrown = false;
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const metadata = await fetcher.constructionMetadata(basicNetwork);

      expect(thrown).to.equal(false);
      expect(c(metadata)).to.deep.equal({});
    });

    it('should pass construction submit', async function () {
      let thrown = false;
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const submit = await fetcher.constructionSubmit(basicNetwork, false);

      expect(thrown).to.equal(false);
      expect(c(submit.transactionIdentifier)).to.deep.equal(basicTransactions[0]);
      expect(c(submit.metadata)).to.deep.equal({});
    });

    it('should pass construction combine', async function () {
      let thrown = false;
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const signedTx = await fetcher.constructionCombine(basicNetwork, unsignedTransaction, []);

      expect(thrown).to.equal(false);
      expect(signedTx).to.deep.equal(signedTransaction);
    });

    it('should pass construction derive', async function () {
      let thrown = false;
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const derive = await fetcher.constructionDerive(basicNetwork, publicKey, {});

      expect(thrown).to.equal(false);
      expect(derive.address).to.deep.equal(baseAddress);
    });

    it('should pass construction hash', async function () {
      let thrown = false;
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const transaction = await fetcher.constructionHash(basicNetwork, true);

      expect(thrown).to.equal(false);
      expect(transaction.hash).to.deep.equal(transactionHash);
    });

    it('should pass construction parse', async function () {
      let thrown = false;
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const parsedData = await fetcher.constructionParse(basicNetwork, true, signedTransaction);

      expect(thrown).to.equal(false);
      expect(parsedData.operations).to.deep.equal([]);
      expect(parsedData.signers).to.deep.equal([]);
      expect(parsedData.metadata).to.deep.equal({});
    });

    it('should pass construction payloads', async function () {
      let thrown = false;
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const result = await fetcher.constructionPayloads(basicNetwork, [], {});

      expect(thrown).to.equal(false);
      expect(result.unsigned_transaction).to.deep.equal(unsignedTransaction);
      expect(result.payloads).to.deep.equal([]);
    });

    it('should pass construction preprocess', async function () {
      let thrown = false;
      const port = getPort();

      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port,
        },
      });

      const result = await fetcher.constructionPreprocess(basicNetwork, [], {});

      expect(thrown).to.equal(false);
      expect(result).to.deep.equal([]);
    });
  });
});
