'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HadithBook extends Model {
    static associate(models) {
      HadithBook.belongsTo(models.Mosque, {
        foreignKey: 'mosque_id',
        as: 'mosque',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      HadithBook.hasMany(models.UndividualRecitationHadith, {
        foreignKey: 'book_id',
        as: 'UndividualRecitationHadith',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    
    }
  }

  HadithBook.init({
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    mosque_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hadith_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'HadithBook',
    tableName: 'hadith_books',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return HadithBook;
};
