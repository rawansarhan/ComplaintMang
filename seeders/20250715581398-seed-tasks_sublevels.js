'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tasks_sublevels', [
       { sublevel_id: 1, task_id: 11, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 2, task_id: 11, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 3, task_id: 11, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 1, task_id: 8, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 2, task_id: 8, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 3, task_id: 8, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 1, task_id: 9, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 2, task_id: 9, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 3, task_id: 9, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 1, task_id: 10, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 2, task_id: 10, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 3, task_id: 10, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 1, task_id: 14, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 2, task_id: 14, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 4, task_id: 12, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 5, task_id: 12, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 6, task_id: 12, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 7, task_id: 13, created_at: new Date(), updated_at: new Date() },
      { sublevel_id: 8, task_id: 13, created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks_sublevels', null, {});
  }
};
