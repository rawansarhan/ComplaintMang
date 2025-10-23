'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('undividual_recitations_quran', {
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
       teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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

      from_verse_id: {
        type: Sequelize.INTEGER,
        allowNull: false, allowNull: false,
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

      to_verse_id: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        references: {
          model: 'ayahs',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      is_exam:{
       type: Sequelize.BOOLEAN,
        allowNull: false
      },
      is_counted:{
       type: Sequelize.BOOLEAN,
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
        new_pages: {
        type: Sequelize.INTEGER,
        allowNull: false,
         defaultValue:0
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
    await queryInterface.dropTable('undividual_recitations_quran')
  }
}
