"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Transaction = _interopRequireDefault(require("./Transaction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The MempoolTransactionResponse model module.
 * @module model/MempoolTransactionResponse
 * @version 1.3.1
 */
var MempoolTransactionResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>MempoolTransactionResponse</code>.
   * A MempoolTransactionResponse contains an estimate of a mempool transaction. It may not be possible to know the full impact of a transaction in the mempool (ex: fee paid).
   * @alias module:model/MempoolTransactionResponse
   * @param transaction {module:model/Transaction} 
   */
  function MempoolTransactionResponse(transaction) {
    _classCallCheck(this, MempoolTransactionResponse);

    MempoolTransactionResponse.initialize(this, transaction);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(MempoolTransactionResponse, null, [{
    key: "initialize",
    value: function initialize(obj, transaction) {
      obj['transaction'] = transaction;
    }
    /**
     * Constructs a <code>MempoolTransactionResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/MempoolTransactionResponse} obj Optional instance to populate.
     * @return {module:model/MempoolTransactionResponse} The populated <code>MempoolTransactionResponse</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new MempoolTransactionResponse();

        if (data.hasOwnProperty('transaction')) {
          obj['transaction'] = _Transaction["default"].constructFromObject(data['transaction']);
        }

        if (data.hasOwnProperty('metadata')) {
          obj['metadata'] = _ApiClient["default"].convertToType(data['metadata'], Object);
        }
      }

      return obj;
    }
  }]);

  return MempoolTransactionResponse;
}();
/**
 * @member {module:model/Transaction} transaction
 */


MempoolTransactionResponse.prototype['transaction'] = undefined;
/**
 * @member {Object} metadata
 */

MempoolTransactionResponse.prototype['metadata'] = undefined;
var _default = MempoolTransactionResponse;
exports["default"] = _default;