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
 * The Version model module.
 * @module model/Version
 * @version 1.3.1
 */
var Version = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>Version</code>.
   * The Version object is utilized to inform the client of the versions of different components of the Rosetta implementation.
   * @alias module:model/Version
   * @param rosettaVersion {String} The rosetta_version is the version of the Rosetta interface the implementation adheres to. This can be useful for clients looking to reliably parse responses.
   * @param nodeVersion {String} The node_version is the canonical version of the node runtime. This can help clients manage deployments.
   */
  function Version(rosettaVersion, nodeVersion) {
    _classCallCheck(this, Version);

    Version.initialize(this, rosettaVersion, nodeVersion);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(Version, null, [{
    key: "initialize",
    value: function initialize(obj, rosettaVersion, nodeVersion) {
      obj['rosetta_version'] = rosettaVersion;
      obj['node_version'] = nodeVersion;
    }
    /**
     * Constructs a <code>Version</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Version} obj Optional instance to populate.
     * @return {module:model/Version} The populated <code>Version</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Version();

        if (data.hasOwnProperty('rosetta_version')) {
          obj['rosetta_version'] = _ApiClient["default"].convertToType(data['rosetta_version'], 'String');
        }

        if (data.hasOwnProperty('node_version')) {
          obj['node_version'] = _ApiClient["default"].convertToType(data['node_version'], 'String');
        }

        if (data.hasOwnProperty('middleware_version')) {
          obj['middleware_version'] = _ApiClient["default"].convertToType(data['middleware_version'], 'String');
        }

        if (data.hasOwnProperty('metadata')) {
          obj['metadata'] = _ApiClient["default"].convertToType(data['metadata'], Object);
        }
      }

      return obj;
    }
  }]);

  return Version;
}();
/**
 * The rosetta_version is the version of the Rosetta interface the implementation adheres to. This can be useful for clients looking to reliably parse responses.
 * @member {String} rosetta_version
 */


Version.prototype['rosetta_version'] = undefined;
/**
 * The node_version is the canonical version of the node runtime. This can help clients manage deployments.
 * @member {String} node_version
 */

Version.prototype['node_version'] = undefined;
/**
 * When a middleware server is used to adhere to the Rosetta interface, it should return its version here. This can help clients manage deployments.
 * @member {String} middleware_version
 */

Version.prototype['middleware_version'] = undefined;
/**
 * Any other information that may be useful about versioning of dependent services should be returned here.
 * @member {Object} metadata
 */

Version.prototype['metadata'] = undefined;
var _default = Version;
exports["default"] = _default;