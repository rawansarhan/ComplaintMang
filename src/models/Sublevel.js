'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sublevel extends Model {
    static associate(models) {
      Sublevel.belongsTo(models.Task, {
        foreignKey: 'tasks_id',
        as: 'task',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Sublevel.init({
    tasks_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    number_level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Sublevel',
    tableName: 'sublevels',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return Sublevel;
};
