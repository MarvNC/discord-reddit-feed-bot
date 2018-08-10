'use strict';

const winston = require('winston');

module.exports = winston.createLogger({
  level: process.env.LOGGING_LEVEL || 'info',
  transports: [
    new (winston.transports.Console)(),
  ],
});
