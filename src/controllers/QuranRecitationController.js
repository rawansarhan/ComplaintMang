const asyncHandler = require('express-async-handler')
const { QuranRecitation,UndividualRecitationQuran,User,Surah,Ayah,CircleSession} = require('../models')
const {
  quranRecitationValidation_update,
  quranRecitationValidation_create
} = require('../validations/QuranRecitationValidation')

const createQuranRecitation = asyncHandler(async (req, res) => {
  try {
    const { error } = quranRecitationValidation_create(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      session_id,
      student_id,
      from_sura_id,
      from_verse,
      to_sura_id,
      to_verse,
      is_counted,
      is_exam,
      attendance
    } = req.body;

    const teacherId = req.user?.id;
    if (!teacherId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [existingRecord, session, student] = await Promise.all([
      QuranRecitation.findOne({ where: { student_id, session_id } }),
      CircleSession.findByPk(session_id),
      User.findByPk(student_id)
    ]);

    if (existingRecord) {
      return res.status(409).json({
        message: 'This student already has a Quran recitation record for this session.'
      });
    }

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const newRecitation = await QuranRecitation.create({
      session_id,
      student_id,
      teacher_id: teacherId,
      from_sura_id,
      from_verse,
      to_sura_id,
      to_verse,
      is_counted,
      is_exam,
      attendance
    });

    return res.status(200).json({
      message: 'Quran recitation record created successfully.',
      data: newRecitation
    });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

////////////update
const updateQuranRecitation = asyncHandler(async (req, res) => {
  try {
    const { error } = quranRecitationValidation_update(req.body)
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      })
    }

    const IdQuranRecitation = req.params.id

    const quranRecitation = await QuranRecitation.findOne({
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
//////////////show all quranRecitation for student
const showAllRecitationsForStudent = asyncHandler(async (req, res) => {
  try {
    const studentID = req.params.id;

    const quranRecitations = await QuranRecitation.findAll({
      where: { student_id: studentID },
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' },
        { model: CircleSession, as: 'circleSession' },
        { model: Surah, as: 'fromSurah' },
        { model: Surah, as: 'toSurah' },
        { model: Ayah, as: 'fromVerse' },
        { model: Ayah, as: 'toVerse' },
      ],
      raw: true,
      nest: true
    });

    const quranRecitationsOnline = await UndividualRecitationQuran.findAll({
      where: { student_id: studentID },
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' }
      ],
      raw: true,
      nest: true
    });

    const allRecitations = [...quranRecitations, ...quranRecitationsOnline];

    if (allRecitations.length === 0) {
      return res.status(404).json({
        message: 'No Quran recitation records found for this student.'
      });
    }

    allRecitations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
     let attendance = false;
     allRecitations.forEach(element => {
      if(element === quranRecitations){
        
       return {
        day : element.c
       }
      }
      
      
     });
    return res.status(200).json({
      message: 'Retrieved all Quran recitations for the student.',
      data: allRecitations
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
