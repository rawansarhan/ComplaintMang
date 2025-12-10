'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('activity_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      action: {
        type: Sequelize.STRING,
        allowNull: false
      },

      entity_type: {
        type: Sequelize.STRING,
        allowNull: true
      },

      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      metadata: {
        type: Sequelize.JSONB,
        allowNull: true
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('activity_logs')
  }
}
