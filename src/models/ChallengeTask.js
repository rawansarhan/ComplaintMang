'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChallengeTask extends Model {
    static associate(models) {
      ChallengeTask.belongsTo(models.Challenge, {
        foreignKey: 'challenge_id',
        as: 'challenge',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      ChallengeTask.belongsTo(models.Task, {
        foreignKey: 'task_id',
        as: 'task',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
       ChallengeTask.belongsTo(models.Sublevel, {
        foreignKey: 'sublevels_id',
        as: 'sublevel',
      });
    }
  
    }
  

  ChallengeTask.init({
    challenge_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sublevels_id: {
      type: DataTypes.INTEGER,
      allowNull: true
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
