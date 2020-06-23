"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Currency = _interopRequireDefault(require("./Currency"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The Amount model module.
 * @module model/Amount
 * @version 1.3.1
 */
var Amount = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Amount</code>.
   * Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency.
   * @alias module:model/Amount
   * @param value {String} Value of the transaction in atomic units represented as an arbitrary-sized signed integer.  For example, 1 BTC would be represented by a value of 100000000.
   * @param currency {module:model/Currency} 
   */
  function Amount(value, currency) {
    _classCallCheck(this, Amount);

    Amount.initialize(this, value, currency);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Amount, null, [{
    key: "initialize",
    value: function initialize(obj, value, currency) {
      obj['value'] = value;
      obj['currency'] = currency;
    }
    /**
     * Constructs a <code>Amount</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Amount} obj Optional instance to populate.
     * @return {module:model/Amount} The populated <code>Amount</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Amount();

        if (data.hasOwnProperty('value')) {
          obj['value'] = _ApiClient["default"].convertToType(data['value'], 'String');
        }

        if (data.hasOwnProperty('currency')) {
          obj['currency'] = _Currency["default"].constructFromObject(data['currency']);
        }

        if (data.hasOwnProperty('metadata')) {
          obj['metadata'] = _ApiClient["default"].convertToType(data['metadata'], Object);
        }
      }

      return obj;
    }
  }]);

  return Amount;
}();
/**
 * Value of the transaction in atomic units represented as an arbitrary-sized signed integer.  For example, 1 BTC would be represented by a value of 100000000.
 * @member {String} value
 */


Amount.prototype['value'] = undefined;
/**
 * @member {module:model/Currency} currency
 */

Amount.prototype['currency'] = undefined;
/**
 * @member {Object} metadata
 */

Amount.prototype['metadata'] = undefined;
var _default = Amount;
exports["default"] = _default;