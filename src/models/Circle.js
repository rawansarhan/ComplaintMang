'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Circle extends Model {
    static associate(models) {
      Circle.belongsTo(models.Mosque, {
        foreignKey: 'mosque_id',
        as: 'mosque',
      });
      Circle.belongsTo(models.CircleType, {
        foreignKey: 'circle_type_id',
        as: 'circle_type',
      });
       Circle.hasMany(models.CircleUser, {
    foreignKey: 'circle_id',
    as: 'circle_users',
  });

  Circle.hasMany(models.LessonSession, {
    foreignKey: 'circle_id',
    as: 'lesson_sessions',
  });

  Circle.hasMany(models.Exam, {
    foreignKey: 'circle_id',
    as: 'exams',
  });

  Circle.hasMany(models.CircleSession, {
    foreignKey: 'circle_id',
    as: 'circle_sessions',
  });
}
  }

  Circle.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 200],
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [3, 300],
      }
    },
    mosque_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lesson_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Circle',
    tableName: 'circles',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return Circle;
};
