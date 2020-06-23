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
 * The BlockIdentifier model module.
 * @module model/BlockIdentifier
 * @version 1.3.1
 */
var BlockIdentifier = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>BlockIdentifier</code>.
   * The block_identifier uniquely identifies a block in a particular network.
   * @alias module:model/BlockIdentifier
   * @param index {Number} This is also known as the block height.
   * @param hash {String} 
   */
  function BlockIdentifier(index, hash) {
    _classCallCheck(this, BlockIdentifier);

    BlockIdentifier.initialize(this, index, hash);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(BlockIdentifier, null, [{
    key: "initialize",
    value: function initialize(obj, index, hash) {
      obj['index'] = index;
      obj['hash'] = hash;
    }
    /**
     * Constructs a <code>BlockIdentifier</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/BlockIdentifier} obj Optional instance to populate.
     * @return {module:model/BlockIdentifier} The populated <code>BlockIdentifier</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new BlockIdentifier();

        if (data.hasOwnProperty('index')) {
          obj['index'] = _ApiClient["default"].convertToType(data['index'], 'Number');
        }

        if (data.hasOwnProperty('hash')) {
          obj['hash'] = _ApiClient["default"].convertToType(data['hash'], 'String');
        }
      }

      return obj;
    }
  }]);

  return BlockIdentifier;
}();
/**
 * This is also known as the block height.
 * @member {Number} index
 */


BlockIdentifier.prototype['index'] = undefined;
/**
 * @member {String} hash
 */

BlockIdentifier.prototype['hash'] = undefined;
var _default = BlockIdentifier;
exports["default"] = _default;