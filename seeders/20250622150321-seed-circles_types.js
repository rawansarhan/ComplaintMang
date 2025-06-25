'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('circles_types', [
      {
        name: 'Tasmii',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hadith',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Talqeen',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Dars',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('circles_types', {
      name: ['Tasmii', 'Hadith', 'Talqeen', 'lesson']
    }, {});
  }
};
