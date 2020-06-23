"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _AccountIdentifier = _interopRequireDefault(require("./AccountIdentifier"));

var _Amount = _interopRequireDefault(require("./Amount"));

var _OperationIdentifier = _interopRequireDefault(require("./OperationIdentifier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The Operation model module.
 * @module model/Operation
 * @version 1.3.1
 */
var Operation = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Operation</code>.
   * Operations contain all balance-changing information within a transaction. They are always one-sided (only affect 1 AccountIdentifier) and can succeed or fail independently from a Transaction.
   * @alias module:model/Operation
   * @param operationIdentifier {module:model/OperationIdentifier} 
   * @param type {String} The network-specific type of the operation. Ensure that any type that can be returned here is also specified in the NetowrkStatus. This can be very useful to downstream consumers that parse all block data.
   * @param status {String} The network-specific status of the operation. Status is not defined on the transaction object because blockchains with smart contracts may have transactions that partially apply.  Blockchains with atomic transactions (all operations succeed or all operations fail) will have the same status for each operation.
   */
  function Operation(operationIdentifier, type, status) {
    _classCallCheck(this, Operation);

    Operation.initialize(this, operationIdentifier, type, status);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Operation, null, [{
    key: "initialize",
    value: function initialize(obj, operationIdentifier, type, status) {
      obj['operation_identifier'] = operationIdentifier;
      obj['type'] = type;
      obj['status'] = status;
    }
    /**
     * Constructs a <code>Operation</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Operation} obj Optional instance to populate.
     * @return {module:model/Operation} The populated <code>Operation</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Operation();

        if (data.hasOwnProperty('operation_identifier')) {
          obj['operation_identifier'] = _OperationIdentifier["default"].constructFromObject(data['operation_identifier']);
        }

        if (data.hasOwnProperty('related_operations')) {
          obj['related_operations'] = _ApiClient["default"].convertToType(data['related_operations'], [_OperationIdentifier["default"]]);
        }

        if (data.hasOwnProperty('type')) {
          obj['type'] = _ApiClient["default"].convertToType(data['type'], 'String');
        }

        if (data.hasOwnProperty('status')) {
          obj['status'] = _ApiClient["default"].convertToType(data['status'], 'String');
        }

        if (data.hasOwnProperty('account')) {
          obj['account'] = _AccountIdentifier["default"].constructFromObject(data['account']);
        }

        if (data.hasOwnProperty('amount')) {
          obj['amount'] = _Amount["default"].constructFromObject(data['amount']);
        }

        if (data.hasOwnProperty('metadata')) {
          obj['metadata'] = _ApiClient["default"].convertToType(data['metadata'], Object);
        }
      }

      return obj;
    }
  }]);

  return Operation;
}();
/**
 * @member {module:model/OperationIdentifier} operation_identifier
 */


Operation.prototype['operation_identifier'] = undefined;
/**
 * Restrict referenced related_operations to identifier indexes < the current operation_identifier.index. This ensures there exists a clear DAG-structure of relations.  Since operations are one-sided, one could imagine relating operations in a single transfer or linking operations in a call tree.
 * @member {Array.<module:model/OperationIdentifier>} related_operations
 */

Operation.prototype['related_operations'] = undefined;
/**
 * The network-specific type of the operation. Ensure that any type that can be returned here is also specified in the NetowrkStatus. This can be very useful to downstream consumers that parse all block data.
 * @member {String} type
 */

Operation.prototype['type'] = undefined;
/**
 * The network-specific status of the operation. Status is not defined on the transaction object because blockchains with smart contracts may have transactions that partially apply.  Blockchains with atomic transactions (all operations succeed or all operations fail) will have the same status for each operation.
 * @member {String} status
 */

Operation.prototype['status'] = undefined;
/**
 * @member {module:model/AccountIdentifier} account
 */

Operation.prototype['account'] = undefined;
/**
 * @member {module:model/Amount} amount
 */

Operation.prototype['amount'] = undefined;
/**
 * @member {Object} metadata
 */

Operation.prototype['metadata'] = undefined;
var _default = Operation;
exports["default"] = _default;