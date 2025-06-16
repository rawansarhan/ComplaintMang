'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QuranTalkeen extends Model {
    static associate(models) {
      QuranTalkeen.belongsTo(models.CircleSession, {
        foreignKey: 'session_id',
        as: 'session',
      });

      QuranTalkeen.belongsTo(models.User, {
        foreignKey: 'student_id',
        as: 'student',
      });

      QuranTalkeen.belongsTo(models.User, {
        foreignKey: 'teacher_id',
        as: 'teacher',
      });

      QuranTalkeen.belongsTo(models.Surah, {
        foreignKey: 'from_sura_id',
        as: 'from_sura',
      });

      QuranTalkeen.belongsTo(models.Surah, {
        foreignKey: 'to_sura_id',
        as: 'to_sura',
      });

      QuranTalkeen.belongsTo(models.Ayah, {
        foreignKey: 'from_verse',
        as: 'from_ayah',
      });

      QuranTalkeen.belongsTo(models.Ayah, {
        foreignKey: 'to_verse',
        as: 'to_ayah',
      });

    }
  }

  QuranTalkeen.init({
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    from_sura_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    from_verse: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to_sura_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to_verse: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'QuranTalkeen',
    tableName: 'quran_talkeens',
    underscored: true,
    timestamps: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return QuranTalkeen;
};
