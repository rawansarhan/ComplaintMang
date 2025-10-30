const asyncHandler = require('express-async-handler')
const { 
  ValidateUpdateUser
} = require('../validations/userValidation')
const { User} = require('../models');
const bcrypt = require('bcryptjs');
const { where } = require('sequelize');

/////update  :
const updateUser = asyncHandler(async (req, res) => {
  try {
    const { error } = ValidateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const userId = req.params.id;
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.mosque_id !== user.mosque_id) {
      return res.status(403).json({ message: "No permission" });
    }

    // تحديث البيانات
    user.first_name = req.body.first_name || user.first_name;
    user.last_name = req.body.last_name || user.last_name;
    user.phone = req.body.phone || user.phone;
    user.father_phone = req.body.father_phone || user.father_phone;
    user.birth_date = req.body.birth_date || user.birth_date;
    user.address = req.body.address || user.address;
    user.certificates = req.body.certificates || user.certificates;
    user.experiences = req.body.experiences || user.experiences;

    if (typeof req.body.memorized_parts === 'number') {
      user.memorized_parts = req.body.memorized_parts;
    }

    if (typeof req.body.is_save_quran === 'boolean') {
      user.is_save_quran = req.body.is_save_quran;
    }

    await user.save();

    // تحويل الـ Sequelize instance إلى object عادي وفك التشفير
    const userData = user.toJSON();
    userData.code = decodeCode(userData.code); // فك تشفير الـ code

    return res.status(200).json({
      message: "User updated successfully",
      user: userData
    });

  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    });
  }  
});

///////////////////show all users
const userAllShow = asyncHandler(async (req, res) => {
  try {
    const teacher = [];
    const student = [];
    const TEACHER_ROLE_ID = 2;
    const STUDENT_ROLE_ID = 1;

    // جلب المستخدمين الذين لهم نفس mosque_id
    const users = await User.findAll({
      where: {
        mosque_id: req.user.mosque_id,
        role_id: [STUDENT_ROLE_ID, TEACHER_ROLE_ID]
      }
    });

    // فك التشفير وتصنيفهم
    users.forEach(user => {
      const decodedCode = decodeCode(user.code);
      const userData = { ...user.toJSON(), code: decodedCode };

      // إذا الدور معلم لا نعرض father_phone
      if (userData.role_id === TEACHER_ROLE_ID) {
        delete userData.father_phone;
      }

      if (user.role_id === STUDENT_ROLE_ID) {
        student.push(userData);
      } else if (user.role_id === TEACHER_ROLE_ID) {
        teacher.push(userData);
      }
    });

    return res.status(200).json({
      students: student,
      teachers: teacher
    });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    });
  }
});

function decodeCode(encoded) {
  if (!encoded) return '';
  const parts = encoded.match(/.{1,2}/g) || [];
  return parts.map(pair => decodeMap[pair] || '').join('');
}


//////////////// show by Id
const userShowById = asyncHandler(async (req, res) => {
  try {
  
    const userId = req.params.id;

    const user = await User.findOne({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role_id === 4) {
      return res.status(403).json({ message: 'this super Admin' });
    }
   if( req.user.mosque_id !== user.mosque_id){
      return res.status(404).json({message:"no permission"})
    }
    const decodedCode = user.code ? decodeCode(user.code) : null;

    return res.status(200).json({
      ...user.toJSON(),
      code: decodedCode
    });

  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    });
  }
});
///////////show my profile
//////////////// show by Id
const userShowMyProfile = asyncHandler(async (req, res) => {
  try {
  
    const userId = req.user.id;

    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role_id === 4) {
      return res.status(403).json({ message: 'this super Admin' });
    }
   if( req.user.mosque_id !== user.mosque_id){
      return res.status(404).json({message:"no permission"})
    }
    const decodedCode = user.code ? decodeCode(user.code) : null;

    return res.status(200).json({
      ...user.toJSON(),
      code: decodedCode
    });

  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    });
  }
});

/////////////////////delete (student , teacher)
const userDelete = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id

    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      return res.status(404).json({ message: 'user not found' })
    }
    if( req.user.mosque_id !== user.mosque_id){
      return res.status(404).json({message:"no permission"})
    }

    await user.destroy() 
    return res.status(200).json({
      message: 'user deleted successfully',
      user
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    })
  }
})
/////////////////////delete (admin)
const userDeleteForAdmin = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id
const AdminRole =3;
    const user = await User.findOne({ where: { id: userId ,role_id :AdminRole} })
    if (!user) {
      return res.status(404).json({ message: 'user not found' })
    }
    
    await user.destroy() 
    return res.status(200).json({
      message: 'user deleted successfully',
      user
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    })
  }
})

/////////////////////
const getAllAdmins = asyncHandler(async (req, res) => {
  try {
    const ADMIN_ROLE_ID = 3; // نفترض أن رقم دور المسؤول هو 3

    const admins = await User.findAll({
      where: { role_id: ADMIN_ROLE_ID },
      attributes: [
        'id',
        'first_name',
        'last_name',
        'phone',
        'birth_date',
        'address',
        'certificates',
        'experiences',
        'is_save_quran',
        'memorized_parts',
        'role_id',
        'mosque_id',
        'code' 
      ]
    });

    // نفك تشفير code لكل مسؤول
    const adminsDecoded = admins.map(admin => {
      return {
        ...admin.toJSON(), // نحول من instance لـ plain object
        code: decodeCode(admin.code) // نفك التشفير
      };
    });

    return res.status(200).json(adminsDecoded);

  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    });
  }
});
//////////////////////////////
const encodeMap = {
    '0': 'aa', '1': 'bb', '2': 'cc', '3': 'dd', '4': 'ee',
    '5': 'ff', '6': 'gg', '7': 'hh', '8': 'ii', '9': 'jj'
  };

  const decodeMap = Object.fromEntries(
    Object.entries(encodeMap).map(([k, v]) => [v, k])
  );

  // تشفير الكود (مثلاً 123 => "bbccdd")
  function encodeCode(code) {
    return code.toString().split('').map(d => encodeMap[d]).join('');
  }

  // فك التشفير ("bbccdd" => 123)
  function decodeCode(encoded) {
    const parts = encoded.match(/.{1,2}/g); // تقسيم كل حرفين
    return parts.map(pair => decodeMap[pair]).join('');
  }
module.exports = {
updateUser,
userAllShow,
userDelete,
userDeleteForAdmin,
userShowById,
userShowMyProfile,
getAllAdmins
}