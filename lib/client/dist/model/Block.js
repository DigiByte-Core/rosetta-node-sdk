"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _BlockIdentifier = _interopRequireDefault(require("./BlockIdentifier"));

var _Transaction = _interopRequireDefault(require("./Transaction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The Block model module.
 * @module model/Block
 * @version 1.3.1
 */
var Block = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Block</code>.
   * Blocks contain an array of Transactions that occurred at a particular BlockIdentifier.
   * @alias module:model/Block
   * @param blockIdentifier {module:model/BlockIdentifier} 
   * @param parentBlockIdentifier {module:model/BlockIdentifier} 
   * @param timestamp {Number} The timestamp of the block in milliseconds since the Unix Epoch. The timestamp is stored in milliseconds because some blockchains produce blocks more often than once a second.
   * @param transactions {Array.<module:model/Transaction>} 
   */
  function Block(blockIdentifier, parentBlockIdentifier, timestamp, transactions) {
    _classCallCheck(this, Block);

    Block.initialize(this, blockIdentifier, parentBlockIdentifier, timestamp, transactions);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Block, null, [{
    key: "initialize",
    value: function initialize(obj, blockIdentifier, parentBlockIdentifier, timestamp, transactions) {
      obj['block_identifier'] = blockIdentifier;
      obj['parent_block_identifier'] = parentBlockIdentifier;
      obj['timestamp'] = timestamp;
      obj['transactions'] = transactions;
    }
    /**
     * Constructs a <code>Block</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Block} obj Optional instance to populate.
     * @return {module:model/Block} The populated <code>Block</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Block();

        if (data.hasOwnProperty('block_identifier')) {
          obj['block_identifier'] = _BlockIdentifier["default"].constructFromObject(data['block_identifier']);
        }

        if (data.hasOwnProperty('parent_block_identifier')) {
          obj['parent_block_identifier'] = _BlockIdentifier["default"].constructFromObject(data['parent_block_identifier']);
        }

        if (data.hasOwnProperty('timestamp')) {
          obj['timestamp'] = _ApiClient["default"].convertToType(data['timestamp'], 'Number');
        }

        if (data.hasOwnProperty('transactions')) {
          obj['transactions'] = _ApiClient["default"].convertToType(data['transactions'], [_Transaction["default"]]);
        }

        if (data.hasOwnProperty('metadata')) {
          obj['metadata'] = _ApiClient["default"].convertToType(data['metadata'], Object);
        }
      }

      return obj;
    }
  }]);

  return Block;
}();
/**
 * @member {module:model/BlockIdentifier} block_identifier
 */


Block.prototype['block_identifier'] = undefined;
/**
 * @member {module:model/BlockIdentifier} parent_block_identifier
 */

Block.prototype['parent_block_identifier'] = undefined;
/**
 * The timestamp of the block in milliseconds since the Unix Epoch. The timestamp is stored in milliseconds because some blockchains produce blocks more often than once a second.
 * @member {Number} timestamp
 */

Block.prototype['timestamp'] = undefined;
/**
 * @member {Array.<module:model/Transaction>} transactions
 */

Block.prototype['transactions'] = undefined;
/**
 * @member {Object} metadata
 */

Block.prototype['metadata'] = undefined;
var _default = Block;
exports["default"] = _default;