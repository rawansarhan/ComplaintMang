'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('undividual_recitations_hadith', {
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
       book_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hadith_books',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      from_hadith_number:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      to_hadith_number:{
        type: Sequelize.INTEGER,
        llowNull: false
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
    await queryInterface.dropTable('undividual_recitations_hadith')
  }
}
