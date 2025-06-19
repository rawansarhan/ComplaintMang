'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('age_groups', [
      {
        name: 'الفئة 9-11',
        minAge: 9,
        maxAge: 11,
        photo: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'الفئة 12-13',
        minAge: 12,
        maxAge: 13,
        photo: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'الفئة 14-16',
        minAge: 14,
        maxAge: 16,
        photo: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'الفئة 17+',
        minAge: 17,
        maxAge: 99, 
        photo: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('age_groups', null, {});
  }
};
