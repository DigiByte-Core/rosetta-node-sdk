"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _NetworkIdentifier = _interopRequireDefault(require("./NetworkIdentifier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The NetworkListResponse model module.
 * @module model/NetworkListResponse
 * @version 1.3.1
 */
var NetworkListResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>NetworkListResponse</code>.
   * A NetworkListResponse contains all NetworkIdentifiers that the node can serve information for.
   * @alias module:model/NetworkListResponse
   * @param networkIdentifiers {Array.<module:model/NetworkIdentifier>} 
   */
  function NetworkListResponse(networkIdentifiers) {
    _classCallCheck(this, NetworkListResponse);

    NetworkListResponse.initialize(this, networkIdentifiers);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(NetworkListResponse, null, [{
    key: "initialize",
    value: function initialize(obj, networkIdentifiers) {
      obj['network_identifiers'] = networkIdentifiers;
    }
    /**
     * Constructs a <code>NetworkListResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/NetworkListResponse} obj Optional instance to populate.
     * @return {module:model/NetworkListResponse} The populated <code>NetworkListResponse</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new NetworkListResponse();

        if (data.hasOwnProperty('network_identifiers')) {
          obj['network_identifiers'] = _ApiClient["default"].convertToType(data['network_identifiers'], [_NetworkIdentifier["default"]]);
        }
      }

      return obj;
    }
  }]);

  return NetworkListResponse;
}();
/**
 * @member {Array.<module:model/NetworkIdentifier>} network_identifiers
 */


NetworkListResponse.prototype['network_identifiers'] = undefined;
var _default = NetworkListResponse;
exports["default"] = _default;