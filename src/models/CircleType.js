'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CircleType extends Model {
    static associate(models) {
      CircleType.hasMany(models.Circle, {
        foreignKey: 'circle_type_id',
        as: 'circles',
      });
    }
  }

  CircleType.init({
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'CircleType',
    tableName: 'circles_types',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return CircleType;
};
