"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _SubNetworkIdentifier = _interopRequireDefault(require("./SubNetworkIdentifier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The NetworkIdentifier model module.
 * @module model/NetworkIdentifier
 * @version 1.3.1
 */
var NetworkIdentifier = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>NetworkIdentifier</code>.
   * The network_identifier specifies which network a particular object is associated with.
   * @alias module:model/NetworkIdentifier
   * @param blockchain {String} 
   * @param network {String} If a blockchain has a specific chain-id or network identifier, it should go in this field. It is up to the client to determine which network-specific identifier is mainnet or testnet.
   */
  function NetworkIdentifier(blockchain, network) {
    _classCallCheck(this, NetworkIdentifier);

    NetworkIdentifier.initialize(this, blockchain, network);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(NetworkIdentifier, null, [{
    key: "initialize",
    value: function initialize(obj, blockchain, network) {
      obj['blockchain'] = blockchain;
      obj['network'] = network;
    }
    /**
     * Constructs a <code>NetworkIdentifier</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/NetworkIdentifier} obj Optional instance to populate.
     * @return {module:model/NetworkIdentifier} The populated <code>NetworkIdentifier</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new NetworkIdentifier();

        if (data.hasOwnProperty('blockchain')) {
          obj['blockchain'] = _ApiClient["default"].convertToType(data['blockchain'], 'String');
        }

        if (data.hasOwnProperty('network')) {
          obj['network'] = _ApiClient["default"].convertToType(data['network'], 'String');
        }

        if (data.hasOwnProperty('sub_network_identifier')) {
          obj['sub_network_identifier'] = _SubNetworkIdentifier["default"].constructFromObject(data['sub_network_identifier']);
        }
      }

      return obj;
    }
  }]);

  return NetworkIdentifier;
}();
/**
 * @member {String} blockchain
 */


NetworkIdentifier.prototype['blockchain'] = undefined;
/**
 * If a blockchain has a specific chain-id or network identifier, it should go in this field. It is up to the client to determine which network-specific identifier is mainnet or testnet.
 * @member {String} network
 */

NetworkIdentifier.prototype['network'] = undefined;
/**
 * @member {module:model/SubNetworkIdentifier} sub_network_identifier
 */

NetworkIdentifier.prototype['sub_network_identifier'] = undefined;
var _default = NetworkIdentifier;
exports["default"] = _default;