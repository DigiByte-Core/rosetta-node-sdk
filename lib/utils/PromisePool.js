/**
 * PromisePool.js
 * Author: Yoshi Jaeger
 * 
 * Adapted the code from https://github.com/rxaviers/async-pool/blob/master/lib/es7.js
 * to use an applier proxy.
 */

const defaultApplier = (promiseBodyFn, arg) => {
  const r = promiseBodyFn(arg);
  return r;
};

const arrayApplier = (promiseBodyFn, args = []) => {
  const r = promiseBodyFn(...args);
  return r;
};

async function PromisePool(poolLimit = 8, argArray, promiseBodyFn, applierFn = defaultApplier) {
  const ret = [];
  const executing = [];

  for (const item of argArray) {
    const p = Promise.resolve().then(() => applierFn(promiseBodyFn, item));
    ret.push(p);

    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);

    if (executing.length >= poolLimit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(ret);
}

module.exports = {
  create: PromisePool,
  defaultApplier: defaultApplier,
  arrayApplier: arrayApplier,
};