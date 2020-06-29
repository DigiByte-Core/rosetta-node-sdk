// fetcher.test.js
const { expect } = require('chai');
const Rosetta = require('..');
const bodyParser = require('body-parser');

const basicNetwork = {
  blockchain: "blockchain",
  network:    "network",
};

const basicAccount = {
  address: "address",
};

const basicBlock = {
  index: 10,
  hash:  "block 10",
};

const basicAmounts = [{
  value: "1000",
  currency: {
    symbol:   "BTC",
    decimals: 8,
  },
}];

const PORT = 8000;

async function createServer(params) {
  const app = require('express')();
  var tries = 0;

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

  const server = app.listen(params.port || 8000, null);

  return server;
}

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
}

describe('Fetcher::Account', function () {
  describe('TestAccountBalanceRetry', function () {
    it('no failures', async function () {
      const server = await launchServer({
        errorsBeforeSuccess: 0,
        port: 8000,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port: 8000,
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

    it('retry failures', async function () {
      const server = await launchServer({
        errorsBeforeSuccess: 2,
        port: 8001,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 5,
        },
        server: {
          port: 8001,
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
      const server = await launchServer({
        errorsBeforeSuccess: 2,
        port: 8002,
      });

      const fetcher = new Rosetta.Fetcher({
        retryOptions: {
          numOfAttempts: 1,
        },
        server: {
          port: 8002,
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
});