'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('circle_sessions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
 circle_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'circles',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
       date:{
       type: Sequelize.DATE,
       allowNull:false,
      },
      description:{
        type: Sequelize.STRING,
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
        });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('circle_sessions');
  }
};
