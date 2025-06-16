'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SessionAttendance extends Model {
    static associate(models) {
      SessionAttendance.belongsTo(models.CircleSession, {
        foreignKey: 'session_id',
        as: 'session',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      SessionAttendance.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  SessionAttendance.init({
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SessionAttendance',
    tableName: 'session_attendances',
    timestamps: true,
    underscored: true,
      createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
    indexes: [
      {
        unique: true,
        fields: ['session_id', 'user_id']
      }
    ]
  });

  return SessionAttendance;
};
