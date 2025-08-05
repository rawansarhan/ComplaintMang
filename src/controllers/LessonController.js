const asyncHandler = require('express-async-handler')
const {
  User,
  Role,
  Mosque,
  Circle,
  CircleUser,
  CircleType,
  LessonAttendance,
  HadithBook,
  LessonSession,
  ExamResult
} = require('../models')
const {
  SessionLesson_create,
  session_attendance_create,
  SessionLesson_update,
  session_attendance_update,
  exam_create,
  exam_update,
  Add_marks
} = require('../validations/LessonValidation')
const { where } = require('sequelize')
const Exam = require('../models/Exam')
const e = require('express')
const { date } = require('joi')

/// create lesson session
const createLessonSession = asyncHandler(async (req, res) => {
  const { error } = SessionLesson_create(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }
  const CircleId = req.params.id
  const circle = await Circle.findOne({
    where: { id: CircleId }
  })
  if (!circle) {
    return res.status(404).json('circle not found')
  }
  const LessonCreate = await LessonSession.create({
    circle_id: CircleId,
    date: req.body.date,
    title: req.body.title,
    description: req.body.description
  })
  return res.status(200).json({
    message: 'Lesson session created successfully',
    date: LessonCreate
  })
})
/// update lesson session
const updateLessonSession = asyncHandler(async (req, res) => {
  const { error } = SessionLesson_update(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  const LessonSessionId = req.params.id
  const lesson = await LessonSession.findOne({ where: { id: LessonSessionId } })

  if (!lesson) {
    return res.status(404).json({ message: 'Lesson session not found' })
  }

  lesson.date = req.body.date || lesson.date
  lesson.title = req.body.title || lesson.title
  lesson.description = req.body.description || lesson.description
  await lesson.save()

  return res.status(200).json({
    message: 'Lesson session updated successfully',
    data: lesson
  })
})

//////get all session for lession
const GetAllSessionesLession = asyncHandler(async (req, res) => {
  const circleId = req.params.id
  const circle = await Circle.findOne({
    where: { id: circleId }
  })
  if (!circle) {
    return res.status(404).json('circle not found')
  }
  const lessonSession = await LessonSession.findAll({
    where: { circle_id: circleId }
  })
  if (lessonSession.length === 0) {
    return res.status(404).json('No lesson sessions found')
  }

  return res.status(200).json({
    message: 'All lesson sessions retrieved successfully',
    data: lessonSession
  })
})
/////////////////////////////////////////////
////////////////////////////////////////////
/////////create session attendance for lesson
const createSession_attendance = asyncHandler(async (req, res) => {
  const { error } = session_attendance_create(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const LessonSessionId = req.params.id
  const lesson = await LessonSession.findOne({
    where: { id: LessonSessionId }
  })
  if (!lesson) {
    res.status(404).json({ message: 'not found lesson Session' })
  }
  const Allstudent = []
  const students = req.body.student_id

  for (const studentId of students) {
    const user = await User.findOne({
      where: { id: studentId }
    })
    if (!user) {
      return res.status(404).json({ message: 'not found studen id' })
    }
    const circleUser = await CircleUser.findOne({
      where : { circle_id : lesson.circle_id , user_id : studentId}
    })
     if(  !circleUser){
      return res.status(404).json({ message: 'not found studen in this circle' })

     }
    const lession_attendance = await LessonAttendance.findOne({
      where: {
        lesson_session_id: LessonSessionId,
        user_id: studentId
      }
    })
    if (!lession_attendance) {
      await LessonAttendance.create({
        lesson_session_id: LessonSessionId,
        user_id: studentId
      })
      Allstudent.push(user)
    }
  }

  return res.status(200).json({
    message: 'create Lesson Attendance successfully',
    lessonSession: lesson,
    student: Allstudent
  })
})
////////////////////////////////////////
///////////////////////////////////////
//// get All students 
const getAllStudent = asyncHandler(async (req, res) => {
  const LessonSessionId = req.params.id;

  const lesson = await LessonSession.findOne({ where: { id: LessonSessionId } });
  if (!lesson) {
    return res.status(404).json({ message: 'Lesson session not found' });
  }

  const currentUserId = req.user.id;
  const currentUser = await User.findOne({ where: { id: currentUserId } });

  const students = await User.findAll({
    where: {
       mosque_id: currentUser.mosque_id ,
        role_id : 1
      }
  });

  const studentsWithoutAttendance = [];

  for (const student of students) {
    const attendance = await LessonAttendance.findOne({
      where: {
        lesson_session_id: LessonSessionId,
        user_id: student.id
      }
    });

    if (!attendance) {
      studentsWithoutAttendance.push(student);
    }
  }

  return res.status(200).json({
    message: 'Students without attendance retrieved successfully',
    students: studentsWithoutAttendance
  });
});
//////
module.exports = {
  createSession_attendance,
  getAllStudent,
  createLessonSession,
  updateLessonSession,
  GetAllSessionesLession,
}
