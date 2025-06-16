'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    static associate(models) {
      Wallet.belongsTo(models.User, {
        foreignKey: 'student_id',
        as: 'student',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Wallet.init({
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    scores: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Wallet',
    tableName: 'wallets',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
  });

  return Wallet;
};
