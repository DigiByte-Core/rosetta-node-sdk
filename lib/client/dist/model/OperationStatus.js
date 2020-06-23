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
 * The OperationStatus model module.
 * @module model/OperationStatus
 * @version 1.3.1
 */
var OperationStatus = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>OperationStatus</code>.
   * OperationStatus is utilized to indicate which Operation status are considered successful.
   * @alias module:model/OperationStatus
   * @param status {String} The status is the network-specific status of the operation.
   * @param successful {Boolean} An Operation is considered successful if the Operation.Amount should affect the Operation.Account. Some blockchains (like Bitcoin) only include successful operations in blocks but other blockchains (like Ethereum) include unsuccessful operations that incur a fee.  To reconcile the computed balance from the stream of Operations, it is critical to understand which Operation.Status indicate an Operation is successful and should affect an Account.
   */
  function OperationStatus(status, successful) {
    _classCallCheck(this, OperationStatus);

    OperationStatus.initialize(this, status, successful);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(OperationStatus, null, [{
    key: "initialize",
    value: function initialize(obj, status, successful) {
      obj['status'] = status;
      obj['successful'] = successful;
    }
    /**
     * Constructs a <code>OperationStatus</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/OperationStatus} obj Optional instance to populate.
     * @return {module:model/OperationStatus} The populated <code>OperationStatus</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new OperationStatus();

        if (data.hasOwnProperty('status')) {
          obj['status'] = _ApiClient["default"].convertToType(data['status'], 'String');
        }

        if (data.hasOwnProperty('successful')) {
          obj['successful'] = _ApiClient["default"].convertToType(data['successful'], 'Boolean');
        }
      }

      return obj;
    }
  }]);

  return OperationStatus;
}();
/**
 * The status is the network-specific status of the operation.
 * @member {String} status
 */


OperationStatus.prototype['status'] = undefined;
/**
 * An Operation is considered successful if the Operation.Amount should affect the Operation.Account. Some blockchains (like Bitcoin) only include successful operations in blocks but other blockchains (like Ethereum) include unsuccessful operations that incur a fee.  To reconcile the computed balance from the stream of Operations, it is critical to understand which Operation.Status indicate an Operation is successful and should affect an Account.
 * @member {Boolean} successful
 */

OperationStatus.prototype['successful'] = undefined;
var _default = OperationStatus;
exports["default"] = _default;