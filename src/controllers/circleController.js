const asyncHandler = require('express-async-handler')
const { User, Role, Mosque, Circle, CircleUser,CircleType ,ExamResult ,Exam} = require('../models')
const {
  ValidateCreateCircles,
  ValidateUpdateCircles,
  ValidateDeleteCircles
} = require('../validations/circlesValidation')
const { where, Op } = require('sequelize')
const { date } = require('joi')
///////////////create
const createCircle = asyncHandler(async (req, res) => {
  const { error } = ValidateCreateCircles(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  const mosqueId = req.user.mosque_id // ← مأخوذة من الـ JWT أو session

  const existingMosque = await Mosque.findByPk(mosqueId)
  if (!existingMosque) {
    return res.status(404).json({ message: 'This mosque does not exist' })
  }
const circleType = await CircleType.findOne({
  where :{id: req.body.circle_type_id}
})
if(!circleType){
  return res.status(404).json({message:"not found the circle type"})
}
  const circle = await Circle.create({
    mosque_id: mosqueId,
    circle_type_id: req.body.circle_type_id,
    description: req.body.description,
    name: req.body.name
  })

  const students = []
  for (const studentId of req.body.student_id || []) {
    const student = await User.findByPk(studentId)
    if(!student){
      return res.status(404).json({message:"not found student " ,studentId})
    }
    if (student && student.role_id === 1) {
      const circle_user = await CircleUser.create({
        circle_id: circle.id,
        user_id: student.id,
        role_id: student.role_id
      })
      students.push(circle_user.user_id)
    }
  }

  const teachers = []
  for (const teacherId of req.body.teacher_id || []) {
    const teacher = await User.findByPk(teacherId)
      if(!teacher){
      return res.status(404).json({message:"not found teacher " ,teacherId})
    }
    if (teacher && teacher.role_id === 2) {
      const circle_user = await CircleUser.create({
        circle_id: circle.id,
        user_id: teacher.id,
        role_id: teacher.role_id
      })
      teachers.push(circle_user.user_id)
    }
  }

  return res.status(200).json({
    message: 'Created the circle successfully',
    circle,
    teachers,
    students
  })
})
///////////update
const updateCircle = asyncHandler(async (req, res) => {
  const { error } = ValidateUpdateCircles(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }
  const circleId = req.params.id

  let circle = await Circle.findOne({ where: { id: circleId } })
  if (!circle) {
    return res.status(404).json({ message: 'Circle not found' })
  }
 if(req.user.mosque_id !== circle.mosque_id){
 return res.status(404).json({message:"no permission"})
 }
  circle.name = req.body.name || circle.name
  circle.description = req.body.description || circle.description
  circle.circle_type_id = req.body.circle_type_id || circle.circle_type_id
  await circle.save()

  const students = []
  for (const studentId of req.body.student_id || []) {
    const student = await User.findByPk(studentId)
     if(!student){
      return res.status(404).json({message:"not found student " ,studentId})
    }
    if (student && student.role_id === 1) {
      const exists = await CircleUser.findOne({
        where: { circle_id: circle.id, user_id: student.id }
      })
      if (!exists) {
        await CircleUser.create({
          circle_id: circle.id,
          user_id: student.id,
          role_id: student.role_id
        })
      }
      students.push(student.id)
    }
  }

  const teachers = []
  for (const teacherId of req.body.teacher_id || []) {
    const teacher = await User.findByPk(teacherId)
     if(!teacher){
      return res.status(404).json({message:"not found teacher " ,teacherId})
    }
    if (teacher && teacher.role_id === 2) {
      const exists = await CircleUser.findOne({
        where: { circle_id: circle.id, user_id: teacher.id }
      })
      if (!exists) {
        await CircleUser.create({
          circle_id: circle.id,
          user_id: teacher.id,
          role_id: teacher.role_id
        })
      }
      teachers.push(teacher.id)
    }
  }

  return res.status(200).json({
    message: 'Updated the circle successfully',
    circle,
    teachers,
    students
  })
})
////delete circle_user
const deleteCircleUser = asyncHandler(async (req, res) => {
  try {
    const { error } = ValidateDeleteCircles(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    const circleId = req.params.id
    const userId = req.body.user_id

    const circle_user = await CircleUser.findOne({
      where: { circle_id: circleId, user_id: userId }
    })
    if (!circle_user) {
      return res.status(404).json({ message: 'User not found in this circle' })
    }

    await circle_user.destroy()

    return res.status(200).json({
      message: 'User removed from the circle successfully',
      circle_user
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    })
  }
})
////delete circle
const deleteCircle = asyncHandler(async (req, res) => {
  try {
    const circleId = req.params.id

    const circle = await Circle.findOne({
      where: { id: circleId }
    })
    if (!circle) {
      return res.status(404).json({ message: 'User not found in this circle' })
    }

    await circle.destroy()

    return res.status(200).json({
      message: 'User removed from the circle successfully',
      circle
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    })
  }
})

/////show circle with id

const showAll = asyncHandler(async (req, res) => {
  try {
    const TEACHER_ROLE_ID = 2
    const STUDENT_ROLE_ID = 1

    const circles = await Circle.findAll({
      include: [
        {
          model: User,
          as: 'users',
          through: { attributes: ['role_id'] }
        }
      ]
    })
   if(circles.length === 0){
    return res.status(200).json({ message: "Not found circles " });

     }
    const formatted = circles.map(circle => {
      const teachers = []
      const students = []

      circle.users.forEach(user => {
        if (user.CircleUser.role_id === TEACHER_ROLE_ID) {
          teachers.push(user)
        } else if (user.CircleUser.role_id === STUDENT_ROLE_ID) {
          students.push(user)
        }
      })

      return {
        id: circle.id,
        name: circle.name,
        description: circle.description,
        teachers,
        students
      }
    })

    return res.status(200).json({ circles: formatted })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    })
  }
})

