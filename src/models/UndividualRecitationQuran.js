'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UndividualRecitationQuran extends Model {
    static associate(models) {
      UndividualRecitationQuran.belongsTo(models.User, {
        foreignKey: 'student_id',
        as: 'student',
      });

      UndividualRecitationQuran.belongsTo(models.User, {
        foreignKey: 'teacher_id',
        as: 'teacher',
      });

      UndividualRecitationQuran.belongsTo(models.Surah, {
        foreignKey: 'from_sura_id',
        as: 'fromSurah',
      });

      UndividualRecitationQuran.belongsTo(models.Ayah, {
        foreignKey: 'from_verse_id',
        as: 'fromVerse',
      });

      UndividualRecitationQuran.belongsTo(models.Surah, {
        foreignKey: 'to_sura_id',
        as: 'toSurah',
      });

      UndividualRecitationQuran.belongsTo(models.Ayah, {
        foreignKey: 'to_verse_id',
        as: 'toVerse',
      });
    }
  }

  UndividualRecitationQuran.init({
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
    from_verse_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to_sura_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to_verse_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_exam: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    is_counted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
        new_pages: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
  }, {
    sequelize,
    modelName: 'UndividualRecitationQuran',
    tableName: 'undividual_recitations_quran',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return UndividualRecitationQuran;
};
