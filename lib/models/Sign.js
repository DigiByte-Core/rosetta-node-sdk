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

const { InternalError } = require('../errors');
const { AmountValue } = require('../utils');

const ANY = '*';
const POSITIVE = '+';
const NEGATIVE = '-';

/**
 * Sign is used to represent possible signedness of an amount.
 * @class
 */
class Sign {
  /**
   * @constructor
   * @param {number|string} input
   */
  constructor(input) {
    if ([ANY, POSITIVE, NEGATIVE].includes(input)) {
      this.type = input;

    } else if (typeof input == 'number') {
      switch(this.sign(input)) {
        case -1: this.type = NEGATIVE; break;
        case +1: this.type = POSITIVE; break;
        case 0: this.type = POSITIVE; break;
      }
    } else {
      throw new InternalError(`Sign's constructor doesn't allow '${input}'`);
    }
  }

  /**
   * Check is a positive or negative amount.
   * @param {number} number - amount
   * @returns {number}
   */
  sign(number) {
    if (typeof number !== 'number') {
      throw new InternalError(`n in sign(n) must be a number`);
    }

    if (number > 0) return 1;
    if (number < 0) return -1;
    return 0;
  }

  /**
   * Match returns a boolean indicating if an amount type has an amount sign.
   * @param {Rosetta:Amount} amount - amount
   * @returns {boolean} - indicating if an amount type has an amount sign
   */
  match(amount) {
    if (this.type == ANY) {
      return true;
    }

    try {
      const numeric = AmountValue(amount);

      if (this.type == NEGATIVE && this.sign(numeric) == -1) {
        return true;
      }

      if (this.type == POSITIVE && this.sign(numeric) == 1) {
        return true;
      }
    } catch (e) {
      console.error(`ERROR`, e);
      return false;
    }

  }

  /**
   * Get description of an amount sign.
   * @returns {string} - description of an amount sign
   */
  toString() {
    return this.type;
  }
}

Sign.Positive = POSITIVE;
Sign.Negative = NEGATIVE;
Sign.Any = ANY;

module.exports = Sign;
