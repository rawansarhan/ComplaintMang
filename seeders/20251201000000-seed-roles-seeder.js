'use strict'

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'Admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Employee',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Citizen',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('roles', null, {})
  }
}
