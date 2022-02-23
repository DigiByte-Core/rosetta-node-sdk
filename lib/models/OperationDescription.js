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
 * OperationDescription is used to describe an operation.
 * @module OperationDescription
 * @type {OperationDescription}
 */
module.exports = class OperationDescription {
  /**
   * @param {AccountDescription} account
   * @param {AmountDescription} amount
   * @param {object[]} [metadata = []]
   * @param {string} [type = ''] - Type is the operation.Type that must match. If this is left empty, any type is considered a match.
   * @param {boolean} [allow_repeats = false] - AllowRepeats indicates that multiple operations can be matched to a particular description.
   * @param {boolean} [optional = false] - Optional indicates that not finding any operations that meet the description should not trigger an error.
   */
  constructor({
    account,
    amount,
    metadata = [],
    type = '',
    allow_repeats = false,
    optional = false,
  }) {
    this.account = account;
    this.amount = amount;
    this.metadata = metadata;
    this.type = type;
    this.allow_repeats = allow_repeats;
    this.optional = optional;
  }
};
