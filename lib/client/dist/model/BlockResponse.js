"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Block = _interopRequireDefault(require("./Block"));

var _TransactionIdentifier = _interopRequireDefault(require("./TransactionIdentifier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The BlockResponse model module.
 * @module model/BlockResponse
 * @version 1.3.1
 */
var BlockResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>BlockResponse</code>.
   * A BlockResponse includes a fully-populated block or a partially-populated block with a list of other transactions to fetch (other_transactions).
   * @alias module:model/BlockResponse
   * @param block {module:model/Block} 
   */
  function BlockResponse(block) {
    _classCallCheck(this, BlockResponse);

    BlockResponse.initialize(this, block);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(BlockResponse, null, [{
    key: "initialize",
    value: function initialize(obj, block) {
      obj['block'] = block;
    }
    /**
     * Constructs a <code>BlockResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/BlockResponse} obj Optional instance to populate.
     * @return {module:model/BlockResponse} The populated <code>BlockResponse</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new BlockResponse();

        if (data.hasOwnProperty('block')) {
          obj['block'] = _Block["default"].constructFromObject(data['block']);
        }

        if (data.hasOwnProperty('other_transactions')) {
          obj['other_transactions'] = _ApiClient["default"].convertToType(data['other_transactions'], [_TransactionIdentifier["default"]]);
        }
      }

      return obj;
    }
  }]);

  return BlockResponse;
}();
/**
 * @member {module:model/Block} block
 */


BlockResponse.prototype['block'] = undefined;
/**
 * Some blockchains may require additional transactions to be fetched that weren't returned in the block response (ex: block only returns transaction hashes). For blockchains with a lot of transactions in each block, this can be very useful as consumers can concurrently fetch all transactions returned.
 * @member {Array.<module:model/TransactionIdentifier>} other_transactions
 */

BlockResponse.prototype['other_transactions'] = undefined;
var _default = BlockResponse;
exports["default"] = _default;