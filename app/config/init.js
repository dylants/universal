const logger = require('../lib/logger')();

module.exports = () => {
  if (process.env.NODE_ENV) {
    logger.log(`Application loaded using the ${process.env.NODE_ENV} environment`);
  } else {
    logger.error('NODE_ENV is not defined! Using default development environment');
    process.env.NODE_ENV = 'development';
  }
};
