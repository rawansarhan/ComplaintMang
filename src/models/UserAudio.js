'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserAudio extends Model {
    static associate(models) {
      UserAudio.belongsTo(models.User, {
        foreignKey: 'student_id',
        as: 'student',
      });


      UserAudio.belongsTo(models.Surah, {
        foreignKey: 'surah_id',
        as: 'surah',
      });

      UserAudio.belongsTo(models.Ayah, {
        foreignKey: 'from_ayah_id',
        as: 'from_ayah',
      });

      UserAudio.belongsTo(models.Ayah, {
        foreignKey: 'to_ayah_id',
        as: 'to_ayah',
      });
    
      UserAudio.hasMany(models.Comment, {
        foreignKey: 'audio_id',
        as: 'comments',
      });
    }
  }

  UserAudio.init({
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surah_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    from_ayah_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to_ayah_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'UserAudio',
    tableName: 'user_audios',
    underscored: true,
    timestamps: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return UserAudio;
};
