const AppError = require('./AppError')

class DatabaseError extends AppError {
  constructor(message) {
    super(message, 500, 'DATABASE_ERROR')
  }
}

module.exports = DatabaseError
