/**
 * @license
 * Copyright (c) 2020 DigiByte Foundation NZ Limited
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @module Utils
 */

const RosettaClient = require('rosetta-node-sdk-client');
const { InputError } = require('../errors');

/**
 * AddValues adds string amounts using
 *
 * @param {string} a - first value
 * @param {string} b - second value
 * @return {string} - string amounts using
 * @throws {AsserterError} thrown if SupportedNetworks not an array
 */
function AddValues(a, b) {
  const parsedA = parseInt(a);
  const parsedB = parseInt(b);

  if (isNaN(parsedA)) {
    throw new InputError('Value A is NaN');
  }

  if (isNaN(parsedB)) {
    throw new InputError('Value B is NaN');
  }

  return `${parsedA + parsedB}`;
}

/**
 * SubtractValues subtracts a-b using
 *
 * @param {string} a - first value
 * @param {string} b - second value
 * @return {string} - subtract of a-b
 * @throws {AsserterError} thrown if SupportedNetworks not an array
 */
function SubtractValues(a, b) {
  const parsedA = parseInt(a);
  const parsedB = parseInt(b);

  if (isNaN(parsedA)) {
    throw new InputError('Value A is NaN');
  }

  if (isNaN(parsedB)) {
    throw new InputError('Value B is NaN');
  }

  return `${parsedA - parsedB}`;
}

/**
 * ConstructPartialBlockIdentifier constructs a PartialBlockIdentifier
 * from a BlockIdentifier.
 *
 * It is useful to have this helper when making block requests
 * with the fetcher.
 *
 * @param {Rosetta:BlockIdentifier} blockIdentifier - uniquely identifies a block in a particular network
 * @return {Rosetta:PartialBlockIdentifier} - constructs a new map or array model
 */
function constructPartialBlockIdentifier(blockIdentifier) {
  return RosettaClient.PartialBlockIdentifier.constructFromObject({
    hash: blockIdentifier.hash,
    index: blockIdentifier.index,
  });
}

// http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
Object.defineProperty(String.prototype, 'hashCode', {
  value: function() {
    var hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
});

/**
 * Get deterministic hash for any interface.
 * It is important to note that any interface that is a slice
 * or contains slices will not be equal if the slice ordering is
 * different.
 *
 * @param {object|number|string} input - input for Hasher
 * @return {string} - deterministic hash for any interface
 * @throws {Error} thrown if type of input is invalid
 */
function Hash(input) {
  if (typeof input == 'object') {
    let values = [];
    const keys = Object.keys(input).sort();

    for (let key of keys) {
      if (typeof input[key] == 'object') {
        const subHash = Hash(input[key]);
        values.push(`${key}:${subHash}`);
      } else {
        values.push(`${key}:${input[key]}`);
      }
    }

    return values.join('|').hashCode();
  }

  if (typeof input == 'number') {
    return `${input}`;
  }

  if (typeof input == 'string') {
    return input.hashCode();
  }

  throw new Error(`Invalid type ${typeof input} for Hasher`);
}

/**
 * Get representation of an amount value.
 *
 * @param {Rosetta:Amount} amount - some Value of a Currency
 * @return {number} - numeric value of the transaction amount
 * @throws {Error} thrown if amount not valid
 */
function AmountValue(amount) {
  if (amount == null) {
    throw new Error(`Amount value cannot be null`);
  }

  if (typeof amount.value !== 'string') {
    throw new Error('Amount must be a string');
  }

  return parseInt(amount.value);
}

/**
 * NegateValue flips the sign of a value.
 *
 * @param {string} amount - some Value of a Currency
 * @return {string} - flips the sign of a value
 * @throws {Error} thrown if amount not valid
 */
function NegateValue(amount) {
  if (amount == null) {
    throw new Error(`Amount value cannot be null`);
  }

  if (typeof amount !== 'string') {
    throw new Error('Amount must be a string');
  }

  const negated = 0 - parseInt(amount);
  return `${negated}`;
}

module.exports = {
  AddValues,
  SubtractValues,
  constructPartialBlockIdentifier,
  AmountValue,
  NegateValue,
  Hash,
};
