const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Role, Mosque, Wallet } = require('../models')
const {
  ValidateRegisterUser,
  ValidateLoginUser,
  ValidateLoginSuperAdmin,
  ValidateRegisterAdmin
} = require('../validations/userValidation')
const { where } = require('sequelize')

const SECRET_KEY =process.env.JWT_SECRET || 'default_secret_key'

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
const registerUserWithRole = (roleName) =>
  asyncHandler(async (req, res) => {
    const { error } = ValidateRegisterUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: missing user context" });
    }

    const [role, adminUser] = await Promise.all([
      Role.findOne({ where: { name: roleName } }),
      User.findOne({ where: { id: req.user.id } }),
    ]);

    if (!role) {
      return res.status(400).json({ message: `Role '${roleName}' not found in database` });
    }
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    const codeUser = await generateUniqueCode();
    const encodedCode = encodeCode(codeUser.toString());

    const user = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      mosque_id: adminUser.mosque_id, // أو req.body.mosque_id لو بدك تخليه اختياري
      birth_date: req.body.birth_date,
      code: encodedCode,
      is_save_quran: req.body.is_save_quran,
      phone: req.body.phone,
      father_phone: req.body.father_phone,
      address: req.body.address,
      certificates: req.body.certificates,
      experiences: req.body.experiences,
      memorized_parts: req.body.memorized_parts,
      role_id: role.id,
      fcm_token: req.body.fcm_token || null,
    });

    if (user.role_id == 1) {
      await Wallet.create({
        student_id: user.id,
        scores: 0,
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role_id: role.id,
        mosque_id: user.mosque_id,
        role: role.name,
      },
      SECRET_KEY
    );

    const { code,fcm_token,role_id, ...userData } = user.toJSON();
    const code_user = decodeCode(code.toString());

    res.status(201).json({ ...userData, code_user, token });
  });

/////////////////////
const registerAdmin =
  asyncHandler(async (req, res) => {
   const { error, value } = ValidateRegisterAdmin(req.body);
if (error)
  return res.status(400).json({ message: error.details[0].message });

  const roleName = "admin"
    const [
      existingMosque,
      role
    ] = await Promise.all([
      Mosque.findOne({ where: { id: req.body.mosque_id } }),
      Role.findOne({ where: { name: roleName } })
    ])
    if (!existingMosque)
      return res.status(404).json({ message: 'This mosque does not exist' })
    if (!role)
      return res.status(500).json({ message: 'Role not found in database' })

    const codeUser = await generateUniqueCode()
    const encodedCode = encodeCode(codeUser.toString())

    const user = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      mosque_id: req.body.mosque_id,
      birth_date: req.body.birth_date,
      code: encodedCode,
      is_save_quran: true,
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
        role_id: role.id,
        mosque_id: user.mosque_id,
        role: role.name
      },
      SECRET_KEY,
    )
    console.log("REGISTER SECRET_KEY:", SECRET_KEY);


    const { code,is_save_quran,father_phone,certificates,birth_date, memorized_parts,experiences,address,role_id,fcm_token, ...userData } = user.toJSON()
    const code_user = decodeCode(code.toString())

    res.status(201).json({ ...userData, code_user, token })
  })
// login(student,teacher)
const loginUser = asyncHandler(async (req, res) => {
  const { error } = ValidateLoginUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const encodedUserCode = encodeCode(req.body.code_user.toString());
  const encodedMosqueCode = encodeCode(req.body.mosque_code.toString());

  const user = await User.findOne({ where: { code: encodedUserCode } });
  if (!user) return res.status(400).json({ message: 'Invalid user code' });

  const mosque = await Mosque.findOne({ where: { code: encodedMosqueCode } });
  if (!mosque) return res.status(400).json({ message: 'Mosque not found' });

  if (user.mosque_id !== mosque.id) {
    return res.status(400).json({ message: 'Invalid mosque code' });
  }

  if (req.body.fcm_token) {
    user.fcm_token = req.body.fcm_token;
    await user.save();
  }

  const role = await Role.findOne({ where: { id: user.role_id } });

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      mosque_id: user.mosque_id,
      role: role?.name || 'unknown'
    },
    SECRET_KEY,
  );

  const { password, code, ...userData } = user.toJSON();
  const code_user = decodeCode(code.toString());

  res.status(200).json({ ...userData, code_user, token });
});

const loginSuperAdmin = async (req, res) => {
  const { error } = ValidateLoginSuperAdmin(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {

    const user = await User.findOne({
      where: { code: req.body.code_user, role_id: 4 }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid code' });
    }

    const role = await Role.findOne({ where: { id: user.role_id } });

    const token = jwt.sign(
      {
        id: user.id,
        phone: user.phone,
        role_id: user.role_id,
        role: role?.name || 'unknown'
      },
      SECRET_KEY,
    );

    res.status(200).json({
      message: 'Login successful',
        id: user.id,
      token,
    
       });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong, please try again later' });
  }
};




module.exports = {
  registerStudent: registerUserWithRole('student'),
  registerTeacher: registerUserWithRole('teacher'),
  registerAdmin,
  loginUser,
  loginSuperAdmin
}
