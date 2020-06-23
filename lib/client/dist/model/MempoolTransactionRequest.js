"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _NetworkIdentifier = _interopRequireDefault(require("./NetworkIdentifier"));

var _TransactionIdentifier = _interopRequireDefault(require("./TransactionIdentifier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The MempoolTransactionRequest model module.
 * @module model/MempoolTransactionRequest
 * @version 1.3.1
 */
var MempoolTransactionRequest = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>MempoolTransactionRequest</code>.
   * A MempoolTransactionRequest is utilized to retrieve a transaction from the mempool.
   * @alias module:model/MempoolTransactionRequest
   * @param networkIdentifier {module:model/NetworkIdentifier} 
   * @param transactionIdentifier {module:model/TransactionIdentifier} 
   */
  function MempoolTransactionRequest(networkIdentifier, transactionIdentifier) {
    _classCallCheck(this, MempoolTransactionRequest);

    MempoolTransactionRequest.initialize(this, networkIdentifier, transactionIdentifier);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(MempoolTransactionRequest, null, [{
    key: "initialize",
    value: function initialize(obj, networkIdentifier, transactionIdentifier) {
      obj['network_identifier'] = networkIdentifier;
      obj['transaction_identifier'] = transactionIdentifier;
    }
    /**
     * Constructs a <code>MempoolTransactionRequest</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/MempoolTransactionRequest} obj Optional instance to populate.
     * @return {module:model/MempoolTransactionRequest} The populated <code>MempoolTransactionRequest</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new MempoolTransactionRequest();

        if (data.hasOwnProperty('network_identifier')) {
          obj['network_identifier'] = _NetworkIdentifier["default"].constructFromObject(data['network_identifier']);
        }

        if (data.hasOwnProperty('transaction_identifier')) {
          obj['transaction_identifier'] = _TransactionIdentifier["default"].constructFromObject(data['transaction_identifier']);
        }
      }

      return obj;
    }
  }]);

  return MempoolTransactionRequest;
}();
/**
 * @member {module:model/NetworkIdentifier} network_identifier
 */


MempoolTransactionRequest.prototype['network_identifier'] = undefined;
/**
 * @member {module:model/TransactionIdentifier} transaction_identifier
 */

MempoolTransactionRequest.prototype['transaction_identifier'] = undefined;
var _default = MempoolTransactionRequest;
exports["default"] = _default;