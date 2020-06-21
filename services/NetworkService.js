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
      resolve(Service.successResponse({
        metadataRequest,
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
