const logger = require('../utils/logger')

async function withTransaction(sequelize, fn, context = {}) {
  const transaction = await sequelize.transaction()
  const startTime = Date.now()

  try {
    const result = await fn(transaction)
    await transaction.commit()
    return result
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback()
    }

    logger.error({
      message: error.message,
      user_id: context.userId,
      service: context.service,
      duration_ms: Date.now() - startTime,
      stack: sanitizeStackTrace(error.stack)
    })

    throw error
  }
}
const path = require('path')

function sanitizeStackTrace(stack) {
  return stack
    .split('\n')
    .map(line => {
      return line.includes('node_modules')
        ? path.basename(line.split('at ')[1].trim())
        : line
    })
    .join('\n')
}


module.exports = withTransaction
