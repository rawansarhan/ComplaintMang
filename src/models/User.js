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
      }),
     User.belongsToMany(models.Circle, {
  through: models.CircleUser,
  as: 'circles',
  foreignKey: 'user_id',
  otherKey: 'circle_id'
});


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
       User.hasMany(models.Challenge, {
        foreignKey: 'student_id',
        as: 'challenge_studentId'
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
   
      },
      father_phone: {
        type: DataTypes.STRING,
        allowNull: true,
  
      },
      birth_date: {
        type: DataTypes.DATE,
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
        type: DataTypes.STRING,
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
      },
        fcm_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      underscored: true,
        createdAt: 'created_at', 
  updatedAt: 'updated_at', 
    }
  )

  return User
}
