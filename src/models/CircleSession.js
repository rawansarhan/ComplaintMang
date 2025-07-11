'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CircleSession extends Model {
    static associate(models) {
   
      CircleSession.belongsTo(models.Circle, {
        foreignKey: 'circle_id',
        as: 'circle',
      });
        CircleSession.hasMany(models.QuranTalkeen, {
        foreignKey: 'session_id',
        as: 'quran_talkeens',
      });

      CircleSession.hasMany(models.QuranRecitation, {
        foreignKey: 'session_id',
        as: 'quran_recitations',
      });

      CircleSession.hasMany(models.SessionAttendance, {
        foreignKey: 'session_id',
        as: 'attendances',
      });

      CircleSession.hasMany(models.HadithRecitation, {
        foreignKey: 'session_id',
        as: 'hadith_recitations',
      });
    }
  }

  CircleSession.init({
    circle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [3, 300], 
      },
    } 
  }, {
    sequelize,
    modelName: 'CircleSession',
    tableName: 'circle_sessions',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return CircleSession;
};
