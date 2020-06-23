"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Error = _interopRequireDefault(require("./Error"));

var _OperationStatus = _interopRequireDefault(require("./OperationStatus"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The Allow model module.
 * @module model/Allow
 * @version 1.3.1
 */
var Allow = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Allow</code>.
   * Allow specifies supported Operation status, Operation types, and all possible error statuses. This Allow object is used by clients to validate the correctness of a Rosetta Server implementation. It is expected that these clients will error if they receive some response that contains any of the above information that is not specified here.
   * @alias module:model/Allow
   * @param operationStatuses {Array.<module:model/OperationStatus>} All Operation.Status this implementation supports. Any status that is returned during parsing that is not listed here will cause client validation to error.
   * @param operationTypes {Array.<String>} All Operation.Type this implementation supports. Any type that is returned during parsing that is not listed here will cause client validation to error.
   * @param errors {Array.<module:model/Error>} All Errors that this implementation could return. Any error that is returned during parsing that is not listed here will cause client validation to error.
   */
  function Allow(operationStatuses, operationTypes, errors) {
    _classCallCheck(this, Allow);

    Allow.initialize(this, operationStatuses, operationTypes, errors);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Allow, null, [{
    key: "initialize",
    value: function initialize(obj, operationStatuses, operationTypes, errors) {
      obj['operation_statuses'] = operationStatuses;
      obj['operation_types'] = operationTypes;
      obj['errors'] = errors;
    }
    /**
     * Constructs a <code>Allow</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Allow} obj Optional instance to populate.
     * @return {module:model/Allow} The populated <code>Allow</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Allow();

        if (data.hasOwnProperty('operation_statuses')) {
          obj['operation_statuses'] = _ApiClient["default"].convertToType(data['operation_statuses'], [_OperationStatus["default"]]);
        }

        if (data.hasOwnProperty('operation_types')) {
          obj['operation_types'] = _ApiClient["default"].convertToType(data['operation_types'], ['String']);
        }

        if (data.hasOwnProperty('errors')) {
          obj['errors'] = _ApiClient["default"].convertToType(data['errors'], [_Error["default"]]);
        }
      }

      return obj;
    }
  }]);

  return Allow;
}();
/**
 * All Operation.Status this implementation supports. Any status that is returned during parsing that is not listed here will cause client validation to error.
 * @member {Array.<module:model/OperationStatus>} operation_statuses
 */


Allow.prototype['operation_statuses'] = undefined;
/**
 * All Operation.Type this implementation supports. Any type that is returned during parsing that is not listed here will cause client validation to error.
 * @member {Array.<String>} operation_types
 */

Allow.prototype['operation_types'] = undefined;
/**
 * All Errors that this implementation could return. Any error that is returned during parsing that is not listed here will cause client validation to error.
 * @member {Array.<module:model/Error>} errors
 */

Allow.prototype['errors'] = undefined;
var _default = Allow;
exports["default"] = _default;