//////show with ID
const showWithId = asyncHandler(async (req, res) => {
  try {
    const circleId = parseInt(req.params.id, 10)
    if (isNaN(circleId)) {
      return res.status(400).json({ message: 'Invalid circle ID' })
    }

    const TEACHER_ROLE_ID = 2
    const STUDENT_ROLE_ID = 1

    const circle = await Circle.findOne({
      where: { id: circleId },
      include: [
        {
          model: User,
          as: 'users',
          through: { attributes: ['role_id'] }
        }
      ]
    })

    if (!circle) {
      return res.status(404).json({ message: 'Circle not found' })
    }

    const teachers = []
    const students = []

    circle.users.forEach(user => {
      if (user.CircleUser.role_id === TEACHER_ROLE_ID) {
        teachers.push(user)
      } else if (user.CircleUser.role_id === STUDENT_ROLE_ID) {
        students.push(user)
      }
    })

    return res.status(200).json({
      id: circle.id,
      name: circle.name,
      description: circle.description,
      typeCircle_id:circle.circle_type_id,
      teachers,
      students
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    })
  }
})
///show circle for teacher
const show_circle_for_teacher = asyncHandler(async (req, res) => {
  try {
    const TEACHER_ROLE_ID = 2;
    const STUDENT_ROLE_ID = 1;

    const circles = await Circle.findAll({
      include: [
        {
          model: User,
          as: 'users',
          through: { attributes: ['role_id'] },
           attributes: {
            exclude: ['password'] 
          }
        }
      ]
    });
   if(circles.length === 0){
    return res.status(200).json({ message: "No circles found for this teacher" });

     }
    const teacherCircles = circles.filter(circle =>
      circle.users.some(user =>
        user.id === req.user.id && user.CircleUser.role_id === TEACHER_ROLE_ID
      )
    );

    const formatted = teacherCircles.map(circle => {
      const students = circle.users.filter(
        user => user.CircleUser.role_id === STUDENT_ROLE_ID
      ) .map(student => {
          return {
             id: student.id,
          mosque_id: student.mosque_id,
          first_name: student.first_name,
          last_name: student.last_name,
          phone: student.phone,
          father_phone: student.father_phone,
          birth_date: student.birth_date,
          email: student.email,
          address: student.address,
          certificates: student.certificates,
          code: student.code,
          experiences: student.experiences,
          memorized_parts: student.memorized_parts,
          role_id: student.role_id,
          is_save_quran: student.is_save_quran
          };
        });
      
      return {
        id: circle.id,
        name: circle.name,
        typeCircle:circle.circle_type_id,
        description:circle.description,
        students
      };
    });

    return res.status(200).json({ circles: formatted });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    });
  }
});

