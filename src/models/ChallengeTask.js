'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChallengeTask extends Model {
    static associate(models) {
      ChallengeTask.belongsTo(models.Challenge, {
        foreignKey: 'Challenge_id',
        as: 'challenge',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      ChallengeTask.belongsTo(models.Task, {
        foreignKey: 'tasks_id',
        as: 'task',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  ChallengeTask.init({
    Challenge_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tasks_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'ChallengeTask',
    tableName: 'challenges_tasks',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return ChallengeTask;
};
