const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Role } = require('../models') // ← تأكد من أن Role موجود في models/index.js
const {
  ValidateRegisterUser,
  ValidateLoginUser
} = require('../validations/userValidation')
const {Mosque} = require('../models')
const { where } = require('sequelize')

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key'

// ✅ دالة عامة لتسجيل المستخدم بدور محدد
const registerUserWithRole = roleName =>
  asyncHandler(async (req, res) => {
    try {
      const { error } = ValidateRegisterUser(req.body)
      if (error) {
        return res.status(400).json({ message: error.details[0].message })
      }

      const existingUser = await User.findOne({
        where: { email: req.body.email }
      })
      if (existingUser) {
        return res.status(400).json({ message: 'This user already registered' })
      }
      const existingMosque = await Mosque.findOne({
        where: { id: req.body.mosque_id }
      })

      if (!existingMosque) {
        return res.status(404).json({ message: 'This mosque does not exist' })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      const code = await generateUniqueCode()
      const hashedCode = await bcrypt.hash(code, salt)
      // جلب الدور من جدول roles بناءً على الاسم
      const role = await Role.findOne({ where: { name: roleName } })
      if (!role) {
        return res.status(500).json({ message: 'Role not found in database' })
      }

      const user = await User.create({
        email: req.body.email,
        password: hashedPassword,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        mosque_id: req.body.mosque_id,
        birth_date: req.body.birth_date,
        code: hashedCode,
        is_save_quran: req.body.is_save_quran,
        phone: req.body.phone,
        father_phone: req.body.father_phone,
        address: req.body.address,
        certificates: req.body.certificates,
        experiences: req.body.experiences,
        memorized_parts: req.body.memorized_parts,
        role_id: role.id
      })

      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '4d' })
      const { password, ...userData } = user.toJSON()

      res.status(201).json({ ...userData, token })
    } catch (err) {
      console.error('Database error:', err) // أضف هذا
      return res
        .status(500)
        .json({ message: 'Database error', details: err.message })
    }
  })

async function generateUniqueCode () {
  let code
  let exists = true

  while (exists) {
    code = Math.floor(100000 + Math.random() * 900000)
    const userWithCode = await User.findOne({ where: { code:code } })
    exists = !!userWithCode
  }

  return code
}

//  تسجيل الدخول
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { error } = ValidateLoginUser(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    const user = await User.findOne({
      where: { code: req.body.code_user }
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid code' })
    }

    const mosque = await Mosque.findOne({
      where: { code: req.body.mosque_code }
    })

    if (!mosque) {
      return res.status(400).json({ message: 'Mosque not found' })
    }

    if (user.mosque_id !== mosque.id) {
      return res.status(400).json({ message: 'Invalid mosque code' })
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '4d' })
    const { password,code, ...userData } = user.toJSON()

    res.status(200).json({ ...userData, token })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Database error',
      details: err.message,
      stack: err.stack
    })
  }
})

module.exports = {
  registerStudent: registerUserWithRole('student'),
  registerTeacher: registerUserWithRole('teacher'),
  registerAdmin: registerUserWithRole('admin'),
  loginUser
}
