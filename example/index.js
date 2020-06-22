const {
  RosettaServer,
} = require('../');

// Create a server configuration
const Server = new RosettaServer({
  URL_PORT: 3001,
});

Server.launch()
  .catch(e => logger.error(e));