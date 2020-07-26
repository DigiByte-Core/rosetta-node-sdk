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

  describe('Block Tests', function () {
    const asserter = new RosettaSDK.Asserter();

    it('should successfully validate a block', async function () {
      let thrown = false;

      try {
        const block = new RosettaSDK.Client.BlockIdentifier(1, 'block 1');
        asserter.BlockIdentifier(block);
      } catch (e) {
        console.error(e);
        thrown = true; 
      }

      expect(thrown).to.equal(false);
    });

    it('should fail when blockidentifier is null', async function () {
      let thrown = false;

      try {
        const block = null;
        asserter.BlockIdentifier(block);
      } catch (e) {
        // console.error(e);
        expect(e.name).to.equal('AsserterError');
        expect(e.message).to.equal('BlockIdentifier is null');
        thrown = true; 
      }

      expect(thrown).to.equal(true);
    });

    it('should fail due to a negative index', async function () {
      let thrown = false;

      try {
        const block = new RosettaSDK.Client.BlockIdentifier(-1, 'block 1');
        asserter.BlockIdentifier(block);
      } catch (e) {
        // console.error(e);
        expect(e.name).to.equal('AsserterError');
        expect(e.message).to.equal('BlockIdentifier.index is negative');
        thrown = true; 
      }

      expect(thrown).to.equal(true);
    });

    it('should detect an invalid block hash', async function () {
      let thrown = false;

      try {
        const block = new RosettaSDK.Client.BlockIdentifier(1, '');
        asserter.BlockIdentifier(block);
      } catch (e) {
        // console.error(e);
        expect(e.name).to.equal('AsserterError');
        expect(e.message).to.equal('BlockIdentifier.hash is missing');
        thrown = true; 
      }

      expect(thrown).to.equal(true);
    });
  });

  describe('Test Amount', function () {
    const asserter = new RosettaSDK.Asserter();
    const { Amount, Currency } = RosettaSDK.Client;

    it('should correctly handle a valid amount', async function () {
      let thrown = false;

      try {
        const amount = new Amount('100000', new Currency('BTC', 1));
        asserter.Amount(amount);
      } catch (e) {
        console.error(e);
        thrown = true; 
      }

      expect(thrown).to.equal(false);
    });

    it('should correctly handle a valid amount with no decimals', async function () {
      let thrown = false;

      try {
        const amount = new Amount('100000', new Currency('BTC'));
        asserter.Amount(amount);
      } catch (e) {
        console.error(e);
        thrown = true; 
      }

      expect(thrown).to.equal(false);
    });

    it('should correctly handle a negative amount', async function () {
      let thrown = false;

      try {
        const amount = new Amount('-100000', new Currency('BTC', 1));
        asserter.Amount(amount);
      } catch (e) {
        console.error(e);
        thrown = true; 
      }

      expect(thrown).to.equal(false);
    });

    it('should throw when having detecting no amount', async function () {
      let thrown = false;

      try {
        const amount = null;
        asserter.Amount(amount);
      } catch (e) {
        // console.error(e);
        expect(e.name).to.equal('AsserterError');
        expect(e.message).to.equal('Amount.value is missing');
        thrown = true; 
      }

      expect(thrown).to.equal(true);
    });    

    it('should throw when currency is missing', async function () {
      let thrown = false;

      try {
        const amount = new Amount('100000', null);
        asserter.Amount(amount);
      } catch (e) {
        // console.error(e);
        expect(e.name).to.equal('AsserterError');
        expect(e.message).to.equal('Amount.currency is null');
        thrown = true; 
      }

      expect(thrown).to.equal(true);
    });       

    it('should throw if amount.value is not a number', async function () {
      let thrown = false;

      try {
        const amount = new Amount('xxxx', new Currency('BTC', 1));
        asserter.Amount(amount);
      } catch (e) {
        // console.error(e);
        expect(e.name).to.equal('AsserterError');
        expect(e.message).to.equal('Amount.value is not an integer: xxxx');
        thrown = true; 
      }

      expect(thrown).to.equal(true);
    });  

    it('should throw when detecting a non-int', async function () {
      let thrown = false;

      try {
        const amount = new Amount('1.1', new Currency('BTC', 1));
        asserter.Amount(amount);
      } catch (e) {
        // console.error(e);
        expect(e.name).to.equal('AsserterError');
        expect(e.message).to.equal('Amount.value is not an integer: 1.1');
        thrown = true; 
      }

      expect(thrown).to.equal(true);
    });   

    it('should throw when passing an invalid symbol', async function () {
      let thrown = false;

      try {
        const amount = new Amount('11', new Currency(null, 1));
        asserter.Amount(amount);
      } catch (e) {
        // console.error(e);
        expect(e.name).to.equal('AsserterError');
        expect(e.message).to.equal('Amount.currency does not have a symbol');
        thrown = true; 
      }

      expect(thrown).to.equal(true);      
    });     

    it('should throw when detecting invalid decimals', async function () {
      let thrown = false;

      try {
        const amount = new Amount('111', new Currency('BTC', -1));
        asserter.Amount(amount);
      } catch (e) {
        // console.error(e);
        expect(e.name).to.equal('AsserterError');
        expect(e.message).to.equal('Amount.currency.decimals must be positive. Found: -1');
        thrown = true; 
      }

      expect(thrown).to.equal(true); 
    });     
  });

  describe('Test OperationIdentifier', function () {
    const asserter = new RosettaSDK.Asserter();
    const { OperationIdentifier } = RosettaSDK.Client;

    const validNetworkIndex = 1;
    const invalidNetworkIndex = -1;

    it('should assert a valid identifier', async function () {
      let thrown = false;

      try {
        const opId = new OperationIdentifier(0);
        const index = 0;
        asserter.OperationIdentifier(opId, index);
      } catch (e) {
        console.error(e);
        thrown = true; 
      }

      expect(thrown).to.equal(false);       
    });

    it('should throw when passing null as identifier', async function () {
      let thrown = false;

      try {
        const opId = null;
        const index = 0;
        asserter.OperationIdentifier(opId, index);
      } catch (e) {
        // console.error(e);
        expect(e.name).to.equal('AsserterError');
        expect(e.message).to.equal('OperationIdentifier is null');
        thrown = true; 
      }

      expect(thrown).to.equal(true);       
    });    

    it('should throw when passing out of order index', async function () {
      let thrown = false;

      try {
        const opId = new OperationIdentifier(0);
        const index = 1;
        asserter.OperationIdentifier(opId, index);
      } catch (e) {
        // console.error(e);
        expect(e.name).to.equal('AsserterError');
        expect(e.message).to.equal('OperationIdentifier.index 0 is out of order, expected 1');
        thrown = true; 
      }

      expect(thrown).to.equal(true);       
    });      

    it('should assert a valid identifier with a networkIndex properly', async function () {
      let thrown = false;

      try {
        const opId = new OperationIdentifier(0);
        opId.network_index = validNetworkIndex;

        const index = 0;
        asserter.OperationIdentifier(opId, index);
      } catch (e) {
        // console.error(e);
        expect(e.name).to.equal('AsserterError');
        expect(e.message).to.equal('OperationIdentifier.index 0 is out of order, expected 1');
        thrown = true; 
      }

      expect(thrown).to.equal(false);       
    });   

    it('should throw when passing a valid identifier with an invalid networkIndex', async function () {
      let thrown = false;

      try {
        const opId = new OperationIdentifier(0);
        opId.network_index = invalidNetworkIndex;

        const index = 0;
        asserter.OperationIdentifier(opId, index);
      } catch (e) {
        // console.error(e);
        expect(e.name).to.equal('AsserterError');
        expect(e.message).to.equal('OperationIdentifier.network_index is invalid');
        thrown = true; 
      }

      expect(thrown).to.equal(true);       
    });  
  });

  describe('Test AccountIdentifier', function () {
    const asserter = new RosettaSDK.Asserter();
    const { AccountIdentifier, SubAccountIdentifier } = RosettaSDK.Client;   
    
    it('should assert a valid identifier properly', async function () {
      let thrown = false;

      try {
        const accId = new AccountIdentifier('acct1');
        asserter.AccountIdentifier(accId);
      } catch (e) {
        console.error(e);
        thrown = true; 
      }

      expect(thrown).to.equal(false);        
    }); 

    it('should throw when passing an invalid address', async function () {
      let thrown = false;

      try {
        const accId = new AccountIdentifier('');
        asserter.AccountIdentifier(accId);
      } catch (e) {
        // console.error(e);
        expect(e.name).to.equal('AsserterError');
        expect(e.message).to.equal('Account.address is missing');
        thrown = true; 
      }

      expect(thrown).to.equal(true);        
    }); 

    it('should assert a valid identifier with subaccount', async function () {
      let thrown = false;

      try {
        const accId = new AccountIdentifier('acct1');
        accId.sub_account = new SubAccountIdentifier('acct2');
        asserter.AccountIdentifier(accId);
      } catch (e) {
        console.error(e);
        thrown = true; 
      }

      expect(thrown).to.equal(false);        
    }); 

    it('throw when passing an invalid identifier with subaccount', async function () {
      let thrown = false;

      try {
        const accId = new AccountIdentifier('acct1');
        accId.sub_account = new SubAccountIdentifier('');
        asserter.AccountIdentifier(accId);
      } catch (e) {
        // console.error(e);
        expect(e.name).to.equal('AsserterError');
        expect(e.message).to.equal('Account.sub_account.address is missing');
        thrown = true; 
      }

      expect(thrown).to.equal(true);        
    }); 
  });

  describe('Test Operation', function () {
    const asserter = new RosettaSDK.Asserter();
    const {
      Amount,
      Currency,
      OperationIdentifier,
      Operation,
      AccountIdentifier,
      NetworkIdentifier,
      BlockIdentifier,
      Peer, 
      NetworkOptionsResponse,
      NetworkStatusResponse,
      Version,
      Allow,
      OperationStatus,
    } = RosettaSDK.Client;      

    const validAmount = new Amount('1000', new Currency('BTC', 8));
    const validAccount = new AccountIdentifier('test');

    const tests = {
      'valid operation': {
        operation: Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(1),
          type:    'PAYMENT',
          status:  'SUCCESS',
          account: validAccount,
          amount:  validAmount,
        }),
        index:      1,
        successful: true,
        err:        null,
      },
      'valid operation no account': {
        operation: Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(1),
          type:   'PAYMENT',
          status: 'SUCCESS',
        }),
        index:      1,
        successful: true,
        err:        null,
      },
      'nil operation': {
        operation: null,
        index:     1,
        err:       'Operation is null',
      },
      'invalid operation no account': {
        operation: Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(1),
          type:   'PAYMENT',
          status: 'SUCCESS',
          amount: validAmount,
        }),
        index: 1,
        err:   'Account is null',
      },
      'invalid operation empty account': {
        operation: Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(1),
          type:    'PAYMENT',
          status:  'SUCCESS',
          account: new AccountIdentifier(),
          amount:  validAmount,
        }),
        index: 1,
        err:   'Account.address is missing',
      },
      'invalid operation invalid index': {
        operation: Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(1),
          type:   'PAYMENT',
          status: 'SUCCESS',
        }),
        index: 2,
        err:   'OperationIdentifier.index 1 is out of order, expected 2',
      },
      'invalid operation invalid type': {
        operation: Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(1),
          type:   'STAKE',
          status: 'SUCCESS',
        }),
        index: 1,
        err:   'Operation.type STAKE is invalid',
      },
      'unsuccessful operation': {
        operation: Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(1),
          type:   'PAYMENT',
          status: 'FAILURE',
        }),
        index:      1,
        successful: false,
        err:        null,
      },
      'invalid operation invalid status': {
        operation: Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(1),
          type:   'PAYMENT',
          status: 'DEFERRED',
        }),
        index: 1,
        err:   'OperationStatus.status DEFERRED is not valid within this Asserter',
      },
      'valid construction operation': {
        operation: Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(1),
          type:    'PAYMENT',
          account: validAccount,
          amount:  validAmount,
        }),
        index:        1,
        successful:   false,
        construction: true,
        err:          null,
      },
      'invalid construction operation': {
        operation: Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(1),
          type:    'PAYMENT',
          status:  'SUCCESS',
          account: validAccount,
          amount:  validAmount,
        }),
        index:        1,
        successful:   false,
        construction: true,
        err:          'Operation.status must be empty for construction',
      },
    };

    for (let testName of Object.keys(tests)) {
      const testParams = tests[testName];

      const networkIdentifier = new NetworkIdentifier('hello', 'world');

      const networkStatusResponse = NetworkStatusResponse.constructFromObject({
        genesis_block_identifier: new BlockIdentifier(0, 'block 0'),
        current_block_identifier: new BlockIdentifier(100, 'block 100'),
        current_block_timestamp: RosettaSDK.Asserter.MinUnixEpoch + 1,
        peers: [ new Peer('peer 1') ],
      });

      const networkOptionsResponse = NetworkOptionsResponse.constructFromObject({
        version: new Version('1.4.0', '1.0'),
        allow: new Allow([
          new OperationStatus('SUCCESS', true),
          new OperationStatus('FAILURE', false),
        ], ['PAYMENT']),
      });

      let asserter;

      try {
        asserter = RosettaSDK.Asserter.NewClientWithResponses(
          networkIdentifier,
          networkStatusResponse,
          networkOptionsResponse,
        );
      } catch (e) {
        console.error(e);
      }

      it(`should pass test case '${testName}'`, async function () {
        expect(asserter).to.not.equal(undefined);

        let thrown = false;

        try {
          asserter.Operation(testParams.operation, testParams.index, testParams.construction);
        } catch (e) {
          // console.error(e);
          expect(e.message).to.equal(testParams.err);
          thrown = true;   
        }

        expect(thrown).to.equal(testParams.err != null);

        if (!thrown && !testParams.construction) {
          let success;

          try {
            success = asserter.OperationSuccessful(testParams.operation);
          } catch (e) {
            console.error(e);
            thrown = true;
          } finally {
            expect(thrown).to.equal(false);
            expect(success).to.equal(testParams.successful);
          }
        }
      });
    }
  });

  describe('Test Block', function () {
    const asserter = new RosettaSDK.Asserter();
    const {
      Amount,
      Currency,
      OperationIdentifier,
      Operation,
      AccountIdentifier,
      NetworkIdentifier,
      BlockIdentifier,
      Block,
      Transaction,
      TransactionIdentifier,
      Peer, 
      NetworkOptionsResponse,
      NetworkStatusResponse,
      Version,
      Allow,
      OperationStatus,
    } = RosettaSDK.Client;      

    const validBlockIdentifier = new BlockIdentifier(100, 'blah');
    const validParentBlockIdentifier = new BlockIdentifier(99, 'blah parent');

    const validAmount = new Amount('1000', new Currency('BTC', 8));
    const validAccount = new AccountIdentifier('test');

    const validTransaction = new Transaction(
      new TransactionIdentifier('blah'),
      [
        Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(0),
          type: 'PAYMENT',
          status: 'SUCCESS',
          account: validAccount,
          amount: validAmount,
        }),

        Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(1),
          related_operations: [
            new OperationIdentifier(0),
          ],
          type: 'PAYMENT',
          status: 'SUCCESS',
          account: validAccount,
          amount: validAmount,
        }),
      ],
    );

    const relatedToSelfTransaction = new Transaction(
      new TransactionIdentifier('blah'),
      [
        Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(0),
          related_operations: [
            new OperationIdentifier(0),
          ],      
          type: 'PAYMENT',
          status: 'SUCCESS',
          account: validAccount,
          amount: validAmount,
        }),
      ],
    );

    const outOfOrderTransaction = new Transaction(
      new TransactionIdentifier('blah'),
      [
        Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(1),
          related_operations: [
            new OperationIdentifier(0),
          ],      
          type: 'PAYMENT',
          status: 'SUCCESS',
          account: validAccount,
          amount: validAmount,
        }),

        Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(0),
          type: 'PAYMENT',
          status: 'SUCCESS',
          account: validAccount,
          amount: validAmount,
        }),
      ],
    );

    const relatedToLaterTransaction = new Transaction(
      new TransactionIdentifier('blah'),
      [
        Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(0),
          related_operations: [
            new OperationIdentifier(1),
          ],      
          type: 'PAYMENT',
          status: 'SUCCESS',
          account: validAccount,
          amount: validAmount,
        }),

        Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(1),
          related_operations: [
            new OperationIdentifier(0),
          ],      
          type: 'PAYMENT',
          status: 'SUCCESS',
          account: validAccount,
          amount: validAmount,
        }),
      ],
    );

    const relatedDuplicateTransaction = new Transaction(
      new TransactionIdentifier('blah'),
      [
        Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(0),
          type: 'PAYMENT',
          status: 'SUCCESS',
          account: validAccount,
          amount: validAmount,
        }),

        Operation.constructFromObject({
          operation_identifier: new OperationIdentifier(1),
          related_operations: [
            new OperationIdentifier(0),
            new OperationIdentifier(0),
          ],      
          type: 'PAYMENT',
          status: 'SUCCESS',
          account: validAccount,
          amount: validAmount,
        }),
      ],
    );    

    const tests = {
      'valid block': {
        block: Block.constructFromObject({
          block_identifier: validBlockIdentifier,
          parent_block_identifier: validParentBlockIdentifier,
          timestamp: RosettaSDK.Asserter.MinUnixEpoch + 1,
          transactions: [validTransaction],
        }),
        err: null,
      },
      'genesis block': {
        block: Block.constructFromObject({
          block_identifier: validBlockIdentifier,
          parent_block_identifier: validBlockIdentifier,
          transactions: [validTransaction],
        }),
        genesisIndex: validBlockIdentifier.index,
        err: null,
      },
      'out of order transaction operations': {
        block: Block.constructFromObject({
          block_identifier: validBlockIdentifier,
          parent_block_identifier: validParentBlockIdentifier,
          timestamp: RosettaSDK.Asserter.MinUnixEpoch + 1,
          transactions: [outOfOrderTransaction],
        }),
        err: 'OperationIdentifier.index 1 is out of order, expected 0',
      },
      'related to self transaction operations': {
        block: Block.constructFromObject({
          block_identifier: validBlockIdentifier,
          parent_block_identifier: validParentBlockIdentifier,
          timestamp: RosettaSDK.Asserter.MinUnixEpoch + 1,
          transactions: [relatedToSelfTransaction],
        }),
        err: 'Related operation index 0 >= operation index 0',
      },
      'related to later transaction operations': {
        block: Block.constructFromObject({
          block_identifier: validBlockIdentifier,
          parent_block_identifier: validParentBlockIdentifier,
          timestamp: RosettaSDK.Asserter.MinUnixEpoch + 1,
          transactions: [relatedToLaterTransaction],
        }),
        err: 'Related operation index 1 >= operation index 0',
      },
      'duplicate related transaction operations': {
        block: Block.constructFromObject({
          block_identifier: validBlockIdentifier,
          parent_block_identifier: validParentBlockIdentifier,
          timestamp: RosettaSDK.Asserter.MinUnixEpoch + 1,
          transactions: [relatedDuplicateTransaction],
        }),
        err: 'Found duplicate related operation index 0 for operation index 1',
      },
      'nil block': {
        block: null,
        err: 'Block is null',
      },
      'nil block hash': {
        block: Block.constructFromObject({
          block_identifier: null,
          parent_block_identifier: validParentBlockIdentifier,
          timestamp: RosettaSDK.Asserter.MinUnixEpoch + 1,
          transactions: [validTransaction],
        }),
        err: 'BlockIdentifier is null',
      },
      'invalid block hash': {
        block: Block.constructFromObject({
          block_identifier: new BlockIdentifier(),
          parent_block_identifier: validParentBlockIdentifier,
          timestamp: RosettaSDK.Asserter.MinUnixEpoch + 1,
          transactions: [validTransaction],
        }),
        err: 'BlockIdentifier.hash is missing',
      },
      'block previous hash missing': {
        block: Block.constructFromObject({
          block_identifier: validBlockIdentifier,
          parent_block_identifier: new BlockIdentifier(),
          timestamp: RosettaSDK.Asserter.MinUnixEpoch + 1,
          transactions: [validTransaction],
        }),
        err: 'BlockIdentifier.hash is missing',
      },
      'invalid parent block index': {
        block: Block.constructFromObject({
          block_identifier: validBlockIdentifier,
          parent_block_identifier: new BlockIdentifier(
            validBlockIdentifier.index,
            validParentBlockIdentifier.hash,
          ),
          timestamp: RosettaSDK.Asserter.MinUnixEpoch + 1,
          transactions: [validTransaction],
        }),
        err: 'BlockIdentifier.index <= ParentBlockIdentifier.index',
      },
      'invalid parent block hash': {
        block: Block.constructFromObject({
          block_identifier: validBlockIdentifier,
          parent_block_identifier: new BlockIdentifier(
            validParentBlockIdentifier.index,
            validBlockIdentifier.hash,
          ),
          timestamp: RosettaSDK.Asserter.MinUnixEpoch + 1,
          transactions: [validTransaction],
        }),
        err: 'BlockIdentifier.hash == ParentBlockIdentifier.hash',
      },
      'invalid block timestamp less than RosettaSDK.Asserter.MinUnixEpoch': {
        block: Block.constructFromObject({
          block_identifier: validBlockIdentifier,
          parent_block_identifier: validParentBlockIdentifier,
          transactions: [validTransaction],
        }),
        err: 'Timestamp 0 is before 01/01/2000',
      },
      'invalid block timestamp greater than MaxUnixEpoch': {
        block: Block.constructFromObject({
          block_identifier: validBlockIdentifier,
          parent_block_identifier: validParentBlockIdentifier,
          transactions: [validTransaction],
          timestamp: RosettaSDK.Asserter.MaxUnixEpoch + 1,
        }),
        err: 'Timestamp 2209017600001 is after 01/01/2040',
      },
      'invalid block transaction': {
        block: Block.constructFromObject({
          block_identifier: validBlockIdentifier,
          parent_block_identifier: validParentBlockIdentifier,
          timestamp: RosettaSDK.Asserter.MinUnixEpoch + 1,
          transactions: [
            new Transaction(),
          ],
        }),
        err: 'TransactionIdentifier is null',
      },      
    };

    for (let testName of Object.keys(tests)) {
      const testParams = tests[testName];

      const networkIdentifier = new NetworkIdentifier('hello', 'world');

      const genesisIndex = testParams.genesisIndex != null ? testParams.genesisIndex : 0;

      const networkStatusResponse = NetworkStatusResponse.constructFromObject({
        genesis_block_identifier: new BlockIdentifier(genesisIndex, `block ${genesisIndex}`),
        current_block_identifier: new BlockIdentifier(100, 'block 100'),
        current_block_timestamp: RosettaSDK.Asserter.MinUnixEpoch + 1,
        peers: [ new Peer('peer 1') ],
      });

      const networkOptionsResponse = NetworkOptionsResponse.constructFromObject({
        version: new Version('1.4.0', '1.0'),
        allow: new Allow([
          new OperationStatus('SUCCESS', true),
          new OperationStatus('FAILURE', false),
        ], ['PAYMENT']),
      });

      let asserter;

      try {
        asserter = RosettaSDK.Asserter.NewClientWithResponses(
          networkIdentifier,
          networkStatusResponse,
          networkOptionsResponse,
        );
      } catch (e) {
        console.error(e);
      }

      it(`should pass test case '${testName}'`, async function () {
        expect(asserter).to.not.equal(undefined);

        let thrown = false;

        try {
          asserter.Block(testParams.block);
        } catch (e) {
          // console.error(e);
          expect(e.message).to.equal(testParams.err);
          thrown = true;   
        }

        expect(thrown).to.equal(testParams.err != null);
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