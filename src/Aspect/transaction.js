async function withTransaction(sequelize, fn) {
    const transaction = await sequelize.transaction()
    const startTime = new Date()
  
    try {
      const result = await fn(transaction)
  
      const endTime = new Date()
      console.log({
        started_at: startTime,
        ended_at: endTime,
        duration_ms: endTime - startTime
      })
  
      await transaction.commit()
      return result
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback()
      }
      throw error
    }
  }
  
  module.exports = withTransaction
  