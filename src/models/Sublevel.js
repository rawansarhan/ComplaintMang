'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sublevel extends Model {
    static associate(models) {
      Sublevel.hasMany(models.TasksSublevels, {
        foreignKey: 'sublevel_id',
        as: 'tasl_sublevel',
      });
    }
  }

  Sublevel.init({
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
