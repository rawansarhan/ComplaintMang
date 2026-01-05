const logger = require('../utils/logger')
const AppError = require('../errors/AppError')

function errorHandler(err, req, res, next) {
  let error = err

  // إذا مو AppError نحوله
  if (!(err instanceof AppError)) {
    error = new AppError(
      'Internal server error',
      500,
      'SYSTEM_ERROR'
    )
  }

  // تسجيل الخطأ
  logger.error({
    message: err.message,
    type: error.type,
    stack: err.stack,
    user_id: req.user?.id,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip
  })

  // Response للـ user
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    type: error.type
  })
}

module.exports = errorHandler
