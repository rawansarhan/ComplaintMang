const winston = require('winston')
const path = require('path')

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/errors.log')
    }),
    new winston.transports.Console()
  ]
})

module.exports = logger
