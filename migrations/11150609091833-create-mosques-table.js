'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('mosques', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
         allowNull: false,
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      address: {
       type: Sequelize.STRING(200),
        allowNull: false
      },
      code: {
      type: Sequelize.STRING,
     allowNull: false,
      unique: true
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
    await queryInterface.dropTable('mosques')
  }
}

