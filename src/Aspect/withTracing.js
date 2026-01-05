const logger = require('../utils/logger')

function withTracing(fn, context = {}) {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      logger.error({
        message: error.message,
        stack: error.stack,
        user_id: context.userId,
        endpoint: context.endpoint,
        service: context.service,
        method: fn.name,
        payload: context.payload
      })

      throw error
    }
  }
}

module.exports = withTracing
