"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Error = _interopRequireDefault(require("../model/Error"));

var _MempoolRequest = _interopRequireDefault(require("../model/MempoolRequest"));

var _MempoolResponse = _interopRequireDefault(require("../model/MempoolResponse"));

var _MempoolTransactionRequest = _interopRequireDefault(require("../model/MempoolTransactionRequest"));

var _MempoolTransactionResponse = _interopRequireDefault(require("../model/MempoolTransactionResponse"));

var _promisify = _interopRequireDefault(require("../promisify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
* Mempool service.
* @module api/MempoolApi
* @version 1.3.1
*/
var MempoolApi = /*#__PURE__*/function () {
  /**
  * Constructs a new MempoolApi. 
  * @alias module:api/MempoolApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function MempoolApi(apiClient) {
    _classCallCheck(this, MempoolApi);

    this.apiClient = apiClient || _ApiClient["default"].instance;
    (0, _promisify["default"])(this, ['mempool', 'mempoolTransaction']);
  }
  /**
   * Callback function to receive the result of the mempool operation.
   * @callback module:api/MempoolApi~mempoolCallback
   * @param {String} error Error message, if any.
   * @param {module:model/MempoolResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Get All Mempool Transactions
   * Get all Transaction Identifiers in the mempool
   * @param {module:model/MempoolRequest} mempoolRequest 
   * @param {module:api/MempoolApi~mempoolCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/MempoolResponse}
   */


  _createClass(MempoolApi, [{
    key: "mempool",
    value: function mempool(mempoolRequest, callback) {
      var postBody = mempoolRequest; // verify the required parameter 'mempoolRequest' is set

      if (mempoolRequest === undefined || mempoolRequest === null) {
        throw new _Error["default"]("Missing the required parameter 'mempoolRequest' when calling mempool");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = _MempoolResponse["default"];
      return this.apiClient.callApi('/mempool', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the mempoolTransaction operation.
     * @callback module:api/MempoolApi~mempoolTransactionCallback
     * @param {String} error Error message, if any.
     * @param {module:model/MempoolTransactionResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a Mempool Transaction
     * Get a transaction in the mempool by its Transaction Identifier. This is a separate request than fetching a block transaction (/block/transaction) because some blockchain nodes need to know that a transaction query is for something in the mempool instead of a transaction in a block.  Transactions may not be fully parsable until they are in a block (ex: may not be possible to determine the fee to pay before a transaction is executed). On this endpoint, it is ok that returned transactions are only estimates of what may actually be included in a block.
     * @param {module:model/MempoolTransactionRequest} mempoolTransactionRequest 
     * @param {module:api/MempoolApi~mempoolTransactionCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/MempoolTransactionResponse}
     */

  }, {
    key: "mempoolTransaction",
    value: function mempoolTransaction(mempoolTransactionRequest, callback) {
      var postBody = mempoolTransactionRequest; // verify the required parameter 'mempoolTransactionRequest' is set

      if (mempoolTransactionRequest === undefined || mempoolTransactionRequest === null) {
        throw new _Error["default"]("Missing the required parameter 'mempoolTransactionRequest' when calling mempoolTransaction");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = _MempoolTransactionResponse["default"];
      return this.apiClient.callApi('/mempool/transaction', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);

  return MempoolApi;
}();

exports["default"] = MempoolApi;