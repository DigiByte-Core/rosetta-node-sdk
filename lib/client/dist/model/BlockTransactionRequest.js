"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _BlockIdentifier = _interopRequireDefault(require("./BlockIdentifier"));

var _NetworkIdentifier = _interopRequireDefault(require("./NetworkIdentifier"));

var _TransactionIdentifier = _interopRequireDefault(require("./TransactionIdentifier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The BlockTransactionRequest model module.
 * @module model/BlockTransactionRequest
 * @version 1.3.1
 */
var BlockTransactionRequest = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>BlockTransactionRequest</code>.
   * A BlockTransactionRequest is used to fetch a Transaction included in a block that is not returned in a BlockResponse.
   * @alias module:model/BlockTransactionRequest
   * @param networkIdentifier {module:model/NetworkIdentifier} 
   * @param blockIdentifier {module:model/BlockIdentifier} 
   * @param transactionIdentifier {module:model/TransactionIdentifier} 
   */
  function BlockTransactionRequest(networkIdentifier, blockIdentifier, transactionIdentifier) {
    _classCallCheck(this, BlockTransactionRequest);

    BlockTransactionRequest.initialize(this, networkIdentifier, blockIdentifier, transactionIdentifier);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(BlockTransactionRequest, null, [{
    key: "initialize",
    value: function initialize(obj, networkIdentifier, blockIdentifier, transactionIdentifier) {
      obj['network_identifier'] = networkIdentifier;
      obj['block_identifier'] = blockIdentifier;
      obj['transaction_identifier'] = transactionIdentifier;
    }
    /**
     * Constructs a <code>BlockTransactionRequest</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/BlockTransactionRequest} obj Optional instance to populate.
     * @return {module:model/BlockTransactionRequest} The populated <code>BlockTransactionRequest</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new BlockTransactionRequest();

        if (data.hasOwnProperty('network_identifier')) {
          obj['network_identifier'] = _NetworkIdentifier["default"].constructFromObject(data['network_identifier']);
        }

        if (data.hasOwnProperty('block_identifier')) {
          obj['block_identifier'] = _BlockIdentifier["default"].constructFromObject(data['block_identifier']);
        }

        if (data.hasOwnProperty('transaction_identifier')) {
          obj['transaction_identifier'] = _TransactionIdentifier["default"].constructFromObject(data['transaction_identifier']);
        }
      }

      return obj;
    }
  }]);

  return BlockTransactionRequest;
}();
/**
 * @member {module:model/NetworkIdentifier} network_identifier
 */


BlockTransactionRequest.prototype['network_identifier'] = undefined;
/**
 * @member {module:model/BlockIdentifier} block_identifier
 */

BlockTransactionRequest.prototype['block_identifier'] = undefined;
/**
 * @member {module:model/TransactionIdentifier} transaction_identifier
 */

BlockTransactionRequest.prototype['transaction_identifier'] = undefined;
var _default = BlockTransactionRequest;
exports["default"] = _default;