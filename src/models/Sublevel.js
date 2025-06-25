'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sublevel extends Model {}

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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Sublevel;
};
