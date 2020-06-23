/**
 * Author: Yoshi Jaeger
 * Description: Promisify OpenAPI classes
 */

export default function (object, methods = [], key = 'promises') {
  object[key] = (() => {
    if (typeof window !== 'undefined') return null;

    const util = require('util');
    return methods.reduce((a, k) => {
      a[k] = util.promisify(object[k]).bind(object);
      return a;
    }, {});
  })();
};