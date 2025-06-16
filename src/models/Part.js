'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Part extends Model {
    static associate(models) {

      Part.hasMany(models.Surah, {
        foreignKey: 'part_id',
        as: 'surah',
      });
    }
  }

  Part.init({
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Part',
    tableName: 'parts',
    timestamps: false, 
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return Part;
};
