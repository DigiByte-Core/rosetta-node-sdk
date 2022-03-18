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
 * AccountDescription is used to describe a AccountIdentifier.
 * @module AccountDescription
 * @type {AccountDescription}
 */

/**
 * MetadataDescription is used to check if a string[] has certain keys and values of a certain kind.
 * @typedef {object} MetadataDescription
 * @property {string} key
 * @property {any} value_kind
 */

module.exports = class AccountDescription {
  /**
   * @param {boolean} [exists = false]
   * @param {boolean} [sub_account_exists = false]
   * @param {string} [sub_account_address = '']
   * @param {MetadataDescription[]} [sub_account_metadata_keys = []]
   */
  constructor({
    exists = false,
    sub_account_exists = false,
    sub_account_address = '',
    sub_account_metadata_keys = []
  }) {
    this.exists = exists;
    this.sub_account_exists = sub_account_exists;
    this.sub_account_address = sub_account_address;
    this.sub_account_metadata_keys = sub_account_metadata_keys;
  }
};
