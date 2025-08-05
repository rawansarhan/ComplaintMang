const asyncHandler = require('express-async-handler')
const {
  User,
  Circle,
  LessonSession,
  ExamResult,
  Exam,
  CircleUser
} = require('../models')
const {
  exam_create,
  exam_update,
  Add_marks
} = require('../validations/LessonValidation')
const { where } = require('sequelize')
const e = require('express')
const examCreate = asyncHandler(async (req, res) => {
  const { error } = exam_create(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const LessonSessionId = req.params.id;
  const lesson = await LessonSession.findOne({
    where: { id: LessonSessionId }
  });

  if (!lesson) {
    return res.status(404).json({ message: 'Lesson session not found' });
  }

  const exam = await Exam.create({
    circle_id: lesson.circle_id,
    title: req.body.title,
    date: req.body.date, 
    description: req.body.description
  });

  return res.status(200).json({
    message: 'Lesson exam created successfully',
    lessonSession: lesson,
    dataExam: exam
  });
});

/////////////// update
const examUpdate = asyncHandler(async (req, res) => {
  const { error } = exam_update(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const examId = req.params.id;
  const exam = await Exam.findOne({ where: { id: examId } });

  if (!exam) {
    return res.status(404).json({ message: 'Exam not found' });
  }

  exam.title = req.body.title || exam.title;
  exam.date = req.body.date || exam.date;
  exam.description = req.body.description || exam.description;
  await exam.save();

  return res.status(200).json({
    message: 'Exam updated successfully',
    data: exam
  });
});

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

//////////////////////////////////
/////////////////////////////////
/////Add marks for examconst 
const AddMarksCreate = asyncHandler(async (req, res) => {
  const { error } = Add_marks(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const examId = req.params.id;
  const exam = await Exam.findOne({ where: { id: examId } });
  if (!exam) {
    return res.status(404).json({ message: 'Exam not found' });
  }

  const groupOfData = req.body.data;

  try {
    const results = await Promise.all(groupOfData.map(async (entry) => {
      const user = await User.findOne({ where: { id: entry.student_id } });
      if (!user) {
        throw new Error(`Student with ID ${entry.student_id} not found`);
      }

      const circleUser = await CircleUser.findOne({
        where: { circle_id: exam.circle_id, user_id: user.id }
      });
      if (!circleUser) {
        throw new Error(`Student with ID ${entry.student_id} not found in this circle`);
      }

      const existingMark = await ExamResult.findOne({
        where: {
          exam_id: examId,
          student_id: user.id,
        }
      });

      if (existingMark) {
        if (entry.score !== undefined) existingMark.score = entry.score;
        if (entry.has_taken_exam !== undefined) existingMark.has_taken_exam = entry.has_taken_exam;
        if (entry.notes) existingMark.notes = entry.notes;
        await existingMark.save();
        return existingMark;
      }

      const newMark = await ExamResult.create({
        exam_id: examId,
        student_id: user.id,
        score: entry.score,
        has_taken_exam: entry.has_taken_exam,
        notes: entry.notes || null
      });

      return newMark;
    }));

    return res.status(200).json({
      message: 'Exam marks processed successfully',
      data: results
    });

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

//////////////////
module.exports = {
  examCreate,
  examGetAll,
  examUpdate,
  AddMarksCreate
}
