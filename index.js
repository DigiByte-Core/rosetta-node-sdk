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

const defaultConfig = require('./config/default');
const logger = require('./lib/logger');
const ExpressServer = require('./lib/server');

const RosettaClient = require('rosetta-client');
const RosettaFetcher = require('./lib/fetcher');
const RosettaReconciler = require('./lib/reconciler');
const RosettaParser = require('./lib/parser');
const RosettaAsserter = require('./lib/asserter');
const RosettaControllers = require('./lib/controllers');

const RosettaUtils = require('./lib/utils');
const RosettaInternalModels = require('./lib/models');

const Errors = require('./lib/errors');
const RosettaSyncer = require('./lib/syncer');
const RosettaSyncerEvents = require('./lib/syncer/events');

class RosettaServer {
  constructor(configuration = {}) {
    this.config = Object.assign(
      {},
      defaultConfig,
      configuration
    );

    const port = this.config.URL_PORT;
    const openAPIPath = this.config.OPENAPI_YAML;

    try {
      this.expressServer = new ExpressServer(port, openAPIPath);
      this.expressServer.launch();

      logger.info(`Express server running on port ${port} using OpenAPI Spec: ${openAPIPath}`);

    } catch (e) {
      logger.error('Express Server failure', error.message);
      this.close();
    }
  }

  async launch() {
    try {
      const port = this.config.URL_PORT;
      const openAPIPath = this.config.OPENAPI_YAML;

      this.expressServer = new ExpressServer(port, openAPIPath);
      this.expressServer.launch();

    } catch (error) {
      logger.error('Express Server failure', error.message);
      await this.close();
    }
  }

  register(route, handler) {
    this.expressServer.app.routeHandlers[route] = handler;
  }

  async close() {
  }
}

module.exports = {
  Asserter: RosettaAsserter,
  Server: RosettaServer,
  Reconciler: RosettaReconciler,
  Controller: RosettaControllers,
  Syncer: RosettaSyncer,
  Fetcher: RosettaFetcher,
  Client: RosettaClient,
  Parser: RosettaParser,

  Utils: RosettaUtils,
  InternalModels: RosettaInternalModels,

  RosettaSyncerEvents,
  Errors,
};