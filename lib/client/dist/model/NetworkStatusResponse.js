"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _BlockIdentifier = _interopRequireDefault(require("./BlockIdentifier"));

var _Peer = _interopRequireDefault(require("./Peer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The NetworkStatusResponse model module.
 * @module model/NetworkStatusResponse
 * @version 1.3.1
 */
var NetworkStatusResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>NetworkStatusResponse</code>.
   * NetworkStatusResponse contains basic information about the node&#39;s view of a blockchain network.
   * @alias module:model/NetworkStatusResponse
   * @param currentBlockIdentifier {module:model/BlockIdentifier} 
   * @param currentBlockTimestamp {Number} The timestamp of the block in milliseconds since the Unix Epoch. The timestamp is stored in milliseconds because some blockchains produce blocks more often than once a second.
   * @param genesisBlockIdentifier {module:model/BlockIdentifier} 
   * @param peers {Array.<module:model/Peer>} 
   */
  function NetworkStatusResponse(currentBlockIdentifier, currentBlockTimestamp, genesisBlockIdentifier, peers) {
    _classCallCheck(this, NetworkStatusResponse);

    NetworkStatusResponse.initialize(this, currentBlockIdentifier, currentBlockTimestamp, genesisBlockIdentifier, peers);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(NetworkStatusResponse, null, [{
    key: "initialize",
    value: function initialize(obj, currentBlockIdentifier, currentBlockTimestamp, genesisBlockIdentifier, peers) {
      obj['current_block_identifier'] = currentBlockIdentifier;
      obj['current_block_timestamp'] = currentBlockTimestamp;
      obj['genesis_block_identifier'] = genesisBlockIdentifier;
      obj['peers'] = peers;
    }
    /**
     * Constructs a <code>NetworkStatusResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/NetworkStatusResponse} obj Optional instance to populate.
     * @return {module:model/NetworkStatusResponse} The populated <code>NetworkStatusResponse</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new NetworkStatusResponse();

        if (data.hasOwnProperty('current_block_identifier')) {
          obj['current_block_identifier'] = _BlockIdentifier["default"].constructFromObject(data['current_block_identifier']);
        }

        if (data.hasOwnProperty('current_block_timestamp')) {
          obj['current_block_timestamp'] = _ApiClient["default"].convertToType(data['current_block_timestamp'], 'Number');
        }

        if (data.hasOwnProperty('genesis_block_identifier')) {
          obj['genesis_block_identifier'] = _BlockIdentifier["default"].constructFromObject(data['genesis_block_identifier']);
        }

        if (data.hasOwnProperty('peers')) {
          obj['peers'] = _ApiClient["default"].convertToType(data['peers'], [_Peer["default"]]);
        }
      }

      return obj;
    }
  }]);

  return NetworkStatusResponse;
}();
/**
 * @member {module:model/BlockIdentifier} current_block_identifier
 */


NetworkStatusResponse.prototype['current_block_identifier'] = undefined;
/**
 * The timestamp of the block in milliseconds since the Unix Epoch. The timestamp is stored in milliseconds because some blockchains produce blocks more often than once a second.
 * @member {Number} current_block_timestamp
 */

NetworkStatusResponse.prototype['current_block_timestamp'] = undefined;
/**
 * @member {module:model/BlockIdentifier} genesis_block_identifier
 */

NetworkStatusResponse.prototype['genesis_block_identifier'] = undefined;
/**
 * @member {Array.<module:model/Peer>} peers
 */

NetworkStatusResponse.prototype['peers'] = undefined;
var _default = NetworkStatusResponse;
exports["default"] = _default;