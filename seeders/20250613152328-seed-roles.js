'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      { name: 'student', created_at: new Date(), updated_at: new Date() },
      { name: 'teacher',created_at: new Date(), updated_at: new Date() },
      { name: 'admin', created_at: new Date(), updated_at: new Date() },
      { name: 'superAdmin', created_at: new Date(), updated_at: new Date() }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {})
  }
}
