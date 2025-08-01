'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExamResult extends Model {
    static associate(models) {
      ExamResult.belongsTo(models.Exam, {
        foreignKey: 'exam_id',
        as: 'exam',
      });

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
    },
    has_taken_exam: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
  }, {
    sequelize,
    modelName: 'ExamResult',
    tableName: 'exam_results',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', 
  updatedAt: 'updated_at', 
  });

  return ExamResult;
};
