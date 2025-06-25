'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tasks_age_groups', [
      // Age Group 1
      {
        age_groups_id: 1,
        tasks_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 1,
        tasks_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 1,
        tasks_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 1,
        tasks_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 1,
        tasks_id: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 1,
        tasks_id: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Age Group 2
      {
        age_groups_id: 2,
        tasks_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 2,
        tasks_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 2,
        tasks_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 2,
        tasks_id: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 2,
        tasks_id: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 2,
        tasks_id: 7,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 2,
        tasks_id: 8,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 2,
        tasks_id: 9,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 2,
        tasks_id: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 2,
        tasks_id: 11,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Age Group 3
      {
        age_groups_id: 3,
        tasks_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
       {
        age_groups_id: 3,
        tasks_id: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 3,
        tasks_id: 8,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 3,
        tasks_id: 9,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 3,
        tasks_id: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 3,
        tasks_id: 12,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 3,
        tasks_id: 13,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 3,
        tasks_id: 14,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Age Group 4
      {
        age_groups_id: 4,
        tasks_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
       {
        age_groups_id: 4,
        tasks_id: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 4,
        tasks_id: 8,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 4,
        tasks_id: 9,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 4,
        tasks_id: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 4,
        tasks_id: 12,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 4,
        tasks_id: 13,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        age_groups_id: 4,
        tasks_id: 14,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks_age_groups', {
      [Sequelize.Op.or]: [
        { age_groups_id: 1 },
        { age_groups_id: 2, tasks_id: 2 },
        { age_groups_id: 2, tasks_id: 3 },
        { age_groups_id: 2, tasks_id: 4 },
        { age_groups_id: 2, tasks_id: 5 },
        { age_groups_id: 2, tasks_id: 6 },
        { age_groups_id: 2, tasks_id: 7 },
        { age_groups_id: 2, tasks_id: 8 },
        { age_groups_id: 2, tasks_id: 9 },
        { age_groups_id: 2, tasks_id: 10 },
        { age_groups_id: 2, tasks_id: 11 },
        { age_groups_id: 3, tasks_id: 4 },
        { age_groups_id: 3, tasks_id: 6 },
        { age_groups_id: 3, tasks_id: 8 },
        { age_groups_id: 3, tasks_id: 9 },
        { age_groups_id: 3, tasks_id: 10 },
        {
          age_groups_id: 3,
          tasks_id: 12
        },
        {
          age_groups_id: 3,
          tasks_id: 13
        },
        {
          age_groups_id: 3,
          tasks_id: 14
        },
       { age_groups_id: 4, tasks_id: 4 },
        { age_groups_id: 4, tasks_id: 6 },
        { age_groups_id: 4, tasks_id: 8 },
        { age_groups_id: 4, tasks_id: 9 },
        { age_groups_id: 4, tasks_id: 10 },
        {
          age_groups_id: 4,
          tasks_id: 12
        },
        {
          age_groups_id: 4,
          tasks_id: 13
        },
        {
          age_groups_id: 4,
          tasks_id: 14
        },
      ]
    })
  }
}
