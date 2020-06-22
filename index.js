const defaultConfig = require('./config');
const logger = require('./logger');
const ExpressServer = require('./expressServer');

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

module.exports = {
  RosettaServer,
};