///show circle for teacher 
const showCircleTypeForTeacher = asyncHandler(async (req, res) => {
  try {
    const TEACHER_ROLE_ID = 2;
    const STUDENT_ROLE_ID = 1;

    const circleTypes = await CircleType.findAll({
      where: {
        id: { [Op.ne]: 4 } 
      }
    });

    const result = await Promise.all(circleTypes.map(async (type) => {
      const circles = await Circle.findAll({
        where: { circle_type_id: type.id },
        include: [
          {
            model: User,
            as: 'users',
            through: { attributes: ['role_id'] }
          }
        ]
      });
   if(circles.length === 0){
    return res.status(200).json({ message: "No circles found for this teacher"});

     }
      const teacherCircles = circles.filter(circle =>
        circle.users.some(user =>
          user.id === req.user.id && user.CircleUser.role_id === TEACHER_ROLE_ID
        )
      );

      const formattedCircles = teacherCircles.map(circle => {
        const students = circle.users.filter(user => user.CircleUser.role_id === STUDENT_ROLE_ID);
        return {
          id: circle.id,
          name: circle.name,
          typeCircle: circle.circle_type_id,
          description: circle.description,
          students: students.map(student => ({
             id: student.id,
          mosque_id: student.mosque_id,
          first_name: student.first_name,
          last_name: student.last_name,
          phone: student.phone,
          father_phone: student.father_phone,
          birth_date: student.birth_date,
          email: student.email,
          address: student.address,
          certificates: student.certificates,
          code: student.code,
          experiences: student.experiences,
          memorized_parts: student.memorized_parts,
          role_id: student.role_id,
          is_save_quran: student.is_save_quran
          }))
        };
      });

      return {
        type: type.name,
        circles: formattedCircles 
      };
    }));

    return res.status(200).json({ data: result });

  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    });
  }
});
/////////show circle for teacher(dars)
const show_Circle_Teacher_Dars = asyncHandler(async (req, res) => {
  try {
    const TEACHER_ROLE_ID = 2;
    const STUDENT_ROLE_ID = 1;

    const circleTypes = await CircleType.findAll({
      where: {
        id: { [Op.notIn]: [1,2,3] } 
      }
    });

    const result = await Promise.all(circleTypes.map(async (type) => {
      const circles = await Circle.findAll({
        where: { circle_type_id: type.id },
        include: [
          {
            model: User,
            as: 'users',
            through: { attributes: ['role_id'] }
          }
        ]
      });
     if(circles.length === 0){
    return res.status(200).json({ message: "No circles Dars found for this teacher"});

     }
      const teacherCircles = circles.filter(circle =>
        circle.users.some(user =>
          user.id === req.user.id && user.CircleUser.role_id === TEACHER_ROLE_ID
        )
      );

      const formattedCircles = teacherCircles.map(circle => {
        const students = circle.users.filter(user => user.CircleUser.role_id === STUDENT_ROLE_ID);
        return {
          id: circle.id,
          name: circle.name,
          typeCircle: circle.circle_type_id,
          description: circle.description,
          students: students.map(student => ({
          id: student.id,
          mosque_id: student.mosque_id,
          first_name: student.first_name,
          last_name: student.last_name,
          phone: student.phone,
          father_phone: student.father_phone,
          birth_date: student.birth_date,
          email: student.email,
          address: student.address,
          certificates: student.certificates,
          code: student.code,
          experiences: student.experiences,
          memorized_parts: student.memorized_parts,
          role_id: student.role_id,
          is_save_quran: student.is_save_quran
          }))
        };
      });

      return {
        type: type.name,
        circles: formattedCircles 
      };
    }));

    return res.status(200).json({ data: result });

  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    });
  }
});
///////////////////////show circle Dars for student 
const showCircleDarsForStudent = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const circlesUser = await CircleUser.findAll({
    where: { user_id: studentId }
  });

  if (circlesUser.length === 0) {
    return res.status(200).json({ message: "not found circle for this student" });
  }

  const circleIds = circlesUser.map(cu => cu.circle_id);

  const circles = await Circle.findAll({
    where: {
      id: circleIds,
      circle_type_id: 4
    }
  });

  return res.status(200).json({
    message: " All circle for type Dars",
    circles
  });
});
////// get All circle Dars For Student With Exam

const getAllcircleDarsForStudentWithExam = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const circlesUser = await CircleUser.findAll({
    where: { user_id: studentId },
  });

  if (circlesUser.length === 0) {
    return res.status(200).json({ message: "No circles found for this student"});
  }

  const circleIds = circlesUser.map((cu) => cu.circle_id);

  const circles = await Circle.findAll({
    where: {
      id: circleIds,
      circle_type_id: 4,
    },
    attributes: ["id", "name"],
  });

  if (circles.length === 0) {
    return res.status(200).json({ message: "No Dars circles found" });
  }

  const AllCircles = [];
  for (const circle of circles) {
    const exams = await Exam.findAll({
      where: { circle_id: circle.id },
    });

    AllCircles.push({
       circle_id: circle.id,
      circle_name: circle.name,
      exams_count: exams.length,
    });
  }

  return res.status(200).json({
    message: "All Dars circles with exam count",
    AllCircles,
  });
});
module.exports = {
  createCircle,
  updateCircle,
  deleteCircle,
  showWithId,
  showAll,
  show_circle_for_teacher,
  deleteCircleUser,
  showCircleTypeForTeacher,
  show_Circle_Teacher_Dars,
  showCircleDarsForStudent,
  getAllcircleDarsForStudentWithExam,
  
}
