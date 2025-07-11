'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class HadithRecitation extends Model {
    static associate (models) {
      HadithRecitation.belongsTo(models.CircleSession, {
        foreignKey: 'session_id',
        as: 'session'
      })

      HadithRecitation.belongsTo(models.User, {
        foreignKey: 'student_id',
        as: 'student'
      })

      HadithRecitation.belongsTo(models.User, {
        foreignKey: 'teacher_id',
        as: 'teacher'
      })

      HadithRecitation.belongsTo(models.HadithBook, {
        foreignKey: 'book_id',
        as: 'book'
      })
    }
  }

  HadithRecitation.init(
    {
      session_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      book_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      from_hadith: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      to_hadith: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      is_exam: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      is_counted: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      attendance: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'HadithRecitation',
      tableName: 'hadith_recitations',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
      updatedAt: 'updated_at' // ← ربط الاسم الصحيح
    }
  )

  return HadithRecitation
}
