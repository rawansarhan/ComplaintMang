'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CircleUser extends Model {
    static associate(models) {
      CircleUser.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      CircleUser.belongsTo(models.Circle, {
        foreignKey: 'circle_id',
        as: 'circle',
      });
    }
  }

  CircleUser.init({
    circle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'CircleUser',
    tableName: 'circles_users',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return CircleUser;
};
