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
 * The SubAccountIdentifier model module.
 * @module model/SubAccountIdentifier
 * @version 1.3.1
 */
var SubAccountIdentifier = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>SubAccountIdentifier</code>.
   * An account may have state specific to a contract address (ERC-20 token) and/or a stake (delegated balance). The sub_account_identifier should specify which state (if applicable) an account instantiation refers to.
   * @alias module:model/SubAccountIdentifier
   * @param address {String} The SubAccount address may be a cryptographic value or some other identifier (ex: bonded) that uniquely specifies a SubAccount.
   */
  function SubAccountIdentifier(address) {
    _classCallCheck(this, SubAccountIdentifier);

    SubAccountIdentifier.initialize(this, address);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(SubAccountIdentifier, null, [{
    key: "initialize",
    value: function initialize(obj, address) {
      obj['address'] = address;
    }
    /**
     * Constructs a <code>SubAccountIdentifier</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SubAccountIdentifier} obj Optional instance to populate.
     * @return {module:model/SubAccountIdentifier} The populated <code>SubAccountIdentifier</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new SubAccountIdentifier();

        if (data.hasOwnProperty('address')) {
          obj['address'] = _ApiClient["default"].convertToType(data['address'], 'String');
        }

        if (data.hasOwnProperty('metadata')) {
          obj['metadata'] = _ApiClient["default"].convertToType(data['metadata'], Object);
        }
      }

      return obj;
    }
  }]);

  return SubAccountIdentifier;
}();
/**
 * The SubAccount address may be a cryptographic value or some other identifier (ex: bonded) that uniquely specifies a SubAccount.
 * @member {String} address
 */


SubAccountIdentifier.prototype['address'] = undefined;
/**
 * If the SubAccount address is not sufficient to uniquely specify a SubAccount, any other identifying information can be stored here.  It is important to note that two SubAccounts with identical addresses but differing metadata will not be considered equal by clients.
 * @member {Object} metadata
 */

SubAccountIdentifier.prototype['metadata'] = undefined;
var _default = SubAccountIdentifier;
exports["default"] = _default;