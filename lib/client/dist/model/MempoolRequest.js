"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _NetworkIdentifier = _interopRequireDefault(require("./NetworkIdentifier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The MempoolRequest model module.
 * @module model/MempoolRequest
 * @version 1.3.1
 */
var MempoolRequest = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>MempoolRequest</code>.
   * A MempoolRequest is utilized to retrieve all transaction identifiers in the mempool for a particular network_identifier.
   * @alias module:model/MempoolRequest
   * @param networkIdentifier {module:model/NetworkIdentifier} 
   */
  function MempoolRequest(networkIdentifier) {
    _classCallCheck(this, MempoolRequest);

    MempoolRequest.initialize(this, networkIdentifier);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(MempoolRequest, null, [{
    key: "initialize",
    value: function initialize(obj, networkIdentifier) {
      obj['network_identifier'] = networkIdentifier;
    }
    /**
     * Constructs a <code>MempoolRequest</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/MempoolRequest} obj Optional instance to populate.
     * @return {module:model/MempoolRequest} The populated <code>MempoolRequest</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new MempoolRequest();

        if (data.hasOwnProperty('network_identifier')) {
          obj['network_identifier'] = _NetworkIdentifier["default"].constructFromObject(data['network_identifier']);
        }
      }

      return obj;
    }
  }]);

  return MempoolRequest;
}();
/**
 * @member {module:model/NetworkIdentifier} network_identifier
 */


MempoolRequest.prototype['network_identifier'] = undefined;
var _default = MempoolRequest;
exports["default"] = _default;