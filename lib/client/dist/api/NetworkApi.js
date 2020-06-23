"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Error = _interopRequireDefault(require("../model/Error"));

var _MetadataRequest = _interopRequireDefault(require("../model/MetadataRequest"));

var _NetworkListResponse = _interopRequireDefault(require("../model/NetworkListResponse"));

var _NetworkOptionsResponse = _interopRequireDefault(require("../model/NetworkOptionsResponse"));

var _NetworkRequest = _interopRequireDefault(require("../model/NetworkRequest"));

var _NetworkStatusResponse = _interopRequireDefault(require("../model/NetworkStatusResponse"));

var _promisify = _interopRequireDefault(require("../promisify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
* Network service.
* @module api/NetworkApi
* @version 1.3.1
*/
var NetworkApi = /*#__PURE__*/function () {
  /**
  * Constructs a new NetworkApi. 
  * @alias module:api/NetworkApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function NetworkApi(apiClient) {
    _classCallCheck(this, NetworkApi);

    this.apiClient = apiClient || _ApiClient["default"].instance;
    (0, _promisify["default"])(this, ['networkList', 'networkOptions', 'networkStatus']);
  }
  /**
   * Callback function to receive the result of the networkList operation.
   * @callback module:api/NetworkApi~networkListCallback
   * @param {String} error Error message, if any.
   * @param {module:model/NetworkListResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Get List of Available Networks
   * This endpoint returns a list of NetworkIdentifiers that the Rosetta server can handle.
   * @param {module:model/MetadataRequest} metadataRequest 
   * @param {module:api/NetworkApi~networkListCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/NetworkListResponse}
   */


  _createClass(NetworkApi, [{
    key: "networkList",
    value: function networkList(metadataRequest, callback) {
      var postBody = metadataRequest; // verify the required parameter 'metadataRequest' is set

      if (metadataRequest === undefined || metadataRequest === null) {
        throw new _Error["default"]("Missing the required parameter 'metadataRequest' when calling networkList");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = _NetworkListResponse["default"];
      return this.apiClient.callApi('/network/list', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the networkOptions operation.
     * @callback module:api/NetworkApi~networkOptionsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/NetworkOptionsResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get Network Options
     * This endpoint returns the version information and allowed network-specific types for a NetworkIdentifier. Any NetworkIdentifier returned by /network/list should be accessible here.  Because options are retrievable in the context of a NetworkIdentifier, it is possible to define unique options for each network.
     * @param {module:model/NetworkRequest} networkRequest 
     * @param {module:api/NetworkApi~networkOptionsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/NetworkOptionsResponse}
     */

  }, {
    key: "networkOptions",
    value: function networkOptions(networkRequest, callback) {
      var postBody = networkRequest; // verify the required parameter 'networkRequest' is set

      if (networkRequest === undefined || networkRequest === null) {
        throw new _Error["default"]("Missing the required parameter 'networkRequest' when calling networkOptions");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = _NetworkOptionsResponse["default"];
      return this.apiClient.callApi('/network/options', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
    /**
     * Callback function to receive the result of the networkStatus operation.
     * @callback module:api/NetworkApi~networkStatusCallback
     * @param {String} error Error message, if any.
     * @param {module:model/NetworkStatusResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get Network Status
     * This endpoint returns the current status of the network requested. Any NetworkIdentifier returned by /network/list should be accessible here.
     * @param {module:model/NetworkRequest} networkRequest 
     * @param {module:api/NetworkApi~networkStatusCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/NetworkStatusResponse}
     */

  }, {
    key: "networkStatus",
    value: function networkStatus(networkRequest, callback) {
      var postBody = networkRequest; // verify the required parameter 'networkRequest' is set

      if (networkRequest === undefined || networkRequest === null) {
        throw new _Error["default"]("Missing the required parameter 'networkRequest' when calling networkStatus");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = _NetworkStatusResponse["default"];
      return this.apiClient.callApi('/network/status', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);

  return NetworkApi;
}();

exports["default"] = NetworkApi;