'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quran_talkeens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'circle_sessions', // ✅ تأكد من اسم جدول الجلسات
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // ✅ جدول المستخدمين
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

      from_sura_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'surahs', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      from_verse: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ayahs', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      to_sura_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'surahs',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      to_verse: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ayahs', 
          key: 'id',
        },
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('quran_talkeens');
  }
};
