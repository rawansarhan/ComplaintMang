'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('mandatory', 'optional'),
        allowNull: false,
      },
      point: {
        type: Sequelize.INTEGER,
        allowNull: true, // null إذا كان يحتوي مستويات
      },
      is_sublevels: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      level: {
        type: Sequelize.ENUM('حفظ جديد', 'خمس اجزاء', 'امتحان', 'اوقاف', 'تلقين'),
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks');
  }
};
