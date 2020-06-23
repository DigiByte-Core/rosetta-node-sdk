"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The SubNetworkIdentifier model module.
 * @module model/SubNetworkIdentifier
 * @version 1.3.1
 */
var SubNetworkIdentifier = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>SubNetworkIdentifier</code>.
   * In blockchains with sharded state, the SubNetworkIdentifier is required to query some object on a specific shard. This identifier is optional for all non-sharded blockchains.
   * @alias module:model/SubNetworkIdentifier
   * @param network {String} 
   */
  function SubNetworkIdentifier(network) {
    _classCallCheck(this, SubNetworkIdentifier);

    SubNetworkIdentifier.initialize(this, network);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(SubNetworkIdentifier, null, [{
    key: "initialize",
    value: function initialize(obj, network) {
      obj['network'] = network;
    }
    /**
     * Constructs a <code>SubNetworkIdentifier</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SubNetworkIdentifier} obj Optional instance to populate.
     * @return {module:model/SubNetworkIdentifier} The populated <code>SubNetworkIdentifier</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new SubNetworkIdentifier();

        if (data.hasOwnProperty('network')) {
          obj['network'] = _ApiClient["default"].convertToType(data['network'], 'String');
        }

        if (data.hasOwnProperty('metadata')) {
          obj['metadata'] = _ApiClient["default"].convertToType(data['metadata'], Object);
        }
      }

      return obj;
    }
  }]);

  return SubNetworkIdentifier;
}();
/**
 * @member {String} network
 */


SubNetworkIdentifier.prototype['network'] = undefined;
/**
 * @member {Object} metadata
 */

SubNetworkIdentifier.prototype['metadata'] = undefined;
var _default = SubNetworkIdentifier;
exports["default"] = _default;