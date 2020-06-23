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
 * The Error model module.
 * @module model/Error
 * @version 1.3.1
 */
var Error = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Error</code>.
   * Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object.
   * @alias module:model/Error
   * @param code {Number} Code is a network-specific error code. If desired, this code can be equivalent to an HTTP status code.
   * @param message {String} Message is a network-specific error message.
   * @param retriable {Boolean} An error is retriable if the same request may succeed if submitted again.
   */
  function Error(code, message, retriable) {
    _classCallCheck(this, Error);

    Error.initialize(this, code, message, retriable);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Error, null, [{
    key: "initialize",
    value: function initialize(obj, code, message, retriable) {
      obj['code'] = code;
      obj['message'] = message;
      obj['retriable'] = retriable;
    }
    /**
     * Constructs a <code>Error</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Error} obj Optional instance to populate.
     * @return {module:model/Error} The populated <code>Error</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Error();

        if (data.hasOwnProperty('code')) {
          obj['code'] = _ApiClient["default"].convertToType(data['code'], 'Number');
        }

        if (data.hasOwnProperty('message')) {
          obj['message'] = _ApiClient["default"].convertToType(data['message'], 'String');
        }

        if (data.hasOwnProperty('retriable')) {
          obj['retriable'] = _ApiClient["default"].convertToType(data['retriable'], 'Boolean');
        }
      }

      return obj;
    }
  }]);

  return Error;
}();
/**
 * Code is a network-specific error code. If desired, this code can be equivalent to an HTTP status code.
 * @member {Number} code
 */


Error.prototype['code'] = undefined;
/**
 * Message is a network-specific error message.
 * @member {String} message
 */

Error.prototype['message'] = undefined;
/**
 * An error is retriable if the same request may succeed if submitted again.
 * @member {Boolean} retriable
 */

Error.prototype['retriable'] = undefined;
var _default = Error;
exports["default"] = _default;