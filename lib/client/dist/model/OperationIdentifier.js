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
 * The OperationIdentifier model module.
 * @module model/OperationIdentifier
 * @version 1.3.1
 */
var OperationIdentifier = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>OperationIdentifier</code>.
   * The operation_identifier uniquely identifies an operation within a transaction.
   * @alias module:model/OperationIdentifier
   * @param index {Number} The operation index is used to ensure each operation has a unique identifier within a transaction.  To clarify, there may not be any notion of an operation index in the blockchain being described.
   */
  function OperationIdentifier(index) {
    _classCallCheck(this, OperationIdentifier);

    OperationIdentifier.initialize(this, index);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(OperationIdentifier, null, [{
    key: "initialize",
    value: function initialize(obj, index) {
      obj['index'] = index;
    }
    /**
     * Constructs a <code>OperationIdentifier</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/OperationIdentifier} obj Optional instance to populate.
     * @return {module:model/OperationIdentifier} The populated <code>OperationIdentifier</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new OperationIdentifier();

        if (data.hasOwnProperty('index')) {
          obj['index'] = _ApiClient["default"].convertToType(data['index'], 'Number');
        }

        if (data.hasOwnProperty('network_index')) {
          obj['network_index'] = _ApiClient["default"].convertToType(data['network_index'], 'Number');
        }
      }

      return obj;
    }
  }]);

  return OperationIdentifier;
}();
/**
 * The operation index is used to ensure each operation has a unique identifier within a transaction.  To clarify, there may not be any notion of an operation index in the blockchain being described.
 * @member {Number} index
 */


OperationIdentifier.prototype['index'] = undefined;
/**
 * Some blockchains specify an operation index that is essential for client use. For example, Bitcoin uses a network_index to identify which UTXO was used in a transaction.  network_index should not be populated if there is no notion of an operation index in a blockchain (typically most account-based blockchains).
 * @member {Number} network_index
 */

OperationIdentifier.prototype['network_index'] = undefined;
var _default = OperationIdentifier;
exports["default"] = _default;