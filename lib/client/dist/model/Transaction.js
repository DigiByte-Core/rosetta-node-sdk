"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Operation = _interopRequireDefault(require("./Operation"));

var _TransactionIdentifier = _interopRequireDefault(require("./TransactionIdentifier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The Transaction model module.
 * @module model/Transaction
 * @version 1.3.1
 */
var Transaction = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Transaction</code>.
   * Transactions contain an array of Operations that are attributable to the same TransactionIdentifier.
   * @alias module:model/Transaction
   * @param transactionIdentifier {module:model/TransactionIdentifier} 
   * @param operations {Array.<module:model/Operation>} 
   */
  function Transaction(transactionIdentifier, operations) {
    _classCallCheck(this, Transaction);

    Transaction.initialize(this, transactionIdentifier, operations);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Transaction, null, [{
    key: "initialize",
    value: function initialize(obj, transactionIdentifier, operations) {
      obj['transaction_identifier'] = transactionIdentifier;
      obj['operations'] = operations;
    }
    /**
     * Constructs a <code>Transaction</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Transaction} obj Optional instance to populate.
     * @return {module:model/Transaction} The populated <code>Transaction</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Transaction();

        if (data.hasOwnProperty('transaction_identifier')) {
          obj['transaction_identifier'] = _TransactionIdentifier["default"].constructFromObject(data['transaction_identifier']);
        }

        if (data.hasOwnProperty('operations')) {
          obj['operations'] = _ApiClient["default"].convertToType(data['operations'], [_Operation["default"]]);
        }

        if (data.hasOwnProperty('metadata')) {
          obj['metadata'] = _ApiClient["default"].convertToType(data['metadata'], Object);
        }
      }

      return obj;
    }
  }]);

  return Transaction;
}();
/**
 * @member {module:model/TransactionIdentifier} transaction_identifier
 */


Transaction.prototype['transaction_identifier'] = undefined;
/**
 * @member {Array.<module:model/Operation>} operations
 */

Transaction.prototype['operations'] = undefined;
/**
 * Transactions that are related to other transactions (like a cross-shard transactioin) should include the tranaction_identifier of these transactions in the metadata.
 * @member {Object} metadata
 */

Transaction.prototype['metadata'] = undefined;
var _default = Transaction;
exports["default"] = _default;