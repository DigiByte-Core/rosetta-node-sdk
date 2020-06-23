"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _TransactionIdentifier = _interopRequireDefault(require("./TransactionIdentifier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The MempoolResponse model module.
 * @module model/MempoolResponse
 * @version 1.3.1
 */
var MempoolResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>MempoolResponse</code>.
   * A MempoolResponse contains all transaction identifiers in the mempool for a particular network_identifier.
   * @alias module:model/MempoolResponse
   * @param transactionIdentifiers {Array.<module:model/TransactionIdentifier>} 
   */
  function MempoolResponse(transactionIdentifiers) {
    _classCallCheck(this, MempoolResponse);

    MempoolResponse.initialize(this, transactionIdentifiers);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(MempoolResponse, null, [{
    key: "initialize",
    value: function initialize(obj, transactionIdentifiers) {
      obj['transaction_identifiers'] = transactionIdentifiers;
    }
    /**
     * Constructs a <code>MempoolResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/MempoolResponse} obj Optional instance to populate.
     * @return {module:model/MempoolResponse} The populated <code>MempoolResponse</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new MempoolResponse();

        if (data.hasOwnProperty('transaction_identifiers')) {
          obj['transaction_identifiers'] = _ApiClient["default"].convertToType(data['transaction_identifiers'], [_TransactionIdentifier["default"]]);
        }
      }

      return obj;
    }
  }]);

  return MempoolResponse;
}();
/**
 * @member {Array.<module:model/TransactionIdentifier>} transaction_identifiers
 */


MempoolResponse.prototype['transaction_identifiers'] = undefined;
var _default = MempoolResponse;
exports["default"] = _default;