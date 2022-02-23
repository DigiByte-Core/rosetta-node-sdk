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
 * The NetworkController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 * @module NetworkController
 */

const Controller = require('./Controller');

/**
 * Handle network list.
 * @param {Rosetta:MetadataRequest} request - is the input request where the only argument is optional metadata
 * @param {Rosetta:NetworkListResponse} response - callback function to receive the result of the networkList operation
 * @return {Promise<void>}
 */
const networkList = async (request, response) => {
  await Controller.handleRequest(request, response);
};

/**
 * Handle network options.
 * @param {Rosetta:NetworkRequest} request - is the input to retrieve some data specific exclusively to a NetworkIdentifier
 * @param {Rosetta:NetworkOptionsResponse} response - callback function to receive the result of the networkOptions operation
 * @return {Promise<void>}
 */
const networkOptions = async (request, response) => {
  await Controller.handleRequest(request, response);
};

/**
 * Handle network status.
 * @param {Rosetta:NetworkRequest} request - is the input to retrieve some data specific exclusively to a NetworkIdentifier
 * @param {Rosetta:NetworkStatusResponse} response - callback function to receive the result of the networkStatus operation
 * @return {Promise<void>}
 */
const networkStatus = async (request, response) => {
  await Controller.handleRequest(request, response);
};

module.exports = {
  networkList,
  networkOptions,
  networkStatus,
};
