'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TaskAgeGroup extends Model{
    static associate(models) {
      TaskAgeGroup.belongsTo(models.AgeGroup, {
        foreignKey: 'age_groups_id',
        as: 'age_group',

      });

      TaskAgeGroup.belongsTo(models.Task, {
        foreignKey: 'tasks_id',
        as: 'task',
      });
    }
  }

  TaskAgeGroup.init({
    age_groups_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tasks_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'TaskAgeGroup',
    tableName: 'tasks_age_groups',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return TaskAgeGroup;
};
