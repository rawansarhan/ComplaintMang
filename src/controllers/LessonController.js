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
/////////create session attendance for lesson
const createSession_attendance = asyncHandler(async (req, res) => {
  const { error } = session_attendance_create(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
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
////update session attendance for lesson
const updateSession_attendance = asyncHandler(async (req, res) => {
  const { error } = session_attendance_update(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
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
//// get All students for attendance
const getAllStudent = asyncHandler(async (req, res) => {
  const LessonSessionId = req.params.id
  const lesson = await LessonSession.findOne({
    where: { id: LessonSessionId }
  })
  if (!lesson) {
    res.status(404).json({ message: 'not found lesson Session' })
  }
  const Allstudent = []
  const userId = req.user.id
  const user = await User.findOne({
    where: { id: userId }
  })
  const students = await User.findAll({
    where: { mosque_id: user.mosque_id }
  })
  for (const studentId of students) {
    const lession_attendance = await LessonAttendance.findOne({
      where: {
        lesson_session_id: LessonSessionId,
        user_id: studentId
      }
    })
    if (!lession_attendance) {
      Allstudent.push(user)
    }
  }
  return res.status(200).json({
    message: 'get all student for attendance not true',
    student: Allstudent
  })
})
///////////////////////
const examCreate = asyncHandler(async (req, res) => {
  const { error } = exam_create(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }
  const LessonSessionId = req.params.id
  const lesson = await LessonSession.findOne({
    where: { id: LessonSessionId }
  })
  if (!lesson) {
    res.status(404).json({ message: 'not found lesson Session' })
  }
  const exam = await Exam.create({
    circle_id: lesson.circle_id,
    title: req.body.title,
    date: req.body.data,
    description: req.body.description
  })
  return res.status(200).json({
    message: 'create Lesson exam successfully',
    lessonSession: lesson,
    data: exam
  })
})
///////////////
const examUpdate = asyncHandler(async (req, res) => {
  const { error } = exam_update(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }
  const examId = req.params.id
  const exam = await Exam.findOne({
    where: { id: examId }
  })
  if (!exam) {
    res.status(404).json({ message: 'not found lesson exam' })
  }

  exam.title = req.body.title || exam.title
  exam.date = req.body.data || exam.data
  exam.description = req.body.description || exam.description
  await exam.save()
  return res.status(200).json({
    message: 'create Lesson exam successfully',
    lessonSession: lesson,
    data: exam
  })
})
////////All exam for circle
const examGetAll = asyncHandler(async (req, res) => {
  const circleId = req.params.id
  const circle = await Circle.findOne({
    where: { id: circleId }
  })
  if (!circle) {
    res.status(404).json({ message: 'not found circle' })
  }
  const exams = await Exam.findAll({
    where: { circle_id: circleId }
  })
  return res.status(200).json({
    message: 'get All exam for the circle',
    data: exams
  })
})
/////Add marks for examconst 
const AddMarksCreate = asyncHandler(async (req, res) => {
  const { error } = Add_marks(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const examId = req.params.id;
  const exam = await Exam.findOne({ where: { id: examId } });
  if (!exam) {
    return res.status(404).json({ message: 'not found lesson exam' });
  }

  const groupOfData = req.body.data;

  try {
    const datas = await Promise.all(groupOfData.map(async (data) => {
      const user = await User.findOne({ where: { id: data.student_id } });
      if (!user) {
        throw new Error(`Student with ID ${data.student_id} not found`);
      }

      const examMarks = await ExamResult.findOne({
        where: {
          exam_id: examId,
          student_id: user.id,
        }
      });

      if (examMarks) {
        if (data.score !== undefined) {
          examMarks.score = data.score;
        }
        if (data.has_taken_exam !== undefined) {
          examMarks.has_taken_exam = data.has_taken_exam;
        }
        await examMarks.save();
        return examMarks;
      }

      const result = await ExamResult.create({
        exam_id: examId,
        student_id: user.id,
        score: data.score,
        has_taken_exam: data.has_taken_exam
      });

      return result;
    }));

    return res.status(200).json({
      message: 'All exam marks have been processed successfully',
      data: datas
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

////////////////////////
module.exports = {
  examCreate,
  examGetAll,
  examUpdate,
  getAllStudent,
  updateSession_attendance,
  createSession_attendance,
  createLessonSession,
  updateLessonSession,
  GetAllSessionesLession,
  AddMarksCreate
}
