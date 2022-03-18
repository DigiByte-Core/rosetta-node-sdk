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
 * Contains a slice of operation descriptions and high-level requirements enforced across multiple Operations.
 * @module Descriptions
 * @type {Descriptions}
 */
module.exports = class Descriptions {
  /**
   * @param {OperationDescription[]} operation_descriptions
   * @param {any[]} [equal_amounts = []] - EqualAmounts are specified using the operation indices of
   *  OperationDescriptions to handle out of order matches. MatchOperations
   *  will error if all groups of operations aren't equal.
   * @param {any[]} [opposite_amounts = []] - OppositeAmounts are specified using the operation indices of
   *  OperationDescriptions to handle out of order matches. MatchOperations
   *  will error if all groups of operations aren't opposites.
   * @param {any[]} [equal_addresses = []] - EqualAddresses are specified using the operation indices of
   *  OperationDescriptions to handle out of order matches. MatchOperations
   *  will error if all groups of operations addresses aren't equal.
   * @param {boolean} [err_unmatched = false] - ErrUnmatched indicates that an error should be returned
   *  if all operations cannot be matched to a description.
   */
  constructor({
    operation_descriptions = [],
    equal_amounts = [],
    opposite_amounts = [],
    equal_addresses = [],
    err_unmatched = false,
  }) {
    this.operation_descriptions = operation_descriptions;
    this.equal_amounts = equal_amounts;
    this.opposite_amounts = opposite_amounts;
    this.equal_addresses = equal_addresses;
    this.err_unmatched = err_unmatched;
  }
};
