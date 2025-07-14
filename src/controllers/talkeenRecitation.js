const asyncHandler = require('express-async-handler')
const { QuranRecitation,UndividualRecitationQuran,User,Surah,Ayah,CircleSession,QuranTalkeen} = require('../models')
const {
  ValidateUpdateHadithRecitation,
  ValidateCreateHadithRecitation
} = require('../validations/TalkeenRecitation')

const createQuranRecitation = asyncHandler(async (req, res) => {
  try {
    const { error } = ValidateCreateHadithRecitation(req.body)
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      })
    }

    const existingRecord = await QuranRecitation.findOne({
      where: {
        student_id: req.body.student_id,
        session_id: req.body.session_id
      }
    })

    if (existingRecord) {
      return res.status(409).json({
        message:
          'This student already has a Quran Talkeen recitation record for this session.'
      })
    }
   const student = await User.findByPk(req.body.student_id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const session = await CircleSession.findByPk(req.body.session_id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }
    const teacherId = req.user.id
   
    const newRecitation = await QuranTalkeen.create({
      session_id: req.body.session_id,
      student_id: req.body.student_id,
      teacher_id: teacherId,
      from_sura_id: req.body.from_sura_id,
      from_verse: req.body.from_verse,
      to_sura_id: req.body.to_sura_id,
      to_verse: req.body.to_verse,
      attendance: req.body.attendance
    })

    return res.status(200).json({
      message: 'Quran Talkeen recitation record created successfully.',
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
const updateQuranRecitation = asyncHandler(async (req, res) => {
  try {
    const { error } = ValidateUpdateHadithRecitation(req.body)
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      })
    }

    const IdQuranRecitation = req.params.id

    const quranRecitation = await QuranTalkeen.findOne({
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

    await quranRecitation.save()

    return res.status(200).json({
      message: 'Quran Talkeen recitation record updated successfully.',
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
//////////////show all quranRecitation for student
const showAllRecitationsForStudent = asyncHandler(async (req, res) => {
  try {
    const studentID = req.params.id;

    const quranRecitations = await QuranTalkeen.findAll({
      where: { student_id: studentID },
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' },
        { model: CircleSession, as: 'session' },
        { model: Surah, as: 'from_sura' },
        { model: Surah, as: 'to_sura' },
        { model: Ayah, as: 'from_ayah' },
        { model: Ayah, as: 'to_ayah' },
      ],
      raw: true,
      nest: true
    });


    if (quranRecitations.length === 0) {
      return res.status(404).json({
        message: 'No Quran recitation records found for this student.'
      });
    }


    return res.status(200).json({
      message: 'Retrieved all Quran recitations for the student.',
      data: quranRecitations
    });

  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Internal server error',
      details: err.message
    });
  }
});


module.exports = {
  createQuranRecitation,
  updateQuranRecitation,
  showAllRecitationsForStudent
}
