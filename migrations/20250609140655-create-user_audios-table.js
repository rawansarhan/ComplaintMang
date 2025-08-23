'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_audios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      file: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surah_id :{
       type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'surahs',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
       from_ayah_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ayahs',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
        to_ayah_id: {
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_audios');
  }
}
