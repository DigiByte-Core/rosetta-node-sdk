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
 * The TransactionIdentifier model module.
 * @module model/TransactionIdentifier
 * @version 1.3.1
 */
var TransactionIdentifier = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>TransactionIdentifier</code>.
   * The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool.
   * @alias module:model/TransactionIdentifier
   * @param hash {String} Any transactions that are attributable only to a block (ex: a block event) should use the hash of the block as the identifier.
   */
  function TransactionIdentifier(hash) {
    _classCallCheck(this, TransactionIdentifier);

    TransactionIdentifier.initialize(this, hash);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(TransactionIdentifier, null, [{
    key: "initialize",
    value: function initialize(obj, hash) {
      obj['hash'] = hash;
    }
    /**
     * Constructs a <code>TransactionIdentifier</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/TransactionIdentifier} obj Optional instance to populate.
     * @return {module:model/TransactionIdentifier} The populated <code>TransactionIdentifier</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new TransactionIdentifier();

        if (data.hasOwnProperty('hash')) {
          obj['hash'] = _ApiClient["default"].convertToType(data['hash'], 'String');
        }
      }

      return obj;
    }
  }]);

  return TransactionIdentifier;
}();
/**
 * Any transactions that are attributable only to a block (ex: a block event) should use the hash of the block as the identifier.
 * @member {String} hash
 */


TransactionIdentifier.prototype['hash'] = undefined;
var _default = TransactionIdentifier;
exports["default"] = _default;