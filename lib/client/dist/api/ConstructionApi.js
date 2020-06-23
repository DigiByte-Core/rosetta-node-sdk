"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _ConstructionMetadataRequest = _interopRequireDefault(require("../model/ConstructionMetadataRequest"));

var _ConstructionMetadataResponse = _interopRequireDefault(require("../model/ConstructionMetadataResponse"));

var _ConstructionSubmitRequest = _interopRequireDefault(require("../model/ConstructionSubmitRequest"));

var _ConstructionSubmitResponse = _interopRequireDefault(require("../model/ConstructionSubmitResponse"));

var _Error = _interopRequireDefault(require("../model/Error"));

var _promisify = _interopRequireDefault(require("../promisify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
* Construction service.
* @module api/ConstructionApi
* @version 1.3.1
*/
var ConstructionApi = /*#__PURE__*/function () {
  /**
  * Constructs a new ConstructionApi. 
  * @alias module:api/ConstructionApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function ConstructionApi(apiClient) {
    _classCallCheck(this, ConstructionApi);

    this.apiClient = apiClient || _ApiClient["default"].instance;
    (0, _promisify["default"])(this, ['constructionMetadata', 'constructionSubmit']);
  }
  /**
   * Callback function to receive the result of the constructionMetadata operation.
   * @callback module:api/ConstructionApi~constructionMetadataCallback
   * @param {String} error Error message, if any.
   * @param {module:model/ConstructionMetadataResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Get Transaction Construction Metadata
   * Get any information required to construct a transaction for a specific network. Metadata returned here could be a recent hash to use, an account sequence number, or even arbitrary chain state. It is up to the client to correctly populate the options object with any network-specific details to ensure the correct metadata is retrieved.  It is important to clarify that this endpoint should not pre-construct any transactions for the client (this should happen in the SDK). This endpoint is left purposely unstructured because of the wide scope of metadata that could be required.  In a future version of the spec, we plan to pass an array of Rosetta Operations to specify which metadata should be received and to create a transaction in an accompanying SDK. This will help to insulate the client from chain-specific details that are currently required here.
   * @param {module:model/ConstructionMetadataRequest} constructionMetadataRequest 
   * @param {module:api/ConstructionApi~constructionMetadataCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/ConstructionMetadataResponse}
   */


  _createClass(ConstructionApi, [{
    key: "constructionMetadata",
    value: function constructionMetadata(constructionMetadataRequest, callback) {
      var postBody = constructionMetadataRequest; // verify the required parameter 'constructionMetadataRequest' is set

      if (constructionMetadataRequest === undefined || constructionMetadataRequest === null) {
        throw new _Error["default"]("Missing the required parameter 'constructionMetadataRequest' when calling constructionMetadata");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = _ConstructionMetadataResponse["default"];
      return this.apiClient.callApi('/construction/metadata', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the constructionSubmit operation.
     * @callback module:api/ConstructionApi~constructionSubmitCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ConstructionSubmitResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Submit a Signed Transaction
     * Submit a pre-signed transaction to the node. This call should not block on the transaction being included in a block. Rather, it should return immediately with an indication of whether or not the transaction was included in the mempool.  The transaction submission response should only return a 200 status if the submitted transaction could be included in the mempool. Otherwise, it should return an error.
     * @param {module:model/ConstructionSubmitRequest} constructionSubmitRequest 
     * @param {module:api/ConstructionApi~constructionSubmitCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ConstructionSubmitResponse}
     */

  }, {
    key: "constructionSubmit",
    value: function constructionSubmit(constructionSubmitRequest, callback) {
      var postBody = constructionSubmitRequest; // verify the required parameter 'constructionSubmitRequest' is set

      if (constructionSubmitRequest === undefined || constructionSubmitRequest === null) {
        throw new _Error["default"]("Missing the required parameter 'constructionSubmitRequest' when calling constructionSubmit");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = _ConstructionSubmitResponse["default"];
      return this.apiClient.callApi('/construction/submit', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);

  return ConstructionApi;
}();

exports["default"] = ConstructionApi;