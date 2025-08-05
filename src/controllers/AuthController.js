const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Role, Mosque, Wallet } = require('../models')
const {
  ValidateRegisterUser,
  ValidateLoginUser,
  ValidateLoginSuperAdmin
} = require('../validations/userValidation')

const SECRET_KEY = process.env.JWT_SECRET

//  Encode/Decode functions
const encodeMap = {
  0: 'aa',
  1: 'bb',
  2: 'cc',
  3: 'dd',
  4: 'ee',
  5: 'ff',
  6: 'gg',
  7: 'hh',
  8: 'ii',
  9: 'jj'
}

const decodeMap = Object.fromEntries(
  Object.entries(encodeMap).map(([k, v]) => [v, k])
)

function encodeCode (code) {
  return code
    .toString()
    .split('')
    .map(d => encodeMap[d])
    .join('')
}

function decodeCode (encoded) {
  const parts = encoded.match(/.{1,2}/g)
  return parts.map(pair => decodeMap[pair]).join('')
}

async function generateUniqueCode () {
  let code,
    exists = true

  while (exists) {
    code = Math.floor(100000 + Math.random() * 900000)
    const encodedCode = encodeCode(code.toString())
    const userWithCode = await User.findOne({ where: { code: encodedCode } })
    exists = !!userWithCode
  }

  return code
}
//////////////
const registerUserWithRole = roleName =>
  asyncHandler(async (req, res) => {
    const { error } = ValidateRegisterUser(req.body)
    if (error)
      return res.status(400).json({ message: error.details[0].message })

    const [
      existingUser,
      existingPhone,
      existingFatherPhone,
      existingMosque,
      role
    ] = await Promise.all([
      User.findOne({ where: { email: req.body.email } }),
      User.findOne({ where: { phone: req.body.phone } }),
      req.body.father_phone
        ? User.findOne({ where: { father_phone: req.body.father_phone } })
        : Promise.resolve(null),
      Mosque.findOne({ where: { id: req.body.mosque_id } }),
      Role.findOne({ where: { name: roleName } })
    ])

    if (existingUser)
      return res.status(400).json({ message: 'This user already registered' })
    if (existingPhone)
      return res.status(400).json({ message: 'This phone already registered' })
    if (!existingMosque)
      return res.status(404).json({ message: 'This mosque does not exist' })
    if (!role)
      return res.status(500).json({ message: 'Role not found in database' })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const codeUser = await generateUniqueCode()
    const encodedCode = encodeCode(codeUser.toString())

    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      mosque_id: req.body.mosque_id,
      birth_date: req.body.birth_date,
      code: encodedCode,
      is_save_quran: req.body.is_save_quran,
      phone: req.body.phone,
      father_phone: req.body.father_phone,
      address: req.body.address,
      certificates: req.body.certificates,
      experiences: req.body.experiences,
      memorized_parts: req.body.memorized_parts,
      role_id: role.id
    })
    if (user.role_id == 1) {
      await Wallet.create({
        student_id: user.id,
        scores: 0
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role_id: role.id,
        mosque_id: user.mosque_id,
        role: role.name
      },
      SECRET_KEY,
      { expiresIn: '40d' }
    )

    const { password, code, ...userData } = user.toJSON()
    const code_user = decodeCode(code.toString())

    res.status(201).json({ ...userData, code_user, token })
  })

// login(student,teacher)
const loginUser = asyncHandler(async (req, res) => {
  const { error } = ValidateLoginUser(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  const encodedUserCode = encodeCode(req.body.code_user.toString())
  const encodedMosqueCode = encodeCode(req.body.mosque_code.toString())

  const user = await User.findOne({ where: { code: encodedUserCode } })
  if (!user) return res.status(400).json({ message: 'Invalid user code' })

  const mosque = await Mosque.findOne({ where: { code: encodedMosqueCode } })
  if (!mosque) return res.status(400).json({ message: 'Mosque not found' })

  if (user.mosque_id !== mosque.id) {
    return res.status(400).json({ message: 'Invalid mosque code' })
  }

  const role = await Role.findOne({ where: { id: user.role_id } })

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      mosque_id: user.mosque_id,
      role: role?.name || 'unknown'
    },
    SECRET_KEY,
    { expiresIn: '40d' }
  )

  const { password, code, ...userData } = user.toJSON()
  const code_user = decodeCode(code.toString())

  res.status(200).json({ ...userData, code_user, token })
})

// login SuperAdmin
const loginSuperAdmin = async (req, res) => {
  const { error } = ValidateLoginSuperAdmin(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  const { email, password } = req.body

  try {
    const user = await User.findOne({
      where: { email, role_id: 4 } // SuperAdmin فقط
    })

    if (!user)
      return res
        .status(401)
        .json({ message: 'Invalid email or not a super admin' })

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword)
      return res.status(401).json({ message: 'Invalid password' })

    const role = await Role.findOne({ where: { id: user.role_id } })

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
        role: role?.name || 'unknown'
      },
      SECRET_KEY,
      { expiresIn: '40d' }
    )

    res.status(200).json({
      message: 'Login successful',
      token,
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      role: role?.name,
      name: `${user.first_name} ${user.last_name}`
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

module.exports = {
  registerStudent: registerUserWithRole('student'),
  registerTeacher: registerUserWithRole('teacher'),
  registerAdmin: registerUserWithRole('admin'),
  loginUser,
  loginSuperAdmin
}
