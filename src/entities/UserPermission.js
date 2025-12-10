'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserPermission extends Model {
    static associate(models) {
      // العلاقة بين المستخدمين والصلاحيات
      UserPermission.belongsTo(models.User, { 
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE'
      });
      UserPermission.belongsTo(models.Permission, { 
        foreignKey: 'permission_id',
        as: 'permission',
        onDelete: 'CASCADE'
      });
    }
  }

  UserPermission.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,  
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      permission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        allowNull: false,
        references: { model: 'permissions', key: 'id' },
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'UserPermission',
      tableName: 'user_permissions',
      timestamps: false,
    }
  );

  return UserPermission;
};
