'use strict'

module.exports = (sequelize, DataTypes) => {
  class ComplaintSequence extends sequelize.Sequelize.Model {}

  ComplaintSequence.init(
    {
      government_entity: {
        type: DataTypes.STRING(50),
        primaryKey: true,
      },
      last_serial: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'complaint_sequences',
      sequelize,
      underscored: true,
      timestamps: true
    }
  )

  return ComplaintSequence
}
