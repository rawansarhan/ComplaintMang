'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ayah extends Model {
    static associate(models) {
      Ayah.belongsTo(models.Surah, {
        foreignKey: 'surah_id',
        as: 'surah',
      });

      Ayah.hasMany(models.UserAudio, {
        foreignKey: 'from_ayah_id',
        as: 'start_of_audios',
      });

      Ayah.hasMany(models.UserAudio, {
        foreignKey: 'to_ayah_id',
        as: 'end_of_audios',
      });
    }
  }

  Ayah.init({
    surah_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ayah_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    page_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
   
  }, {
    sequelize,
    modelName: 'Ayah',
    tableName: 'ayahs',
    timestamps: false,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return Ayah;
};
