'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('complaint_versions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      complaint_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'complaints', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'employees', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      version_number: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      before_data: {
        type: Sequelize.JSONB,
        allowNull: false
      },

      after_data: {
        type: Sequelize.JSONB,
        allowNull: false
      },

      change_summary: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('complaint_versions');
  }
};
