'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('complaints', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      reference_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      governorate: {
        type: Sequelize.STRING(100),
        allowNull: false
      },

      location: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      government_entity: {
        type: Sequelize.ENUM(
          'كهرباء',
          'ماء',
          'صحة',
          'تعليم',
          'داخلية',
          'مالية'
        ),
        allowNull: false
      },

      citizen_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'citizens',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      responsible_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'employees',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      images: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      attachments: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM(
          'جديدة',
          'بانتظار معلومات اضافية',
          'قيد المعالجة',
          'منجزة',
          'مرفوضة'
        ),
        allowNull: false,
        defaultValue: 'جديدة'
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
    await queryInterface.dropTable('complaints')

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_complaints_status";
    `)
  }
}
