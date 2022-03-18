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
 * The ConstructionController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 * @module ConstructionController
 */

const Controller = require('./Controller');

/**
 * Construction combine.
 * @param {Rosetta:ConstructionCombineRequest} request - is the input to the combine endpoint
 * @param {Rosetta:ConstructionCombineResponse} response - is returned by combine endpoint
 * @return {Promise<void>}
 */
const constructionCombine = async (request, response) => {
  await Controller.handleRequest(request, response);
};

/**
 * Construction derive.
 * @param {Rosetta:ConstructionDeriveRequest} request - is the input to derive endpoint
 * @param {Rosetta:ConstructionDeriveResponse} response - is returned by derive endpoint
 * @return {Promise<void>}
 */
const constructionDerive = async (request, response) => {
  await Controller.handleRequest(request, response);
};

/**
 * Construction hash.
 * @param {Rosetta:ConstructionHashRequest} request - is the input to hash endpoint
 * @param {Rosetta:TransactionIdentifierResponse} response - callback function to receive the result of the constructionHash operation
 * @return {Promise<void>}
 */
const constructionHash = async (request, response) => {
  await Controller.handleRequest(request, response);
};

/**
 * Construction metadata.
 * @param {Rosetta:ConstructionMetadataRequest} request - utilized to get information required to construct a transaction
 * @param {Rosetta:ConstructionMetadataResponse} response - callback function to receive network-specific metadata used for transaction construction
 * @return {Promise<void>}
 */
const constructionMetadata = async (request, response) => {
  await Controller.handleRequest(request, response);
};

/**
 * Construction parse.
 * Parse is called on both unsigned and signed transactions to understand the intent of the formulated transaction.
 * @param {Rosetta:ConstructionParseRequest} request - is the input to parse endpoint
 * @param {Rosetta:ConstructionParseResponse} response - callback function to receive an array of operations that occur in a transaction blob
 * @return {Promise<void>}
 */
const constructionParse = async (request, response) => {
  await Controller.handleRequest(request, response);
};

/**
 * Construction payloads.
 * @param {Rosetta:ConstructionPayloadsRequest} request - is the input to payloads endpoint
 * @param {Rosetta:ConstructionPayloadsResponse} response - callback function to receive the result of payloads operation
 * @return {Promise<void>}
 */
const constructionPayloads = async (request, response) => {
  await Controller.handleRequest(request, response);
};

/**
 * Construction preprocess.
 * @param {Rosetta:ConstructionPreprocessRequest} request - is the input to preprocess endpoint
 * @param {Rosetta:ConstructionPreprocessResponse} response - callback function with request that will be sent directly to metadata operation
 * @return {Promise<void>}
 */
const constructionPreprocess = async (request, response) => {
  await Controller.handleRequest(request, response);
};

/**
 * Construction submit.
 * @param {Rosetta:ConstructionSubmitRequest} request - the transaction submission request includes a signed transaction
 * @param {Rosetta:TransactionIdentifierResponse} response - callback function to receive the result of the constructionSubmit operation
 * @return {Promise<void>}
 */
const constructionSubmit = async (request, response) => {
  await Controller.handleRequest(request, response);
};

module.exports = {
  constructionCombine,
  constructionDerive,
  constructionHash,
  constructionMetadata,
  constructionParse,
  constructionPayloads,
  constructionPreprocess,
  constructionSubmit,
};
