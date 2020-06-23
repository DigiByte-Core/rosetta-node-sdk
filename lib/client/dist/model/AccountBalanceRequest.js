"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _AccountIdentifier = _interopRequireDefault(require("./AccountIdentifier"));

var _NetworkIdentifier = _interopRequireDefault(require("./NetworkIdentifier"));

var _PartialBlockIdentifier = _interopRequireDefault(require("./PartialBlockIdentifier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The AccountBalanceRequest model module.
 * @module model/AccountBalanceRequest
 * @version 1.3.1
 */
var AccountBalanceRequest = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>AccountBalanceRequest</code>.
   * An AccountBalanceRequest is utilized to make a balance request on the /account/balance endpoint. If the block_identifier is populated, a historical balance query should be performed.
   * @alias module:model/AccountBalanceRequest
   * @param networkIdentifier {module:model/NetworkIdentifier} 
   * @param accountIdentifier {module:model/AccountIdentifier} 
   */
  function AccountBalanceRequest(networkIdentifier, accountIdentifier) {
    _classCallCheck(this, AccountBalanceRequest);

    AccountBalanceRequest.initialize(this, networkIdentifier, accountIdentifier);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(AccountBalanceRequest, null, [{
    key: "initialize",
    value: function initialize(obj, networkIdentifier, accountIdentifier) {
      obj['network_identifier'] = networkIdentifier;
      obj['account_identifier'] = accountIdentifier;
    }
    /**
     * Constructs a <code>AccountBalanceRequest</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/AccountBalanceRequest} obj Optional instance to populate.
     * @return {module:model/AccountBalanceRequest} The populated <code>AccountBalanceRequest</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new AccountBalanceRequest();

        if (data.hasOwnProperty('network_identifier')) {
          obj['network_identifier'] = _NetworkIdentifier["default"].constructFromObject(data['network_identifier']);
        }

        if (data.hasOwnProperty('account_identifier')) {
          obj['account_identifier'] = _AccountIdentifier["default"].constructFromObject(data['account_identifier']);
        }

        if (data.hasOwnProperty('block_identifier')) {
          obj['block_identifier'] = _PartialBlockIdentifier["default"].constructFromObject(data['block_identifier']);
        }
      }

      return obj;
    }
  }]);

  return AccountBalanceRequest;
}();
/**
 * @member {module:model/NetworkIdentifier} network_identifier
 */


AccountBalanceRequest.prototype['network_identifier'] = undefined;
/**
 * @member {module:model/AccountIdentifier} account_identifier
 */

AccountBalanceRequest.prototype['account_identifier'] = undefined;
/**
 * @member {module:model/PartialBlockIdentifier} block_identifier
 */

AccountBalanceRequest.prototype['block_identifier'] = undefined;
var _default = AccountBalanceRequest;
exports["default"] = _default;