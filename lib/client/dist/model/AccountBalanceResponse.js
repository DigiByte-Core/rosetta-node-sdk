"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Amount = _interopRequireDefault(require("./Amount"));

var _BlockIdentifier = _interopRequireDefault(require("./BlockIdentifier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The AccountBalanceResponse model module.
 * @module model/AccountBalanceResponse
 * @version 1.3.1
 */
var AccountBalanceResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>AccountBalanceResponse</code>.
   * An AccountBalanceResponse is returned on the /account/balance endpoint. If an account has a balance for each AccountIdentifier describing it (ex: an ERC-20 token balance on a few smart contracts), an account balance request must be made with each AccountIdentifier.
   * @alias module:model/AccountBalanceResponse
   * @param blockIdentifier {module:model/BlockIdentifier} 
   * @param balances {Array.<module:model/Amount>} A single account may have a balance in multiple currencies.
   */
  function AccountBalanceResponse(blockIdentifier, balances) {
    _classCallCheck(this, AccountBalanceResponse);

    AccountBalanceResponse.initialize(this, blockIdentifier, balances);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(AccountBalanceResponse, null, [{
    key: "initialize",
    value: function initialize(obj, blockIdentifier, balances) {
      obj['block_identifier'] = blockIdentifier;
      obj['balances'] = balances;
    }
    /**
     * Constructs a <code>AccountBalanceResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/AccountBalanceResponse} obj Optional instance to populate.
     * @return {module:model/AccountBalanceResponse} The populated <code>AccountBalanceResponse</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new AccountBalanceResponse();

        if (data.hasOwnProperty('block_identifier')) {
          obj['block_identifier'] = _BlockIdentifier["default"].constructFromObject(data['block_identifier']);
        }

        if (data.hasOwnProperty('balances')) {
          obj['balances'] = _ApiClient["default"].convertToType(data['balances'], [_Amount["default"]]);
        }

        if (data.hasOwnProperty('metadata')) {
          obj['metadata'] = _ApiClient["default"].convertToType(data['metadata'], Object);
        }
      }

      return obj;
    }
  }]);

  return AccountBalanceResponse;
}();
/**
 * @member {module:model/BlockIdentifier} block_identifier
 */


AccountBalanceResponse.prototype['block_identifier'] = undefined;
/**
 * A single account may have a balance in multiple currencies.
 * @member {Array.<module:model/Amount>} balances
 */

AccountBalanceResponse.prototype['balances'] = undefined;
/**
 * Account-based blockchains that utilize a nonce or sequence number should include that number in the metadata. This number could be unique to the identifier or global across the account address.
 * @member {Object} metadata
 */

AccountBalanceResponse.prototype['metadata'] = undefined;
var _default = AccountBalanceResponse;
exports["default"] = _default;