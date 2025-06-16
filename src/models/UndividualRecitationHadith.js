'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UndividualRecitationHadith extends Model {
    static associate(models) {
      UndividualRecitationHadith.belongsTo(models.User, {
        foreignKey: 'student_id',
        as: 'student',
      });

      UndividualRecitationHadith.belongsTo(models.User, {
        foreignKey: 'teacher_id',
        as: 'teacher',
      });

      UndividualRecitationHadith.belongsTo(models.HadithBook, {
        foreignKey: 'book_id',
        as: 'book',
      });
    }
  }

  UndividualRecitationHadith.init({
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    from_hadith_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to_hadith_number: {
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
  }, {
    sequelize,
    modelName: 'UndividualRecitationHadith',
    tableName: 'undividual_recitations_hadith',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return UndividualRecitationHadith;
};
