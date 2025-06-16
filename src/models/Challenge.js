'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Challenge extends Model {
    static associate(models) {
      // Challenge ينتمي لطالب (User)
      Challenge.belongsTo(models.User, {
        foreignKey: 'student_id',
        as: 'student',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Challenge ينتمي لمستوى (Level)
      Challenge.belongsTo(models.Level, {
        foreignKey: 'level_id',
        as: 'level',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Challenge له عدة Tasks من خلال Challenges_task
      Challenge.hasMany(models.ChallengeTask, {
        foreignKey: 'Challenge_id',
        as: 'challenges_tasks',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Challenge.init({
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    level_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Challenge',
    tableName: 'challenges',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return Challenge;
};
