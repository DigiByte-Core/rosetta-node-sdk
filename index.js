const defaultConfig = require('./config/default');
const logger = require('./lib/logger');
const ExpressServer = require('./lib/expressServer');

const RosettaClient = require('rosetta-client');
const RosettaFetcher = require('./lib/fetcher');

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
  }

  async launch() {
    try {
      const port = this.config.URL_PORT;
      const openAPIPath = this.config.OPENAPI_YAML;

      this.expressServer = new ExpressServer(port, openAPIPath);
      this.expressServer.launch();

      logger.info(`Express server running on port ${port} using OpenAPI Spec: ${openAPIPath}`);

    } catch (error) {
      logger.error('Express Server failure', error.message);
      await this.close();
    }
  }
}

class RosettaReconciler {

}

class RosettaParser {

}

module.exports = {
  Server: RosettaServer,
  Reconciler: RosettaReconciler,
  Syncer: RosettaSyncer,
  Fetcher: RosettaFetcher,
  Client: RosettaClient,
  Parser: RosettaParser,

  RosettaSyncerEvents,
  Errors,
};