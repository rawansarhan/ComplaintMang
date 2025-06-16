'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      // علاقة One-to-Many مع المسجد
      User.belongsTo(models.Mosque, {
        foreignKey: 'mosque_id',
        as: 'mosque'
      })
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role'
      })

      // العلاقات الأخرى الممكنة
      User.hasMany(models.Announcement, {
        foreignKey: 'user_id',
        as: 'announcements'
      })
      User.hasMany(models.LessonAttendance, {
        foreignKey: 'user_id',
        as: 'lesson_attendances'
      })
      User.hasMany(models.CircleUser, {
        foreignKey: 'user_id',
        as: 'circle_users'
      })
      User.hasMany(models.SessionAttendance, {
        foreignKey: 'user_id',
        as: 'session_attendances'
      })

      // علاقات الطالب / المعلم
      User.hasMany(models.QuranRecitation, {
        foreignKey: 'student_id',
        as: 'quran_recitations_as_student'
      })
      User.hasMany(models.QuranRecitation, {
        foreignKey: 'teacher_id',
        as: 'quran_recitations_as_teacher'
      })

      User.hasMany(models.HadithRecitation, {
        foreignKey: 'student_id',
        as: 'hadith_recitations_as_student'
      })
      User.hasMany(models.HadithRecitation, {
        foreignKey: 'teacher_id',
        as: 'hadith_recitations_as_teacher'
      })

      User.hasMany(models.QuranTalkeen, {
        foreignKey: 'student_id',
        as: 'quran_talkeens_as_student'
      })
      User.hasMany(models.QuranTalkeen, {
        foreignKey: 'teacher_id',
        as: 'quran_talkeens_as_teacher'
      })

      User.hasMany(models.UserAudio, {
        foreignKey: 'student_id',
        as: 'user_audios'
      })

      User.hasMany(models.Comment, {
        foreignKey: 'teacher_id',
        as: 'comments_by_teacher'
      })

      User.hasMany(models.UndividualRecitationHadith, {
        foreignKey: 'student_id',
        as: 'individual_hadith_as_student'
      })
      User.hasMany(models.UndividualRecitationHadith, {
        foreignKey: 'teacher_id',
        as: 'individual_hadith_as_teacher'
      })

      User.hasMany(models.UndividualRecitationQuran, {
        foreignKey: 'student_id',
        as: 'individual_quran_as_student'
      })
      User.hasMany(models.UndividualRecitationQuran, {
        foreignKey: 'teacher_id',
        as: 'individual_quran_as_teacher'
      })
    }
  }

  User.init(
    {
      mosque_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      father_phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      birth_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // مستحب
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      certificates: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      experiences: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      memorized_parts: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      role_id: {
          type: DataTypes.INTEGER,
        allowNull: false
      },
      is_save_quran: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      underscored: true,
        createdAt: 'created_at', // ← ربط الاسم الصحيح
  updatedAt: 'updated_at', // ← ربط الاسم الصحيح
    }
  )

  return User
}
