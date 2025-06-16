'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QuranRecitation extends Model {
    static associate(models) {
      QuranRecitation.belongsTo(models.CircleSession, {
        foreignKey: 'session_id',
        as: 'circleSession',
        onDelete: 'CASCADE',
      });

      QuranRecitation.belongsTo(models.User, {
        foreignKey: 'teacher_id',
        as: 'teacher',
        onDelete: 'CASCADE',
      });

      QuranRecitation.belongsTo(models.User, {
        foreignKey: 'student_id',
        as: 'student',
        onDelete: 'CASCADE',
      });

      QuranRecitation.belongsTo(models.Surah, {
        foreignKey: 'from_sura_id',
        as: 'fromSurah',
        onDelete: 'CASCADE',
      });

      QuranRecitation.belongsTo(models.Ayah, {
        foreignKey: 'from_verse',
        as: 'fromVerse',
        onDelete: 'CASCADE',
      });

      QuranRecitation.belongsTo(models.Surah, {
        foreignKey: 'to_sura_id',
        as: 'toSurah',
        onDelete: 'CASCADE',
      });

      QuranRecitation.belongsTo(models.Ayah, {
        foreignKey: 'to_verse',
        as: 'toVerse',
        onDelete: 'CASCADE',
      });
    }
  }

  QuranRecitation.init({
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    student_id: {
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
    },
    is_counted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    is_exam: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'QuranRecitation',
    tableName: 'quran_recitations',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح

  });

  return QuranRecitation;
};
