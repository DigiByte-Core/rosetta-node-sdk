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

// asserter.test.js

// server.test.js
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const RosettaSDK = require('..');

const {
  constructPartialBlockIdentifier,
} = require('../lib/utils');

const c = (j) => j == undefined ? undefined : JSON.parse(JSON.stringify(j));

const T = RosettaSDK.Client;

const createTempDir = () => {
  return new Promise((fulfill, reject) => {
    fs.mkdtemp('rosetta-test', (err, dir) => {
      if (err) return reject();
      return fulfill(dir);
    });    
  });
};

describe('Asserter Tests', function () {
  describe('Main', function () {
    const validNetwork = T.NetworkIdentifier.constructFromObject({
      blockchain: 'hello',
      network: 'world',
    });

    const validNetworkStatus = T.NetworkStatusResponse.constructFromObject({
      current_block_identifier: T.BlockIdentifier.constructFromObject({
        index: 0,
        hash: 'block 0',
      }),      
      genesis_block_identifier: T.BlockIdentifier.constructFromObject({
        index: 100,
        hash: 'block 100',        
      }),
      current_block_timestamp: RosettaSDK.Asserter.MinUnixEpoch + 1,
      peers: [
        { peer_id: 'peer 1' },
      ],
    });

    const invalidNetworkStatus = T.NetworkStatusResponse.constructFromObject({
      current_block_identifier: T.BlockIdentifier.constructFromObject({
        index: 100,
        hash: 'block 100',
      }),      
      current_block_timestamp: RosettaSDK.Asserter.MinUnixEpoch + 1,
      peers: [
        { peer_id: 'peer 1' },
      ],
    });

    const validNetworkOptions = T.NetworkOptionsResponse.constructFromObject({
      version: new T.Version('1.4.0', '1.0'),
      allow: T.Allow.constructFromObject({
        operation_statuses: [
          new T.OperationStatus('Success', true),
        ],
        operation_types: ['Transfer'],
        errors: [
          new T.Error(1, 'error', true),
        ],
        // historical_balance_lookup: true,
      }),
    });

    const invalidNetworkOptions = T.NetworkOptionsResponse.constructFromObject({
      version: new T.Version('1.4.0', '1.0'),
      allow: T.Allow.constructFromObject({
        operation_statuses: [],
        operation_types: ['Transfer'],
        errors: [
          new T.Error(1, 'error', true),
        ],
      }),
    });    

    const duplicateStatuses = T.NetworkOptionsResponse.constructFromObject({
      version: new T.Version('1.4.0', '1.0'),
      allow: T.Allow.constructFromObject({
        operation_statuses: [
          new T.OperationStatus('Success', true),
          new T.OperationStatus('Success', true),
        ],
        operation_types: ['Transfer'],
        errors: [
          new T.Error(1, 'error', true),
        ],
      }),
    });     

    const duplicateTypes = T.NetworkOptionsResponse.constructFromObject({
      version: new T.Version('1.4.0', '1.0'),
      allow: T.Allow.constructFromObject({
        operation_types: ['Transfer', 'Transfer'],
        operation_statuses: [new T.OperationStatus('Success', true)],
        errors: [
          new T.Error(1, 'error', true),
        ],
      }),
    });  

    const tests = {
      "valid responses": {
        network:        validNetwork,
        networkStatus:  validNetworkStatus,
        networkOptions: validNetworkOptions,

        err: null,
      },
      "invalid network status": {
        network:        validNetwork,
        networkStatus:  invalidNetworkStatus,
        networkOptions: validNetworkOptions,

        err: "BlockIdentifier is null",
      },
      "invalid network options": {
        network:        validNetwork,
        networkStatus:  validNetworkStatus,
        networkOptions: invalidNetworkOptions,

        err: "No Allow.operation_statuses found",
      },
      "duplicate operation statuses": {
        network:        validNetwork,
        networkStatus:  validNetworkStatus,
        networkOptions: duplicateStatuses,

        err: "Allow.operation_statuses contains a duplicate element: Success",
      },
      "duplicate operation types": {
        network:        validNetwork,
        networkStatus:  validNetworkStatus,
        networkOptions: duplicateTypes,

        err: "Allow.operation_statuses contains a duplicate element: Transfer",
      },
    };

    for (const test of Object.keys(tests)) {
      const testName = test;
      const testParams = tests[test];

      it(`should pass case '${testName}' with responses`, function () {
        let client;
        let configuration;

        try {
          client = RosettaSDK.Asserter.NewClientWithResponses(
            testParams.network,
            testParams.networkStatus,
            testParams.networkOptions,
          );
        } catch (e) {
          // console.error(e)
          expect(e.message).to.equal(testParams.err);
          return;
        }

        expect(client).to.not.equal(null);

        let thrown = false;

        try {
          configuration = client.getClientConfiguration();
        } catch (e) {
          console.error(e);
          thrown = true;
        }

        expect(thrown).to.equal(false);
        expect(configuration.network_identifier).to.equal(testParams.network)
        expect(configuration.genesis_block_identifier).to.equal(testParams.networkStatus.genesis_block_identifier);
        expect(configuration.allowed_operation_types).to.deep.equal(testParams.networkOptions.allow.operation_types);
        expect(configuration.allowed_operation_statuses).to.deep.equal(testParams.networkOptions.allow.operation_statuses);
      });

      it(`should pass case '${testName}' with file`, async function () {
        let dirpath;
        let filepath;
        let configuration;
        let client;
        let thrown = false;

        dirpath = await createTempDir();

        setTimeout(() => {
          // cleanup
          if (fs.existsSync(filepath))
            fs.unlinkSync(filepath);

          fs.rmdirSync(dirpath);
        }, 100);

        configuration = {
          network_identifier: testParams.network,
          genesis_block_identifier: testParams.networkStatus.genesis_block_identifier,
          allowed_operation_types: testParams.networkOptions.allow.operation_types,
          allowed_operation_statuses: testParams.networkOptions.allow.operation_statuses,
          allowed_errors: testParams.networkOptions.allow.errors,
        };

        filepath = path.join(dirpath, 'test.json');
        fs.writeFileSync(filepath, JSON.stringify(configuration));

        try {
          client = RosettaSDK.Asserter.NewClientWithFile(filepath);
        } catch(f) {
          // console.error(f)
          expect(f.message).to.equal(testParams.err);
          return;
        }

        try {
          configuration = client.getClientConfiguration();
        } catch (f) {
          // console.error(f);
          thrown = true;
        }    

        expect(thrown).to.equal(false);

        expect((configuration.network_identifier))
          .to.deep.equal(c(testParams.network))

        expect((configuration.genesis_block_identifier))
          .to.deep.equal((testParams.networkStatus.genesis_block_identifier));

        expect((configuration.allowed_operation_types))
          .to.deep.equal((testParams.networkOptions.allow.operation_types));

        expect((configuration.allowed_operation_statuses))
          .to.deep.equal((testParams.networkOptions.allow.operation_statuses));
      });        
    } 
  });

  describe('Contains Currency', function () {
    const asserter = new RosettaSDK.Asserter();

    it('should properly check if a currency is contained', async function () {
      const toFind = new T.Currency('BTC', 8);

      const currencies = [
        new T.Currency('BTC', 8),
      ];

      const result = asserter.containsCurrency(currencies, toFind);

      expect(result).to.equal(true);
    });

    it('should handle complex contains', async function () {
      const toFind = T.Currency.constructFromObject({
        symbol: 'BTC',
        decimals: 8,
        metadata: {
          'blah': 'hello',
        },
      });
      
      const currencies = [
        T.Currency.constructFromObject({
          symbol: 'BTC',
          decimals: 8,
          metadata: {
            'blah': 'hello',
          },
        }),
      ];

      const result = asserter.containsCurrency(currencies, toFind);

      expect(result).to.equal(true);
    });    

    it('should handle more complex contains', async function () {
      const toFind = T.Currency.constructFromObject({
        symbol: 'BTC',
        decimals: 8,
        metadata: {
          'blah': 'hello',
          'blah2': 'bye',
        },
      });
      
      const currencies = [
        T.Currency.constructFromObject({
          symbol: 'BTC',
          decimals: 8,
          metadata: {
            'blah': 'hello',
            'blah2': 'bye',
          },
        }),
      ];

      const result = asserter.containsCurrency(currencies, toFind);

      expect(result).to.equal(true);
    });     

    it('should not find a currency in an empty currency array', async function () {
      const toFind = T.Currency.constructFromObject({
        symbol: 'BTC',
        decimals: 8,
      });
      
      const currencies = [];

      const result = asserter.containsCurrency(currencies, toFind);

      expect(result).to.equal(false);
    });     

    it('should not find a currency with a different symbol', async function () {
      const toFind = T.Currency.constructFromObject({
        symbol: 'BTC',
        decimals: 8,
      });
      
      const currencies = [
        T.Currency.constructFromObject({
          symbol: 'ERX',
          decimals: 8,
        }),
      ];

      const result = asserter.containsCurrency(currencies, toFind);

      expect(result).to.equal(false);
    });    

    it('should not find a currency with different decimals', async function () {
      const toFind = T.Currency.constructFromObject({
        symbol: 'BTC',
        decimals: 8,
      });
      
      const currencies = [
        T.Currency.constructFromObject({
          symbol: 'BTC',
          decimals: 6,
        }),
      ];

      const result = asserter.containsCurrency(currencies, toFind);

      expect(result).to.equal(false);
    });     

    it('should not find a currency with different metadata', async function () {
      const toFind = T.Currency.constructFromObject({
        symbol: 'BTC',
        decimals: 8,
        metadata: {
          'blah': 'hello',
        },
      });
      
      const currencies = [
        T.Currency.constructFromObject({
          symbol: 'BTC',
          decimals: 8,
          metadata: {
            'blah': 'bye',
          },
        }),
      ];

      const result = asserter.containsCurrency(currencies, toFind);

      expect(result).to.equal(false);
    });         
  });

  describe('Account Balance', function () {
    const asserter = new RosettaSDK.Asserter();

    const validBlock = T.BlockIdentifier.constructFromObject({
      index: 1000,
      hash: 'jsakdl',
    });

    const invalidBlock = T.BlockIdentifier.constructFromObject({
      index: 1,
      hash: '',
    });

    const invalidIndex = 1001;
    const invalidHash = 'ajsdk';
    const validAmount = T.Amount.constructFromObject({
      value: '100',
      currency: T.Currency.constructFromObject({
        symbol: 'BTC',
        decimals: 8,
      }),
    });

    it('should properly encode a simple balance', () => {
      let thrown = false;
      try {
        asserter.AccountBalanceResponse(null, validBlock, [ validAmount ]);
      } catch (e) {
        console.error(e);
        thrown = true;
      }

      expect(thrown).to.equal(false);
    });

    it('should detect an invalid block', () => {
      let thrown = false;
      try {
        asserter.AccountBalanceResponse(null, invalidBlock, [ validAmount ]);
      } catch (e) {
        // console.error(e);
        expect(e.message).to.equal('BlockIdentifier.hash is missing');
        thrown = true;
      }

      expect(thrown).to.equal(true);
    });

    it('should detect duplicate currencies', () => {
      let thrown = false;
      try {
        asserter.AccountBalanceResponse(null, validBlock, [ validAmount, validAmount ]);
      } catch (e) {
        // console.error(e);
        expect(e.message).to.equal('Currency BTC used in balance multiple times');
        thrown = true;
      }

      expect(thrown).to.equal(true);
    });
    
    it('should assert history request index as valid', () => {
      let thrown = false;
      try {
        const req = T.PartialBlockIdentifier.constructFromObject({
          index: validBlock.index,
        });
        asserter.AccountBalanceResponse(req, validBlock, [ validAmount ]);
      } catch (e) {
        console.error(e);
        thrown = true;
      }

      expect(thrown).to.equal(false);
    });

    it('should assert valid history request hash as valid', () => {
      let thrown = false;
      try {
        const req = T.PartialBlockIdentifier.constructFromObject({
          hash: validBlock.hash,
        });
        asserter.AccountBalanceResponse(req, validBlock, [ validAmount ]);
      } catch (e) {
        console.error(e);
        thrown = true;
      }

      expect(thrown).to.equal(false);
    });

    it('should assert valid history request as valid', () => {
      let thrown = false;
      try {
        const req = constructPartialBlockIdentifier(validBlock);
        asserter.AccountBalanceResponse(req, validBlock, [ validAmount ]);
      } catch (e) {
        console.error(e);
        thrown = true;
      }

      expect(thrown).to.equal(false);
    });    

    it('should assert valid history request index as invalid', () => {
      let thrown = false;
      try {
        const req = T.PartialBlockIdentifier.constructFromObject({
          hash: validBlock.hash,
          index: invalidIndex,
        });
        asserter.AccountBalanceResponse(req, validBlock, [ validAmount ]);
      } catch (e) {
        // console.error(e);
        expect(e.message).to.equal('Request Index 1001 does not match Response block index 1000');
        thrown = true;
      }

      expect(thrown).to.equal(true);
    });    

    it('should assert invalid historical request hash as invalid', () => {
      let thrown = false;
      try {
        const req = T.PartialBlockIdentifier.constructFromObject({
          hash: invalidHash,
          index: validBlock.index,
        });
        asserter.AccountBalanceResponse(req, validBlock, [ validAmount ]);
      } catch (e) {
        // console.error(e);
        expect(e.message).to.equal('Request BlockHash ajsdk does not match Response block hash jsakdl');
        thrown = true;
      }

      expect(thrown).to.equal(true);
    });     
  });
});