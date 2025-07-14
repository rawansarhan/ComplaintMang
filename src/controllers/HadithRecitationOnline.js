const asyncHandler = require('express-async-handler')
const {
  HadithBook,
  CircleType,
  HadithRecitation,
  UndividualRecitationHadith,
  User
} = require('../models')
const { where, Op } = require('sequelize')
const {
  HadithRecitationValidationOnline_create,
  HadithRecitationValidationOnline_update
} = require('../validations/hadithRecitationOnlineValidation')

const createHadithRecitationOnline = asyncHandler(async (req, res) => {
    const { error } = HadithRecitationValidationOnline_create(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }
    const teacherId = req.user.id
    const teacher = await User.findOne({ where: { id: teacherId } })

    const book = await HadithBook.findOne({
      where: {
        id: req.body.book_id,
        mosque_id: teacher.mosque_id
      }
    })

    if (!book) {
      return res.status(404).json({ message: 'Not found Hadith Book' })
    }

    if (req.body.from_hadith > book.pages_num) {
      return res.status(403).json({
        message: `'from_hadith' (${req.body.from_hadith}) exceeds max hadith number in the book (${book.pages_num})`
      })
    }

    if (req.body.to_hadith > book.pages_num) {
      return res.status(403).json({
        message: `'to_hadith' (${req.body.to_hadith}) exceeds max hadith number in the book (${book.pages_num})`
      })
    }

    if (req.body.to_hadith < req.body.from_hadith) {
      return res.status(403).json({
        message: `'to_hadith' (${req.body.to_hadith}) cannot be less than 'from_hadith' (${req.body.from_hadith})`
      })
    }

    const student = await User.findOne({
      where: { id: req.body.student_id }
    })

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    if (student.role_id !== 1 || student.mosque_id !== book.mosque_id) {
      return res.status(403).json({
        message:
          'Student is either invalid or not from the same mosque as the book'
      })
    }

    const newRecitation = await UndividualRecitationHadith.create({
      student_id: req.body.student_id,
      book_id: req.body.book_id,
      teacher_id: teacherId,
      from_hadith_number: req.body.from_hadith,
      to_hadith_number: req.body.to_hadith,
      is_counted:req.body.is_counted,
      is_exam: req.body.is_exam,
      date: req.body.date
    })

    return res.status(200).json({
      message: 'Hadith recitation record created successfully.',
      data: newRecitation
    })
  
})

///////////////////////update
const updateHadithRecitationOnline = asyncHandler(async (req, res) => {
  try {
    const { error } = HadithRecitationValidationOnline_update(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    const IdHadithRecitation = req.params.id

    const hadithRecitation = await UndividualRecitationHadith.findOne({
      where: { id: IdHadithRecitation }
    })

    if (!hadithRecitation) {
      return res
        .status(404)
        .json({ message: 'Hadith recitation record not found.' })
    }

    const book = await HadithBook.findOne({
      where: { id: hadithRecitation.book_id }
    })

    if (!book) {
      return res.status(404).json({ message: 'Hadith book not found.' })
    }

    const fromHadith =
      req.body.from_hadith ?? hadithRecitation.from_hadith_number
    const toHadith = req.body.to_hadith ?? hadithRecitation.to_hadith_number

    if (fromHadith > book.pages_num) {
      return res.status(403).json({
        message: `'from_hadith' (${fromHadith}) exceeds max hadith number in the book (${book.pages_num})`
      })
    }

    if (toHadith > book.pages_num) {
      return res.status(403).json({
        message: `'to_hadith' (${toHadith}) exceeds max hadith number in the book (${book.pages_num})`
      })
    }

    if (toHadith < fromHadith) {
      return res.status(403).json({
        message: `'to_hadith' (${toHadith}) cannot be less than 'from_hadith' (${fromHadith})`
      })
    }

    if (req.body.from_hadith !== undefined)
      hadithRecitation.from_hadith_number = req.body.from_hadith

    if (req.body.to_hadith !== undefined)
      hadithRecitation.to_hadith_number = req.body.to_hadith

    if (req.body.is_counted !== undefined)
      hadithRecitation.is_counted = req.body.is_counted

    if (req.body.is_exam !== undefined)
      hadithRecitation.is_exam = req.body.is_exam

    await hadithRecitation.save()

    return res.status(200).json({
      message: 'Hadith recitation record updated successfully.',
      data: hadithRecitation
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Internal server error',
      details: err.message
    })
  }
})

module.exports = {
  createHadithRecitationOnline,
  updateHadithRecitationOnline
}
