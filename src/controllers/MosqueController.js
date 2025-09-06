const asyncHandler = require('express-async-handler')
const {
  ValidateMosqueCraete,
  ValidateMosqueUpdate
} = require('../validations/mosqueValidation')
const { Mosque, User } = require('../models')
const bcrypt = require('bcryptjs')

const mosqueCreate = asyncHandler(async (req, res) => {
  try {
    const { error } = ValidateMosqueCraete(req.body)

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      })
    }

    const existingMosque = await Mosque.findOne({
      where: {
        name: req.body.name,
        address: req.body.address
      }
    })

    if (existingMosque) {
      return res.status(409).json({
        message: 'A mosque with the same name and address already exists.'
      })
    }

    const code = await generateUniqueCode()

    const encodedCode = encodeCode(code.toString())

    const mosque = await Mosque.create({
      name: req.body.name,
      address: req.body.address,
      code: encodedCode
    })

    const mosqueNew = await Mosque.findOne({
      where: { id: mosque.id },
      attributes: { exclude: ['code'] }
    })

    return res.status(200).json({
      mosque: mosqueNew,
      code_display: code.toString(),
      message: 'Mosque created successfully'
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    })
  }
})

async function generateUniqueCode () {
  let code
  let exists = true

  while (exists) {
    code = Math.floor(100000 + Math.random() * 900000)
    const encodedCode = encodeCode(code.toString()) // شفّر الكود قبل البحث
    console.log('Generated code:', code, 'Encoded:', encodedCode)
    const mosqueWithCode = await Mosque.findOne({
      where: { code: encodedCode }
    })
    exists = !!mosqueWithCode
  }

  return code
}

//////////////////show All mosque

const mosqueAllShow = asyncHandler(async (req, res) => {
  try {
    const mosques = await Mosque.findAll({
      attributes: ['id', 'name', 'address', 'code', 'created_at', 'updated_at']
    });
   
    const results = [];

    for (const mosque of mosques) {
      const decodedCode = decodeCode(mosque.code);

      const admin = await User.findOne({
        where: { mosque_id: mosque.id, role_id: 3 },
        attributes: ['first_name', 'last_name', 'code', 'phone']
      });

      const decodedCodeAdmin = admin?.code ? decodeCode(admin.code) : null;

      const studentNum = await User.count({
        where: { mosque_id: mosque.id, role_id: 1 }
      });

      const teacherNum = await User.count({
        where: { mosque_id: mosque.id, role_id: 2 }
      });

      results.push({
        ...mosque.toJSON(),
        code: decodedCode,
        adminInf: admin
          ? {
              firstName: admin.first_name,
              lastName: admin.last_name,
              adminPhone: admin.phone,
              adminCode: decodedCodeAdmin
            }
          : "not found",
        teacherNumber: teacherNum,
        studentNumber: studentNum
      });
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    });
  }
});

const mosqueShowById = asyncHandler(async (req, res) => {
  try {
    const mosqueId = req.params.id;

    const mosque = await Mosque.findOne({
      where: { id: mosqueId },
      attributes: ['id', 'name', 'address', 'code', 'created_at', 'updated_at']
    });

    if (!mosque) {
      return res.status(404).json({ message: 'Mosque not found' });
    }

    const decodedCode = decodeCode(mosque.code);

    const admin = await User.findOne({
      where: { mosque_id: mosque.id, role_id: 3 },
      attributes: ['first_name', 'last_name', 'code', 'email', 'phone', 'address']
    });
    
    const decodeCodeAdmin = admin?.code ? decodeCode(admin.code) : null;

    const teacherNum = await User.count({ where: { mosque_id: mosque.id, role_id: 2 } });
    const studentNum = await User.count({ where: { mosque_id: mosque.id, role_id: 1 } });

    return res.status(200).json({
      ...mosque.toJSON(),
      code: decodedCode,
      adminInf: admin
        ? {
            firstName: admin.first_name,
            lastName: admin.last_name,
            adminPhone: admin.phone,
            adminCode: decodeCodeAdmin
          }
        : "not found",
      teacherNumber: teacherNum,
      studentNumber: studentNum
    });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    });
  }
});


/////update mosque
const mosqueUpdate = asyncHandler(async (req, res) => {
  try {
    const { error } = ValidateMosqueCraete(req.body)
    const mosqueId = req.params.id

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      })
    }

    let mosque = await Mosque.findOne({ where: { id: mosqueId } })
    if (!mosque) {
      return res.status(404).json({ message: 'Mosque not found' })
    }

    mosque.name = req.body.name || mosque.name
    mosque.address = req.body.address || mosque.address

    await mosque.save()

    mosque = await Mosque.findOne({
      where: { id: mosqueId },
      attributes: { exclude: ['code'] }
    })

    return res.status(200).json({
      message: 'Mosque updated successfully',
      mosque
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    })
  }
})

///////delete:
const mosqueDelete = asyncHandler(async (req, res) => {
  try {
    const mosqueId = req.params.id

    const mosque = await Mosque.findOne({ where: { id: mosqueId } })
    if (!mosque) {
      return res.status(404).json({ message: 'Mosque not found' })
    }

    await mosque.destroy()
    return res.status(200).json({
      message: 'Mosque deleted successfully',
      mosque
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    })
  }
})

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

// تشفير الكود (مثلاً 123 => "bbccdd")
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

const showStudentAndTeacher = asyncHandler(async (req, res) => {
  const Id = req.user.id
  const user = await User.findOne({ where: { id: Id } })
  const AllStudent = []
  const AllTeacher = []

  const students = await User.findAll({
    where: { mosque_id: user.mosque_id, role_id: 1 }
  })

  if (students || students.length !== 0) {
  for (const student of students) {
    AllStudent.push(student)
  }
  }

 

  const teachers = await User.findAll({
    where: { mosque_id: user.mosque_id, role_id: 2 }
  })

  if (teachers || teachers.length !== 0) {
   for (const teacher of teachers) {
    AllTeacher.push(teacher)
  }
  }

 

  return res.status(200).json({
    message: 'Fetched all students and teachers in this mosque',
    AllStudent: AllStudent,
    AllTeacher: AllTeacher
  })
})

module.exports = {
  mosqueCreate,
  mosqueAllShow,
  mosqueShowById,
  mosqueUpdate,
  mosqueDelete,
  showStudentAndTeacher
}
