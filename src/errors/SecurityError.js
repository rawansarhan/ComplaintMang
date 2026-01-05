const AppError = require('./AppError')

class SecurityError extends AppError {
  constructor(message) {
    super(message, 403, 'SECURITY_ERROR')
  }
}

module.exports = SecurityError
