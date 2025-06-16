'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('circles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mosque_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'mosques',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      circle_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'circles_types',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
     
      description: {
       type: Sequelize.TEXT,
        allowNull: true,
      
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('circles')
  }
}
