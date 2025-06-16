'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Level extends Model {
    static associate(models) {
      Level.belongsTo(models.User, {
        foreignKey: 'student_id',
        as: 'student',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      Level.hasMany(models.Challenge, {
        foreignKey: 'level_id',
        as: 'challenges'
      });
    }
  }

  Level.init({
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_repeatble: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Level',
    tableName: 'levels',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return Level;
};
