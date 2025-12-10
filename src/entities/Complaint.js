'use strict'

module.exports = (sequelize, DataTypes) => {
  class Complaint extends sequelize.Sequelize.Model {
    static associate (models) {
      Complaint.belongsTo(models.Citizen, {
        foreignKey: 'citizen_id',
        as: 'citizen'
      })

      Complaint.belongsTo(models.Employee, {
        foreignKey: 'responsible_id',
        as: 'employee'
      })

      Complaint.hasMany(models.ComplaintVersion, {
        foreignKey: 'complaint_id',
        as: 'versions',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }

    /**
     * توليد reference_number بشكل آمن لضمان عدم التكرار
     */
    static async generateReferenceNumber (government_entity, transaction) {
      const entityMap = {
        صحة: 1,
        تعليم: 2,
        داخلية: 3,
        مالية: 4,
        ماء: 5,
        كهرباء: 6
      }

      const prefix = entityMap[government_entity] || 9

      console.log('START generating number', government_entity, Date.now())

      const lastComplaint = await Complaint.findOne({
        where: { government_entity },
        order: [['id', 'DESC']],
        lock: true,
        transaction
      })

      console.log('END generating number', government_entity, Date.now())

      let serial = 1
      if (lastComplaint && lastComplaint.reference_number) {
        const parts = lastComplaint.reference_number.split('-')
        serial = parseInt(parts[1], 10) + 1
      }

      return `${prefix}-${serial.toString().padStart(4, '0')}`
    }
  }

  Complaint.init(
    {
      reference_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
      },
      description: { type: DataTypes.TEXT, allowNull: true },
      governorate: { type: DataTypes.STRING(100), allowNull: false },
      government_entity: {
        type: DataTypes.ENUM(
          'كهرباء',
          'ماء',
          'صحة',
          'تعليم',
          'داخلية',
          'مالية'
        ),
        allowNull: false
      },
      location: { type: DataTypes.STRING(255), allowNull: true },
      citizen_id: { type: DataTypes.INTEGER, allowNull: false },
      responsible_id: { type: DataTypes.INTEGER, allowNull: true },
      images: { type: DataTypes.JSONB, allowNull: true },
      attachments: { type: DataTypes.JSONB, allowNull: true },
      status: {
        type: DataTypes.ENUM(
          'جديدة',
          'بانتظار معلومات اضافية',
          'قيد المعالجة',
          'منجزة',
          'مرفوضة'
        ),
        allowNull: false,
        defaultValue: 'جديدة'
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
      tableName: 'complaints',
      sequelize,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )

  return Complaint
}
