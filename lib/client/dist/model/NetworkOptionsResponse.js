"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Allow = _interopRequireDefault(require("./Allow"));

var _Version = _interopRequireDefault(require("./Version"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The NetworkOptionsResponse model module.
 * @module model/NetworkOptionsResponse
 * @version 1.3.1
 */
var NetworkOptionsResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>NetworkOptionsResponse</code>.
   * NetworkOptionsResponse contains information about the versioning of the node and the allowed operation statuses, operation types, and errors.
   * @alias module:model/NetworkOptionsResponse
   * @param version {module:model/Version} 
   * @param allow {module:model/Allow} 
   */
  function NetworkOptionsResponse(version, allow) {
    _classCallCheck(this, NetworkOptionsResponse);

    NetworkOptionsResponse.initialize(this, version, allow);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(NetworkOptionsResponse, null, [{
    key: "initialize",
    value: function initialize(obj, version, allow) {
      obj['version'] = version;
      obj['allow'] = allow;
    }
    /**
     * Constructs a <code>NetworkOptionsResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/NetworkOptionsResponse} obj Optional instance to populate.
     * @return {module:model/NetworkOptionsResponse} The populated <code>NetworkOptionsResponse</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new NetworkOptionsResponse();

        if (data.hasOwnProperty('version')) {
          obj['version'] = _Version["default"].constructFromObject(data['version']);
        }

        if (data.hasOwnProperty('allow')) {
          obj['allow'] = _Allow["default"].constructFromObject(data['allow']);
        }
      }

      return obj;
    }
  }]);

  return NetworkOptionsResponse;
}();
/**
 * @member {module:model/Version} version
 */


NetworkOptionsResponse.prototype['version'] = undefined;
/**
 * @member {module:model/Allow} allow
 */

NetworkOptionsResponse.prototype['allow'] = undefined;
var _default = NetworkOptionsResponse;
exports["default"] = _default;