'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      Permission.belongsToMany(models.Role, {
        through: models.RolePermission,
        foreignKey: 'permission_id',
        otherKey: 'role_id',
        as: 'roles'
      });
      Permission.belongsToMany(models.User, {
        through: {
          model: models.UserPermission,
          timestamps: false
        },
        foreignKey: 'permission_id',
        otherKey: 'user_id',
        as: 'users'
      })
      
    }
  }

  Permission.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
  }, {
    sequelize,
    modelName: 'Permission',
    tableName: 'permissions',
    timestamps: false 
  });

  return Permission;
};
