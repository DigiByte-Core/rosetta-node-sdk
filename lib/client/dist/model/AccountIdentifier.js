"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _SubAccountIdentifier = _interopRequireDefault(require("./SubAccountIdentifier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The AccountIdentifier model module.
 * @module model/AccountIdentifier
 * @version 1.3.1
 */
var AccountIdentifier = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>AccountIdentifier</code>.
   * The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated).
   * @alias module:model/AccountIdentifier
   * @param address {String} The address may be a cryptographic public key (or some encoding of it) or a provided username.
   */
  function AccountIdentifier(address) {
    _classCallCheck(this, AccountIdentifier);

    AccountIdentifier.initialize(this, address);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(AccountIdentifier, null, [{
    key: "initialize",
    value: function initialize(obj, address) {
      obj['address'] = address;
    }
    /**
     * Constructs a <code>AccountIdentifier</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/AccountIdentifier} obj Optional instance to populate.
     * @return {module:model/AccountIdentifier} The populated <code>AccountIdentifier</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new AccountIdentifier();

        if (data.hasOwnProperty('address')) {
          obj['address'] = _ApiClient["default"].convertToType(data['address'], 'String');
        }

        if (data.hasOwnProperty('sub_account')) {
          obj['sub_account'] = _SubAccountIdentifier["default"].constructFromObject(data['sub_account']);
        }

        if (data.hasOwnProperty('metadata')) {
          obj['metadata'] = _ApiClient["default"].convertToType(data['metadata'], Object);
        }
      }

      return obj;
    }
  }]);

  return AccountIdentifier;
}();
/**
 * The address may be a cryptographic public key (or some encoding of it) or a provided username.
 * @member {String} address
 */


AccountIdentifier.prototype['address'] = undefined;
/**
 * @member {module:model/SubAccountIdentifier} sub_account
 */

AccountIdentifier.prototype['sub_account'] = undefined;
/**
 * Blockchains that utilize a username model (where the address is not a derivative of a cryptographic public key) should specify the public key(s) owned by the address in metadata.
 * @member {Object} metadata
 */

AccountIdentifier.prototype['metadata'] = undefined;
var _default = AccountIdentifier;
exports["default"] = _default;