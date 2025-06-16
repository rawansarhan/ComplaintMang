'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AgeGroup extends Model {
    static associate(models) {
      // علاقة many-to-many مع tasks عن طريق tasks_age_groups
      AgeGroup.hasMany(models.TaskAgeGroup, {
        foreignKey: 'age_groups_id',
        as: 'taskAgeGroups',
      });
    }
  }

  AgeGroup.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    minAge: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    maxAge: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'AgeGroup',
    tableName: 'age_groups',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return AgeGroup;
};
