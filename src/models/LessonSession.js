'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class LessonSession extends Model {
    static associate (models) {
      LessonSession.hasMany(models.LessonAttendance, {
        foreignKey: 'lesson_session_id',
        as: 'attendances'
      })

      LessonSession.belongsTo(models.Circle, {
        foreignKey: 'circle_id',
        as: 'circle'
      })
    }
  }

  LessonSession.init(
    {
      circle_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'LessonSession',
      tableName: 'lesson_sessions',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at', 
      updatedAt: 'updated_at' 
    }
  )

  return LessonSession
}
