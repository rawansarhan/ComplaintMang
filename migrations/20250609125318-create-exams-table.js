'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 await queryInterface.createTable('exams', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
         allowNull: false,
      },
        circle_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'circles',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
     
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
       title:{
       type: Sequelize.STRING, 
        allowNull: true,

      },
      description:{
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
    await queryInterface.dropTable('exams')
  }
}
