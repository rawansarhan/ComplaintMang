const asyncHandler = require('express-async-handler');
const { quranRecitationValidationOnline_create,
quranRecitationValidationOnline_update } = require('../validations/quranRecitationOnlineValidation');
const { User, Role, Mosque, Circle, CircleUser,CircleType,CircleSession,UndividualRecitationQuran}= require('../models')
const createQuranRecitationOnline = asyncHandler(async (req, res) => {
  try {
    const { error } = quranRecitationValidationOnline_create(req.body)
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      })
    }
     const {
      student_id,

    } = req.body;
 const [existingRecord, student] = await Promise.all([
      UndividualRecitationQuran.findOne({ where: { student_id } }),
      User.findByPk(student_id)
    ]);


    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const teacherId = req.user.id

    const newRecitation = await UndividualRecitationQuran.create({
      student_id: req.body.student_id,
      teacher_id: teacherId,
      from_sura_id: req.body.from_sura_id,
      from_verse_id: req.body.from_verse,
      to_sura_id: req.body.to_sura_id,
      to_verse_id: req.body.to_verse,
      is_counted: req.body.is_counted,
      is_exam: req.body.is_exam,
       date : req.body.date,
       new_pages : req.body.new_pages
    })

    return res.status(200).json({
      message: 'Quran recitation Online record created successfully.',
      data: newRecitation
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Internal server error',
      details: err.message
    })
  }
})

////////////update
const updateQuranRecitationOnline = asyncHandler(async (req, res) => {
  try {
    const { error } = quranRecitationValidationOnline_update(req.body)
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      })
    }

    const IdQuranRecitation = req.params.id

    const quranRecitation = await UndividualRecitationQuran.findOne({
      where: { id: IdQuranRecitation }
    })

    if (!quranRecitation) {
      return res
        .status(404)
        .json({ message: 'Quran recitation record not found.' })
    }

    if (req.body.from_sura_id !== undefined)
      quranRecitation.from_sura_id = req.body.from_sura_id
    if (req.body.from_verse !== undefined)
      quranRecitation.from_verse = req.body.from_verse
    if (req.body.to_sura_id !== undefined)
      quranRecitation.to_sura_id = req.body.to_sura_id
    if (req.body.to_verse !== undefined)
      quranRecitation.to_verse = req.body.to_verse
    if (req.body.is_counted !== undefined)
      quranRecitation.is_counted = req.body.is_counted
    if (req.body.is_exam !== undefined)
      quranRecitation.is_exam = req.body.is_exam
if (req.body.date !== undefined)
      quranRecitation.date = req.body.date
if (req.body.new_pages !== undefined)
      quranRecitation.new_pages = req.body.new_pages
    await quranRecitation.save()

    return res.status(200).json({
      message: 'Quran recitation record updated successfully.',
      data: quranRecitation
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
createQuranRecitationOnline,
updateQuranRecitationOnline
  
}
