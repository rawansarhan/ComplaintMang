'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: 'teacher_id',
        as: 'teacher',
        onDelete: 'CASCADE',
      });

      Comment.belongsTo(models.UserAudio, {
        foreignKey: 'audio_id',
        as: 'audio',
        onDelete: 'CASCADE',
      });
    }
  }

  Comment.init({
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    audio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return Comment;
};
