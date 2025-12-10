'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate (models) {
      Employee.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })

      Employee.hasMany(models.Complaint, {
        foreignKey: 'responsible_id',
        as: 'assigned_complaints',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })

      Employee.hasMany(models.ComplaintVersion, {
        foreignKey: 'employee_id',
        as: 'complaint_versions',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })
    }
  }

  Employee.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      government_entity: {
        type: DataTypes.ENUM(
          'كهرباء',
          'ماء',
          'صحة',
          'تعليم',
          'داخلية',
          'مالية'
        ),
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'Employee',
      tableName: 'employees',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )

  return Employee
}
