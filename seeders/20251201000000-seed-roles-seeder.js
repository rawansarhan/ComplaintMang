'use strict'

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'Customer',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Teller',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Manager',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('roles', null, {})
  }
}
