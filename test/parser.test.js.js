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

// parser.test.js
const { expect } = require('chai');
const RosettaSDK = require('..');

const { Hash } = RosettaSDK.Utils;

const currency = { /* Currency */
  symbol:   "Blah",
  decimals: 2,
};

const recipient = { /* AccountIdentifier */
  address: "acct1",
};

const recipientAmount = { /* Amount */
  value:    "100",
  currency: currency,
};

const emptyAccountAndAmount = { /* Operation */
  operation_identifier: {
    index: 0,
  },
  type:   "Transfer",
  status: "Success",
};

const emptyAmount = { /* Operation */
  operation_identifier: {
    index: 0,
  },
  type:    "Transfer",
  status:  "Success",
  account: recipient,
};

const recipientOperation = { /* Operation */
  operation_identifier: {
    index: 0,
  },
  type:    "Transfer",
  status:  "Success",
  account: recipient,
  amount:  recipientAmount,
};

const recipientFailureOperation = { /* Operation */
  operation_identifier: {
    index: 1,
  },
  type:    "Transfer",
  status:  "Failure",
  account: recipient,
  amount:  recipientAmount,
};

const recipientTransaction = { /* Transaction */
  transaction_identifier: {
    hash: "tx1",
  },
  operations: [
    emptyAccountAndAmount,
    emptyAmount,
    recipientOperation,
    recipientFailureOperation,
  ],
};

const defaultStatus = [ /* OperationStatus */
  {
    status:     "Success",
    successful: true,
  }, {
    status:     "Failure",
    successful: false,
  },
];

const createTransaction = (hash, address, value, currency) => {
  return { /* Transaction */
    transaction_identifier: {
      hash: hash,
    },

    operations: [{ /* [Operation] */
      operation_identifier: {
        index: 0,
      },

      type: 'Transfer',

      status: 'Success',

      account: {
        address: address,
      },

      amount: {
        value: value,
        currency: currency,
      },
    }],
  };
};

const createAsserter = (allowedStatuses) => {
  const asserter = new RosettaSDK.Asserter({
    networkIdentifier: {
      blockchain: 'bitcoin',
      network: 'mainnet',
    },

    genesisBlock: {
      hash: 'block 0',
      index: 0,
    },

    operationTypes: ['Transfer'],

    operationStatuses: allowedStatuses,

    errorTypes: [],
  });

  return asserter;
};

describe('Parser', function () {
  it('be able to parse a block', async function () {
    const asserter = createAsserter(defaultStatus);

    const parser = new RosettaSDK.Parser({
      asserter,
    });

    const block = {
      block_identifier: {
        hash: '1',
        index: 1,
      },

      parent_block_identifier: {
        hash: '0',
        index: 0,
      },

      transactions: [
        recipientTransaction,
      ],

      timestamp: asserter.minUnixEpoch + 1,
    };

    const expectedChanges = [
      {
        account_identifier: recipient,
        currency: currency,
        block_identifier: {
          hash: '1',
          index: 1,
        },
        difference: '100',
      },
    ];

    const isOrphan = false;

    const changes = parser.balanceChanges(block, isOrphan);
    expect(changes).to.deep.equal(expectedChanges);
  });

  it('work with an excempt function', async function () {
    const asserter = createAsserter(defaultStatus);

    const parser = new RosettaSDK.Parser({
      asserter,
      exemptFunc: (op) => 
        Hash(op.account) == Hash(recipientOperation.account),      
    });

    const block = {
      block_identifier: {
        hash: '1',
        index: 1,
      },

      parent_block_identifier: {
        hash: '0',
        index: 0,
      },

      transactions: [
        recipientTransaction,
      ],

      timestamp: asserter.minUnixEpoch + 1,
    };

    const expectedChanges = [];
    const isOrphan = false;

    const changes = parser.balanceChanges(block, isOrphan);
    expect(changes).to.deep.equal(expectedChanges);    
  });

  it('should group balanceChanges if an address receives multiple utxos', async function () {
    const asserter = createAsserter(defaultStatus);

    const parser = new RosettaSDK.Parser({
      asserter,
    });

    const block = {
      block_identifier: {
        hash: '1',
        index: 1,
      },

      parent_block_identifier: {
        hash: '0',
        index: 0,
      },

      transactions: [
        createTransaction('tx1', 'addr1', '100', currency),
        createTransaction('tx2', 'addr1', '150', currency),
        createTransaction('tx3', 'addr2', '150', currency),
      ],

      timestamp: asserter.minUnixEpoch + 1,
    };

    const expectedChanges = [
      {
        account_identifier: { address: 'addr1' },
        currency: currency,
        block_identifier: {
          hash: '1',
          index: 1,
        },
        difference: '250',
      },

      {
        account_identifier: { address: 'addr2' },
        currency: currency,
        block_identifier: {
          hash: '1',
          index: 1,
        },
        difference: '150',
      },
    ];

    const isOrphan = false;

    const changes = parser.balanceChanges(block, isOrphan);
    expect(changes).to.deep.equal(expectedChanges);
  });

  it('should reduce balance again if an orphan block appears', async function () {
    const asserter = createAsserter(defaultStatus);

    const parser = new RosettaSDK.Parser({
      asserter,
    });

    const block = {
      block_identifier: {
        hash: '1',
        index: 1,
      },

      parent_block_identifier: {
        hash: '0',
        index: 0,
      },

      transactions: [
        createTransaction('tx1', 'addr1', '100', currency),
        createTransaction('tx2', 'addr1', '150', currency),
        createTransaction('tx3', 'addr2', '150', currency),
      ],

      timestamp: asserter.minUnixEpoch + 1,
    };

    const expectedChanges = [
      {
        account_identifier: { address: 'addr1' },
        currency: currency,
        block_identifier: {
          hash: '0',
          index: 0,
        },
        difference: '-250',
      },

      {
        account_identifier: { address: 'addr2' },
        currency: currency,
        block_identifier: {
          hash: '0',
          index: 0,
        },
        difference: '-150',
      },
    ];

    const isOrphan = true;

    const changes = parser.balanceChanges(block, isOrphan);
    expect(changes).to.deep.equal(expectedChanges);
  });
});