'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Surah extends Model {
    static associate(models) {
   
      Surah.belongsTo(models.Part, {
        foreignKey: 'part_id',
        as: 'part',
      });

      Surah.hasMany(models.Ayah, {
        foreignKey: 'surah_id',
        as: 'ayahs',
      });

      // مثال إضافي: تسجيلات صوتية لها علاقة بسورة
      Surah.hasMany(models.UserAudio, {
        foreignKey: 'name_surah',
        as: 'user_audios',
      });
    }
  }

  Surah.init({
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    part_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ayat_counts: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Surah',
    tableName: 'surahs',
    timestamps: false,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return Surah;
};
