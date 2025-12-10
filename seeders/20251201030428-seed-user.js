'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash('123456$%', 10);

    await queryInterface.bulkInsert('users', [{
      first_name: 'Super',
      last_name: 'Admin',
      email: 'admin@example.com', 
      password: passwordHash,
      phone : '0954862737',
      role_id :1,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
