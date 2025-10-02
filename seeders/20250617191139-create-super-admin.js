'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash('123456', 10);
 
    await queryInterface.bulkInsert('users', [{
      mosque_id: null,
      first_name: 'Super',
      last_name: 'Admin',
      phone: '1234567890',
      father_phone: null,
      birth_date: new Date('1990-01-01'),
      address: 'Admin Street 123',
      certificates: null,
      code: 'SUPER001',
      experiences: null,
      memorized_parts: null,
      role_id: 4,
      is_save_quran: false,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { email: 'superadmin@example.com' }, {});
  }
};
