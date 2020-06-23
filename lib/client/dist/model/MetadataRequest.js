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
 * The MetadataRequest model module.
 * @module model/MetadataRequest
 * @version 1.3.1
 */
var MetadataRequest = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>MetadataRequest</code>.
   * A MetadataRequest is utilized in any request where the only argument is optional metadata.
   * @alias module:model/MetadataRequest
   */
  function MetadataRequest() {
    _classCallCheck(this, MetadataRequest);

    MetadataRequest.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(MetadataRequest, null, [{
    key: "initialize",
    value: function initialize(obj) {}
    /**
     * Constructs a <code>MetadataRequest</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/MetadataRequest} obj Optional instance to populate.
     * @return {module:model/MetadataRequest} The populated <code>MetadataRequest</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new MetadataRequest();

        if (data.hasOwnProperty('metadata')) {
          obj['metadata'] = _ApiClient["default"].convertToType(data['metadata'], Object);
        }
      }

      return obj;
    }
  }]);

  return MetadataRequest;
}();
/**
 * @member {Object} metadata
 */


MetadataRequest.prototype['metadata'] = undefined;
var _default = MetadataRequest;
exports["default"] = _default;