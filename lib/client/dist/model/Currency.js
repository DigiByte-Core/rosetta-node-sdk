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
 * The Currency model module.
 * @module model/Currency
 * @version 1.3.1
 */
var Currency = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Currency</code>.
   * Currency is composed of a canonical Symbol and Decimals. This Decimals value is used to convert an Amount.Value from atomic units (Satoshis) to standard units (Bitcoins).
   * @alias module:model/Currency
   * @param symbol {String} Canonical symbol associated with a currency.
   * @param decimals {Number} Number of decimal places in the standard unit representation of the amount.  For example, BTC has 8 decimals. Note that it is not possible to represent the value of some currency in atomic units that is not base 10.
   */
  function Currency(symbol, decimals) {
    _classCallCheck(this, Currency);

    Currency.initialize(this, symbol, decimals);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Currency, null, [{
    key: "initialize",
    value: function initialize(obj, symbol, decimals) {
      obj['symbol'] = symbol;
      obj['decimals'] = decimals;
    }
    /**
     * Constructs a <code>Currency</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Currency} obj Optional instance to populate.
     * @return {module:model/Currency} The populated <code>Currency</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Currency();

        if (data.hasOwnProperty('symbol')) {
          obj['symbol'] = _ApiClient["default"].convertToType(data['symbol'], 'String');
        }

        if (data.hasOwnProperty('decimals')) {
          obj['decimals'] = _ApiClient["default"].convertToType(data['decimals'], 'Number');
        }

        if (data.hasOwnProperty('metadata')) {
          obj['metadata'] = _ApiClient["default"].convertToType(data['metadata'], Object);
        }
      }

      return obj;
    }
  }]);

  return Currency;
}();
/**
 * Canonical symbol associated with a currency.
 * @member {String} symbol
 */


Currency.prototype['symbol'] = undefined;
/**
 * Number of decimal places in the standard unit representation of the amount.  For example, BTC has 8 decimals. Note that it is not possible to represent the value of some currency in atomic units that is not base 10.
 * @member {Number} decimals
 */

Currency.prototype['decimals'] = undefined;
/**
 * Any additional information related to the currency itself.  For example, it would be useful to populate this object with the contract address of an ERC-20 token.
 * @member {Object} metadata
 */

Currency.prototype['metadata'] = undefined;
var _default = Currency;
exports["default"] = _default;