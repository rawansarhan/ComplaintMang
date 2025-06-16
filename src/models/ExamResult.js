'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExamResult extends Model {
    static associate(models) {
      // العلاقة مع الامتحان
      ExamResult.belongsTo(models.Exam, {
        foreignKey: 'exam_id',
        as: 'exam',
      });

      // العلاقة مع الطالب
      ExamResult.belongsTo(models.User, {
        foreignKey: 'student_id',
        as: 'student',
      });
    }
  }

  ExamResult.init({
    exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'ExamResult',
    tableName: 'exam_results',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return ExamResult;
};
