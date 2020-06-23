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
 * The PartialBlockIdentifier model module.
 * @module model/PartialBlockIdentifier
 * @version 1.3.1
 */
var PartialBlockIdentifier = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>PartialBlockIdentifier</code>.
   * When fetching data by BlockIdentifier, it may be possible to only specify the index or hash. If neither property is specified, it is assumed that the client is making a request at the current block.
   * @alias module:model/PartialBlockIdentifier
   */
  function PartialBlockIdentifier() {
    _classCallCheck(this, PartialBlockIdentifier);

    PartialBlockIdentifier.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */


  _createClass(PartialBlockIdentifier, null, [{
    key: "initialize",
    value: function initialize(obj) {}
    /**
     * Constructs a <code>PartialBlockIdentifier</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/PartialBlockIdentifier} obj Optional instance to populate.
     * @return {module:model/PartialBlockIdentifier} The populated <code>PartialBlockIdentifier</code> instance.
     */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PartialBlockIdentifier();

        if (data.hasOwnProperty('index')) {
          obj['index'] = _ApiClient["default"].convertToType(data['index'], 'Number');
        }

        if (data.hasOwnProperty('hash')) {
          obj['hash'] = _ApiClient["default"].convertToType(data['hash'], 'String');
        }
      }

      return obj;
    }
  }]);

  return PartialBlockIdentifier;
}();
/**
 * @member {Number} index
 */


PartialBlockIdentifier.prototype['index'] = undefined;
/**
 * @member {String} hash
 */

PartialBlockIdentifier.prototype['hash'] = undefined;
var _default = PartialBlockIdentifier;
exports["default"] = _default;