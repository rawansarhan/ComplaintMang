'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      Post.hasMany(models.Comment, {
        foreignKey: 'post_id',
        as: 'comments',
      });
    }
  }

  Post.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true,
    underscored: true,
  });

  return Post;
};