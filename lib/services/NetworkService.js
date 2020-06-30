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

/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Get List of Available Networks
* This endpoint returns a list of NetworkIdentifiers that the Rosetta server can handle.
*
* metadataRequest MetadataRequest 
* returns NetworkListResponse
* */
const networkList = ({ metadataRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const ret = {
        'network_identifiers': [],
      };

      resolve(Service.successResponse(ret));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get Network Options
* This endpoint returns the version information and allowed network-specific types for a NetworkIdentifier. Any NetworkIdentifier returned by /network/list should be accessible here.  Because options are retrievable in the context of a NetworkIdentifier, it is possible to define unique options for each network.
*
* networkRequest NetworkRequest 
* returns NetworkOptionsResponse
* */
const networkOptions = ({ networkRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        networkRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get Network Status
* This endpoint returns the current status of the network requested. Any NetworkIdentifier returned by /network/list should be accessible here.
*
* networkRequest NetworkRequest 
* returns NetworkStatusResponse
* */
const networkStatus = ({ networkRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        networkRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  networkList,
  networkOptions,
  networkStatus,
};
