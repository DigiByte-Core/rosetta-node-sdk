/**
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

// models: index.js

const { InputError } = require('../errors');
const RosettaClient = require('rosetta-client');

function AddValues(a, b) {
  const parsedA = parseInt(a);
  const parsedB = parseInt(b);

  if (isNaN(parsedA)) {
    throw new AsserterError('SupportedNetworks must be an array');
  }

  if (isNaN(parsedB)) {
    throw new AsserterError('SupportedNetworks must be an array');
  }

  return `${parsedA + parsedB}`;
}

function SubtractValues(a, b) {
  const parsedA = parseInt(a);
  const parsedB = parseInt(b);

  if (isNaN(parsedA)) {
    throw new AsserterError('SupportedNetworks must be an array');
  }

  if (isNaN(parsedB)) {
    throw new AsserterError('SupportedNetworks must be an array');
  }

  return `${parsedA - parsedB}`;  
}

function constructPartialBlockIdentifier(blockIdentifier) {
  return RosettaClient.PartialBlockIdentifier.constructFromObject({
    hash: blockIdentifier.hash,
    index: blockIdentifier.index,
  });
}

const AMOUNT_ANY = 'AMOUNT_ANY';
const AMOUNT_NEGATIVE = 'AMOUNT_NEGATIVE';
const AMOUNT_POSITIVE = 'AMOUNT_POSITIVE';

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

class AmountSign {
  constructor(type) {
    if (! type in [AMOUNT_ANY, AMOUNT_NEGATIVE, AMOUNT_POSITIVE]) {
      throw new Error('AmountSign not supported');
    }
    this.type = type;
  }

  static ANY() {
    return AmountSign(AMOUNT_ANY);
  }

  static NEGATIVE() {
    return AmountSign(AMOUNT_NEGATIVE);
  }

  static POSITIVE() {
    return AmountSign(AMOUNT_POSITIVE);
  }


  /**
   * Returns if amount has an amountSign
   */
  match(amount) {
    if (this.type == AMOUNT_ANY) return true;

    const numeric = RosettaClient.AmountValue(amount);

    if (this.type == AMOUNT_NEGATIVE && numeric.sign == -1) {
      return true;
    }

    if (this.type == AMOUNT_POSITIVE && numeric.sign == 1) {
      return true;
    }

    return false;
  }

  toString() {
    return this.type;
  }
}

function Hash(input) {
  if (typeof input == 'object') {
    let values = [];
    const keys = Object.keys(input).sort();

    for (let key of keys) {
      values.push(`${key}:${input[key]}`);
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

function AmountValue(amount) {
  if (amount == null) {
    throw new Error(`Amount value cannot be null`);
  }

  return parseInt(amount);
}

module.exports = {
  AddValues,
  SubtractValues,
  constructPartialBlockIdentifier,
  AmountValue,
  Hash,
};