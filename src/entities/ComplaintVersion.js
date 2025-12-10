'use strict';

module.exports = (sequelize, DataTypes) => {
  const ComplaintVersion = sequelize.define('ComplaintVersion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    complaint_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    version_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    before_data: {
      type: DataTypes.JSONB,
      allowNull: false
    },

    after_data: {
      type: DataTypes.JSONB,
      allowNull: false
    },

    change_summary: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'complaint_versions',
    timestamps: true,
    underscored: true     // ← هذا يجعل Sequelize يستخدم created_at و updated_at
  });

  ComplaintVersion.associate = models => {
    ComplaintVersion.belongsTo(models.Complaint, {
      foreignKey: 'complaint_id'
    });

    ComplaintVersion.belongsTo(models.Employee, {
      foreignKey: 'employee_id'
    });
  };

  return ComplaintVersion;
};
