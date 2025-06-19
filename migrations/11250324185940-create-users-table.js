'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      mosque_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'mosques',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      father_phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birth_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true // مستحب
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      certificates: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      experiences: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      memorized_parts: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
        role_id: {
         type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      is_save_quran: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
          defaultValue: false
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

  down: async queryInterface => {
    await queryInterface.dropTable('users')
  }
}
