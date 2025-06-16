'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hadith_recitations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'circle_sessions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      book_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hadith_books',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      from_hadith: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      to_hadith: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      is_exam: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },

      is_counted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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
    await queryInterface.dropTable('hadith_recitations');
  }
};
