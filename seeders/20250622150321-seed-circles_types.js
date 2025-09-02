'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('circles_types', [
      {
        name: 'قران',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'حديث',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'تلقين',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'دروس',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('circles_types', {
      name: ['قران', 'حديث', 'تلقين', 'دروس']
    }, {});
  }
};
