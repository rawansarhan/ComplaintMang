'use strict'

module.exports = (sequelize, DataTypes) => {
  class User extends sequelize.Sequelize.Model {
    static associate (models) {
      User.hasOne(models.Citizen, {
        foreignKey: 'user_id',
        as: 'citizen',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })

      User.hasOne(models.Employee, {
        foreignKey: 'user_id',
        as: 'employee',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'user_role'
      })

      User.belongsToMany(models.Permission, {
        through: 'user_permissions',
        foreignKey: 'user_id',
        otherKey: 'permission_id',
        as: 'permissions'
      })

      User.hasMany(models.ActivityLog, {
        foreignKey: 'user_id',
        as: 'activity_logs',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  }

  User.init(
    {
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      phone :{
        type :DataTypes.INTEGER,
        allowNull:false
      },
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'roles',
          key: 'id'
        },
        allowNull: false
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
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )

  return User
}
