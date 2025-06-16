'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LessonAttendance extends Model {
    static associate(models) {
      LessonAttendance.belongsTo(models.LessonSession, {
        foreignKey: 'lesson_session_id',
        as: 'lesson_session',
      });

      LessonAttendance.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  LessonAttendance.init({
    lesson_session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'LessonAttendance',
    tableName: 'lesson_attendance',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return LessonAttendance;
};
