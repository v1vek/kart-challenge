const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { initPromoStore } = require('./stores/promo.store');
const { initProductStore } = require('./stores/product.store');

async function startServer() {
  try {
    // load data before starting server
    initProductStore();
    await initPromoStore();

    const server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });

    setupProcessHandlers(server);

  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
}

function setupProcessHandlers(server) {
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

startServer();
