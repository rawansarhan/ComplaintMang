const asyncHandler = require('express-async-handler')
const { QuranRecitation,UndividualRecitationQuran,User,SessionAttendance,Surah,Ayah,CircleSession,Circle} = require('../models')
const {
  quranRecitationValidation_update,
  quranRecitationValidation_create
} = require('../validations/QuranRecitationValidation')
const dayjs = require('dayjs');
require("dayjs/locale/ar");
dayjs.locale("ar");

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

    // تحقق من نطاق السور (يفترض البداية <= النهاية)
    if (from_sura_id > to_sura_id) {
      return res.status(400).json({ message: "Invalid surah range" });
    }
    
    const [existingRecord, session, student] = await Promise.all([
      QuranRecitation.findOne({ where: { student_id, session_id } }),
      CircleSession.findOne({
        where: { id: session_id },
        include: [{ model: Circle, as: 'circle' }]
      }),
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

    if (!session.circle) {
      return res.status(400).json({ message: "Session does not belong to any circle" });
    }

    if (session.circle.circle_type_id !== 1) {
      return res.status(400).json({ message: "This circle is not a Quran circle" });
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
if (newRecitation.attendance === true){
  const session_attendances = await SessionAttendance.findOne({
    where : { 
      session_id:session.id,
      user_id :student_id
     }
  })
  if(!session_attendances){
const SessionAttendance = await SessionAttendance.create({
   session_id:session.id,
      user_id :student_id
})
  }
}
    return res.status(201).json({
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
    const { error } = quranRecitationValidation_update(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const IdQuranRecitation = req.params.id;

    const quranRecitation = await QuranRecitation.findOne({
      where: { id: IdQuranRecitation }
    });

    if (!quranRecitation) {
      return res.status(404).json({ message: 'Quran recitation record not found.' });
    }

    const { from_sura_id, to_sura_id, from_verse, to_verse } = req.body;

    if (from_sura_id !== undefined && to_sura_id !== undefined) {
      if (from_sura_id > to_sura_id) {
        return res.status(400).json({ message: "Invalid surah range" });
      }

      if (from_sura_id === to_sura_id && from_verse !== undefined && to_verse !== undefined) {
        if (from_verse > to_verse) {
          return res.status(400).json({ message: "Invalid ayah range" });
        }
      }
    }

    if (from_sura_id !== undefined) quranRecitation.from_sura_id = from_sura_id;
    if (from_verse !== undefined) quranRecitation.from_verse = from_verse;
    if (to_sura_id !== undefined) quranRecitation.to_sura_id = to_sura_id;
    if (to_verse !== undefined) quranRecitation.to_verse = to_verse;
    if (req.body.is_counted !== undefined) quranRecitation.is_counted = req.body.is_counted;
    if (req.body.is_exam !== undefined) quranRecitation.is_exam = req.body.is_exam;

    await quranRecitation.save();

    return res.status(200).json({
      message: 'Quran recitation record updated successfully.',
      data: quranRecitation
    });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Internal server error',
      details: err.message
    });
  }
});

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
        { model: User, as: 'teacher' },
         { model: Surah, as: 'fromSurah' },
        { model: Surah, as: 'toSurah' },
        { model: Ayah, as: 'fromVerse' },
        { model: Ayah, as: 'toVerse' },
      ],
      raw: true,
      nest: true
    });

    const allRecitations = [...quranRecitations, ...quranRecitationsOnline];

    if (allRecitations.length === 0) {
      return res.json({
        message: 'No Quran recitation records found for this student.'
      });
    }

    // sort desc by created_at
    allRecitations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const resultsQuran = allRecitations.map(element => {
      const dateObj = dayjs(element.date);
      return {
        date: dateObj.format("YYYY-MM-DD"),
        day: dateObj.format("dddd"),
        attendance: !!element.circleSession, // true إذا كان داخل الحلقة
        fromSurahName: element.fromSurah?.name || null,
        fromAyah: element.fromVerse?.ayah_number || null,
        toSurahName: element.toSurah?.name || null,
        toAyah: element.toVerse?.ayah_number || null,
      };
    });

    return res.status(200).json({
      message: 'Retrieved all Quran recitations for the student.',
      studentID,
      studentFirstName: allRecitations[0]?.student?.first_name || null,
      studentLastName: allRecitations[0]?.student?.last_name || null,
      data: resultsQuran
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
