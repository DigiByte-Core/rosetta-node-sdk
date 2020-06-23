"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _BlockRequest = _interopRequireDefault(require("../model/BlockRequest"));

var _BlockResponse = _interopRequireDefault(require("../model/BlockResponse"));

var _BlockTransactionRequest = _interopRequireDefault(require("../model/BlockTransactionRequest"));

var _BlockTransactionResponse = _interopRequireDefault(require("../model/BlockTransactionResponse"));

var _Error = _interopRequireDefault(require("../model/Error"));

var _promisify = _interopRequireDefault(require("../promisify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
* Block service.
* @module api/BlockApi
* @version 1.3.1
*/
var BlockApi = /*#__PURE__*/function () {
  /**
  * Constructs a new BlockApi. 
  * @alias module:api/BlockApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function BlockApi(apiClient) {
    _classCallCheck(this, BlockApi);

    this.apiClient = apiClient || _ApiClient["default"].instance;
    (0, _promisify["default"])(this, ['block', 'blockTransaction']);
  }
  /**
   * Callback function to receive the result of the block operation.
   * @callback module:api/BlockApi~blockCallback
   * @param {String} error Error message, if any.
   * @param {module:model/BlockResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Get a Block
   * Get a block by its Block Identifier. If transactions are returned in the same call to the node as fetching the block, the response should include these transactions in the Block object. If not, an array of Transaction Identifiers should be returned so /block/transaction fetches can be done to get all transaction information.
   * @param {module:model/BlockRequest} blockRequest 
   * @param {module:api/BlockApi~blockCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/BlockResponse}
   */


  _createClass(BlockApi, [{
    key: "block",
    value: function block(blockRequest, callback) {
      var postBody = blockRequest; // verify the required parameter 'blockRequest' is set

      if (blockRequest === undefined || blockRequest === null) {
        throw new _Error["default"]("Missing the required parameter 'blockRequest' when calling block");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = _BlockResponse["default"];
      return this.apiClient.callApi('/block', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the blockTransaction operation.
     * @callback module:api/BlockApi~blockTransactionCallback
     * @param {String} error Error message, if any.
     * @param {module:model/BlockTransactionResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a Block Transaction
     * Get a transaction in a block by its Transaction Identifier. This endpoint should only be used when querying a node for a block does not return all transactions contained within it.  All transactions returned by this endpoint must be appended to any transactions returned by the /block method by consumers of this data. Fetching a transaction by hash is considered an Explorer Method (which is classified under the Future Work section).  Calling this endpoint requires reference to a BlockIdentifier because transaction parsing can change depending on which block contains the transaction. For example, in Bitcoin it is necessary to know which block contains a transaction to determine the destination of fee payments. Without specifying a block identifier, the node would have to infer which block to use (which could change during a re-org).  Implementations that require fetching previous transactions to populate the response (ex: Previous UTXOs in Bitcoin) may find it useful to run a cache within the Rosetta server in the /data directory (on a path that does not conflict with the node).
     * @param {module:model/BlockTransactionRequest} blockTransactionRequest 
     * @param {module:api/BlockApi~blockTransactionCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/BlockTransactionResponse}
     */

  }, {
    key: "blockTransaction",
    value: function blockTransaction(blockTransactionRequest, callback) {
      var postBody = blockTransactionRequest; // verify the required parameter 'blockTransactionRequest' is set

      if (blockTransactionRequest === undefined || blockTransactionRequest === null) {
        throw new _Error["default"]("Missing the required parameter 'blockTransactionRequest' when calling blockTransaction");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = _BlockTransactionResponse["default"];
      return this.apiClient.callApi('/block/transaction', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);

  return BlockApi;
}();

exports["default"] = BlockApi;