'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TasksSublevels extends Model {
    static associate(models) {
      // Define associations here
      TasksSublevels.belongsTo(models.Sublevel, {
        foreignKey: 'sublevel_id',
        as: 'sublevel'
      });

      TasksSublevels.belongsTo(models.Task, {
        foreignKey: 'task_id',
        as: 'task'
      });
    }
  }

  TasksSublevels.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    sublevel_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    task_id: {
      type: DataTypes.INTEGER,
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
  }, {
    sequelize,
    modelName: 'TasksSublevels',
    tableName: 'tasks_sublevels',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return TasksSublevels;
};
