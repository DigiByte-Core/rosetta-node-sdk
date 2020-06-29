/**
 * Author: Yoshi Jaeger
 * Description: Promisify OpenAPI classes
 */

 // obsolete

export default function (object, methods = [], key = 'promises') {
  object[key] = (() => {
    if (typeof window !== 'undefined') return null;

    const altered = methods.reduce((a, k) => {
      /*
       * @param {String} error Error message, if any.
       * @param {Model} data The data returned by the service call.
       * @param {String} response The complete HTTP response.      
       */
      a[k] = (req) => {
        console.log(123);
        return new Promise((fulfill, reject) => {
          // Call original function with the provided argument and a callback.
          console.log('REQ', req);
          object[k](req, (err, model, res) => {
            if (err) {
              return reject(err);
            }

            fulfill(model);
          });
        });
      };

      a[k].bind(object);

      return a;
    }, {});

    return altered;
  })();
};