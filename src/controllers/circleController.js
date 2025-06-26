const asyncHandler = require('express-async-handler')
const { User, Role, Mosque, Circle, CircleUser } = require('../models')
const {
  ValidateCreateCircles,
  ValidateUpdateCircles,
  ValidateDeleteCircles
} = require('../validations/circlesValidation')
const { where } = require('sequelize')
///////////////create
const createCircle = asyncHandler(async (req, res) => {
  const { error } = ValidateCreateCircles(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  const mosqueId = req.user.mosque_id // ← مأخوذة من الـ JWT أو session

  const existingMosque = await Mosque.findByPk(mosqueId)
  if (!existingMosque) {
    return res.status(404).json({ message: 'This mosque does not exist' })
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
          through: { attributes: ['role_id'] }
        }
      ]
    });

    const teacherCircles = circles.filter(circle =>
      circle.users.some(user =>
        user.id === req.user.id && user.CircleUser.role_id === TEACHER_ROLE_ID
      )
    );

    const formatted = teacherCircles.map(circle => {
      const students = circle.users.filter(
        user => user.CircleUser.role_id === STUDENT_ROLE_ID
      );
      
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

module.exports = {
  createCircle,
  updateCircle,
  deleteCircle,
  showWithId,
  showAll,
  show_circle_for_teacher,
  deleteCircleUser
}
