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
 * The Peer model module.
 * @module model/Peer
 * @version 1.3.1
 */
var Peer = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Peer</code>.
   * A Peer is a representation of a node&#39;s peer.
   * @alias module:model/Peer
   * @param peerId {String} 
   */
  function Peer(peerId) {
    _classCallCheck(this, Peer);

    Peer.initialize(this, peerId);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Peer, null, [{
    key: "initialize",
    value: function initialize(obj, peerId) {
      obj['peer_id'] = peerId;
    }
    /**
     * Constructs a <code>Peer</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Peer} obj Optional instance to populate.
     * @return {module:model/Peer} The populated <code>Peer</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Peer();

        if (data.hasOwnProperty('peer_id')) {
          obj['peer_id'] = _ApiClient["default"].convertToType(data['peer_id'], 'String');
        }

        if (data.hasOwnProperty('metadata')) {
          obj['metadata'] = _ApiClient["default"].convertToType(data['metadata'], Object);
        }
      }

      return obj;
    }
  }]);

  return Peer;
}();
/**
 * @member {String} peer_id
 */


Peer.prototype['peer_id'] = undefined;
/**
 * @member {Object} metadata
 */

Peer.prototype['metadata'] = undefined;
var _default = Peer;
exports["default"] = _default;