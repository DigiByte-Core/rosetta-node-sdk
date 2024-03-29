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
 * The MempoolController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

/**
 * @module MempoolController
 */
const Controller = require('./Controller');

/**
 * Handle mempool
 * @param {Rosetta:MempoolRequest} request - is the input to mempool endpoint
 * @param {Rosetta:MempoolResponse} response - callback function to receive the result of the mempool operation
 * @return {Promise<void>}
 */
const mempool = async (request, response) => {
  await Controller.handleRequest(request, response);
};

/**
 * Handle mempool transaction
 * @param {Rosetta:MempoolTransactionRequest} request - is the input to retrieve a transaction from the mempool
 * @param {Rosetta:MempoolTransactionResponse} response - callback function to receive the result of the mempoolTransaction operation
 * @return {Promise<void>}
 */
const mempoolTransaction = async (request, response) => {
  await Controller.handleRequest(request, response);
};

module.exports = {
  mempool,
  mempoolTransaction,
};
