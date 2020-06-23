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
 * The ConstructionMetadataRequest model module.
 * @module model/ConstructionMetadataRequest
 * @version 1.3.1
 */
var ConstructionMetadataRequest = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ConstructionMetadataRequest</code>.
   * A ConstructionMetadataRequest is utilized to get information required to construct a transaction. The Options object used to specify which metadata to return is left purposely unstructured to allow flexibility for implementers.
   * @alias module:model/ConstructionMetadataRequest
   * @param networkIdentifier {module:model/NetworkIdentifier} 
   * @param options {Object} Some blockchains require different metadata for different types of transaction construction (ex: delegation versus a transfer). Instead of requiring a blockchain node to return all possible types of metadata for construction (which may require multiple node fetches), the client can populate an options object to limit the metadata returned to only the subset required.
   */
  function ConstructionMetadataRequest(networkIdentifier, options) {
    _classCallCheck(this, ConstructionMetadataRequest);

    ConstructionMetadataRequest.initialize(this, networkIdentifier, options);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(ConstructionMetadataRequest, null, [{
    key: "initialize",
    value: function initialize(obj, networkIdentifier, options) {
      obj['network_identifier'] = networkIdentifier;
      obj['options'] = options;
    }
    /**
     * Constructs a <code>ConstructionMetadataRequest</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ConstructionMetadataRequest} obj Optional instance to populate.
     * @return {module:model/ConstructionMetadataRequest} The populated <code>ConstructionMetadataRequest</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ConstructionMetadataRequest();

        if (data.hasOwnProperty('network_identifier')) {
          obj['network_identifier'] = _NetworkIdentifier["default"].constructFromObject(data['network_identifier']);
        }

        if (data.hasOwnProperty('options')) {
          obj['options'] = _ApiClient["default"].convertToType(data['options'], Object);
        }
      }

      return obj;
    }
  }]);

  return ConstructionMetadataRequest;
}();
/**
 * @member {module:model/NetworkIdentifier} network_identifier
 */


ConstructionMetadataRequest.prototype['network_identifier'] = undefined;
/**
 * Some blockchains require different metadata for different types of transaction construction (ex: delegation versus a transfer). Instead of requiring a blockchain node to return all possible types of metadata for construction (which may require multiple node fetches), the client can populate an options object to limit the metadata returned to only the subset required.
 * @member {Object} options
 */

ConstructionMetadataRequest.prototype['options'] = undefined;
var _default = ConstructionMetadataRequest;
exports["default"] = _default;