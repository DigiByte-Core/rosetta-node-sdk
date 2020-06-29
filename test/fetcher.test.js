// fetcher.test.js
const { expect } = require('chai');
const Rosetta = require('..');
const app = require('express')();
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

  const server = app.listen(8000, () => console.log('Listening'));

  return server;
}

describe('Fetcher::Account', function () {
  describe('TestAccountBalanceRetry', function () {
    let server;
    const options = {
      errorsBeforeSuccess: 0,
    };

    beforeEach((done) => {
      const cb = () => {
        createServer(options).then(s => {
          server = s;
          done();
        });
      };

      if (server)
        server.close(cb);
      else
        cb();
    });

    it('no failures', async function () {
      options.errorsBeforeSuccess = 0;
      const fetcher = new Rosetta.Fetcher();

      // const { responseBlock, balances, metadata } =
      const { block, balances, metadata } =
        await fetcher.accountBalanceRetry(basicNetwork, basicAccount, null);

        console.log(basicAmounts, balances)

      expect(basicBlock).to.deep.equal(block);

      expect(basicAmounts.map((amount) => {
        return Rosetta.Client.Amount.constructFromObject(amount);
      })).to.deep.equal(balances);

      expect(metadata).to.deep.equal(metadata);
      return true;
    });

    it('retry failures', async function (done) {
      options.errorsBeforeSuccess = 2;
    });

    it('exhausted failures', async function (done) {
      options.errorsBeforeSuccess = 2;
    });
  });
});