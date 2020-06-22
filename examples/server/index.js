const RosettaSDK = require('../..');

// Create a server configuration
const Server = new RosettaSDK.Server({
  URL_PORT: 3001,
});

Server.launch()
  .catch(e => logger.error(e));