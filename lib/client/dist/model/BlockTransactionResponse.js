"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Transaction = _interopRequireDefault(require("./Transaction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The BlockTransactionResponse model module.
 * @module model/BlockTransactionResponse
 * @version 1.3.1
 */
var BlockTransactionResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>BlockTransactionResponse</code>.
   * A BlockTransactionResponse contains information about a block transaction.
   * @alias module:model/BlockTransactionResponse
   * @param transaction {module:model/Transaction} 
   */
  function BlockTransactionResponse(transaction) {
    _classCallCheck(this, BlockTransactionResponse);

    BlockTransactionResponse.initialize(this, transaction);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(BlockTransactionResponse, null, [{
    key: "initialize",
    value: function initialize(obj, transaction) {
      obj['transaction'] = transaction;
    }
    /**
     * Constructs a <code>BlockTransactionResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/BlockTransactionResponse} obj Optional instance to populate.
     * @return {module:model/BlockTransactionResponse} The populated <code>BlockTransactionResponse</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new BlockTransactionResponse();

        if (data.hasOwnProperty('transaction')) {
          obj['transaction'] = _Transaction["default"].constructFromObject(data['transaction']);
        }
      }

      return obj;
    }
  }]);

  return BlockTransactionResponse;
}();
/**
 * @member {module:model/Transaction} transaction
 */


BlockTransactionResponse.prototype['transaction'] = undefined;
var _default = BlockTransactionResponse;
exports["default"] = _default;