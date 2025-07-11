'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.hasMany(models.TasksSublevels, {
        foreignKey: 'task_id',
        as: 'tasksSublevels',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      
      Task.hasMany(models.ChallengeTask, {
        foreignKey: 'task_id',
        as: 'challenges_tasks',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

     Task.hasMany(models.TaskAgeGroup, { foreignKey: 'tasks_id', as: 'taskAgeGroups' });
    }
  }

  Task.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('mandatory', 'optional'),
      allowNull: false,
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_sublevels: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    level: {
      type: DataTypes.ENUM('save_new', 'five_part', 'exam', 'awqaf', 'talkeen'),
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return Task;
};
