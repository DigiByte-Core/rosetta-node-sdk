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
 * The ConstructionSubmitResponse model module.
 * @module model/ConstructionSubmitResponse
 * @version 1.3.1
 */
var ConstructionSubmitResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ConstructionSubmitResponse</code>.
   * A TransactionSubmitResponse contains the transaction_identifier of a submitted transaction that was accepted into the mempool.
   * @alias module:model/ConstructionSubmitResponse
   * @param transactionIdentifier {module:model/TransactionIdentifier} 
   */
  function ConstructionSubmitResponse(transactionIdentifier) {
    _classCallCheck(this, ConstructionSubmitResponse);

    ConstructionSubmitResponse.initialize(this, transactionIdentifier);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(ConstructionSubmitResponse, null, [{
    key: "initialize",
    value: function initialize(obj, transactionIdentifier) {
      obj['transaction_identifier'] = transactionIdentifier;
    }
    /**
     * Constructs a <code>ConstructionSubmitResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ConstructionSubmitResponse} obj Optional instance to populate.
     * @return {module:model/ConstructionSubmitResponse} The populated <code>ConstructionSubmitResponse</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ConstructionSubmitResponse();

        if (data.hasOwnProperty('transaction_identifier')) {
          obj['transaction_identifier'] = _TransactionIdentifier["default"].constructFromObject(data['transaction_identifier']);
        }

        if (data.hasOwnProperty('metadata')) {
          obj['metadata'] = _ApiClient["default"].convertToType(data['metadata'], Object);
        }
      }

      return obj;
    }
  }]);

  return ConstructionSubmitResponse;
}();
/**
 * @member {module:model/TransactionIdentifier} transaction_identifier
 */


ConstructionSubmitResponse.prototype['transaction_identifier'] = undefined;
/**
 * @member {Object} metadata
 */

ConstructionSubmitResponse.prototype['metadata'] = undefined;
var _default = ConstructionSubmitResponse;
exports["default"] = _default;