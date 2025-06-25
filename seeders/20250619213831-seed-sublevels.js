'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('sublevels', [
      { number_level: 1, point: 30, created_at: new Date(), updated_at: new Date() },
      { number_level: 2, point: 40, created_at: new Date(), updated_at: new Date() },
      { number_level: 3, point: 50, created_at: new Date(), updated_at: new Date() },
      { number_level: 1, point: 20, created_at: new Date(), updated_at: new Date() },
      { number_level: 2, point: 30, created_at: new Date(), updated_at: new Date() },
      { number_level: 3, point: 40, created_at: new Date(), updated_at: new Date() },
      { number_level: 1, point: 20, created_at: new Date(), updated_at: new Date() },
      { number_level: 2, point: 10, created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sublevels', null, {});
  }
};
