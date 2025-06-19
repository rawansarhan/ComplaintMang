'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Mosque extends Model {
    static associate(models) {
      Mosque.hasMany(models.Announcement, {
        foreignKey: 'mosque_id',
        as: 'announcements',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
       Mosque.hasMany(models.HadithBook, {
        foreignKey: 'mosque_id',
        as: 'hadithBook',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Mosque.init({
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Mosque',
    tableName: 'mosques',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return Mosque;
};
