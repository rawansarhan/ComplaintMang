'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('surahs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
       type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT, 
        allowNull: true,
      },
      part_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'parts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      ayat_counts: {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    ,      created_at: {
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
    await queryInterface.dropTable('surahs');
  }
};
