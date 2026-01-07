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
     * توليد reference_number بشكل آمن باستخدام sequence لكل جهة
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

      // استخدام sequence لكل جهة لتجنب تكرار الأرقام
      const result = await sequelize.query(
        `
        INSERT INTO complaint_sequences(government_entity, last_serial, created_at, updated_at)
        VALUES(:government_entity, 1, NOW(), NOW())
        ON CONFLICT (government_entity)
        DO UPDATE SET last_serial = complaint_sequences.last_serial + 1,
                      updated_at = NOW()
        RETURNING last_serial
        `,
        {
          replacements: { government_entity },
          type: sequelize.QueryTypes.RAW, // هنا
          transaction
        }
      )
      
      // result سيكون array، ونقدر ناخذ الرقم كالتالي:
      const sequenceNumber = result[0][0].last_serial
      return `${prefix}-${sequenceNumber.toString().padStart(4, '0')}`
    }}      
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
      images: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      attachments: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
      },
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
