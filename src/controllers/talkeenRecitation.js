const asyncHandler = require('express-async-handler')
const { QuranRecitation,UndividualRecitationQuran,User,Surah,Ayah,CircleSession,Circle,QuranTalkeen} = require('../models')
const {
  TalkeenRecitationValidation_create,
  TalkeenRecitationValidation_update
} = require('../validations/TalkeenRecitation')
const dayjs = require('dayjs');
require("dayjs/locale/ar");
dayjs.locale("ar");
const createQuranRecitation = asyncHandler(async (req, res) => {
  try {
    const { error } = TalkeenRecitationValidation_create(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { session_id, student_id, from_sura_id, from_verse, to_sura_id, to_verse, attendance } = req.body;

    const teacherId = req.user?.id;
    if (!teacherId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingRecord = await QuranTalkeen.findOne({
      where: { student_id, session_id }
    });
    if (existingRecord) {
      return res.status(409).json({
        message: 'This student already has a Quran Talkeen recitation record for this session.'
      });
    }

    const student = await User.findByPk(student_id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const session = await CircleSession.findOne({
      where: { id: session_id },
      include: [{ model: Circle, as: 'circle' }]
    });
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }
    if (!session.circle || session.circle.circle_type_id !== 3) {
      return res.status(400).json({ message: 'This circle is not a Talkeen circle' });
    }

    if (from_sura_id > to_sura_id) {
      return res.status(400).json({ message: "Invalid surah range" });
    }
    if (from_sura_id === to_sura_id && from_verse > to_verse) {
      return res.status(400).json({ message: "Invalid ayah range" });
    }

    const newRecitation = await QuranTalkeen.create({
      session_id,
      student_id,
      teacher_id: teacherId,
      from_sura_id,
      from_verse,
      to_sura_id,
      to_verse,
      attendance
    });

    return res.status(201).json({
      message: 'Quran Talkeen recitation record created successfully.',
      data: newRecitation
    });

  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Internal server error',
      details: err.message
    });
  }
});

////////////update
const updateQuranRecitation = asyncHandler(async (req, res) => {
  try {
    const { error } = TalkeenRecitationValidation_update(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const IdQuranRecitation = req.params.id;

    const quranRecitation = await QuranTalkeen.findOne({
      where: { id: IdQuranRecitation }
    });

    if (!quranRecitation) {
      return res.status(404).json({ message: 'Quran Talkeen recitation record not found.' });
    }

    if (
      req.body.from_sura_id !== undefined &&
      req.body.to_sura_id !== undefined &&
      req.body.from_sura_id > req.body.to_sura_id
    ) {
      return res.status(400).json({ message: "Invalid surah range" });
    }

    if (
      req.body.from_sura_id !== undefined &&
      req.body.to_sura_id !== undefined &&
      req.body.from_sura_id === req.body.to_sura_id &&
      req.body.from_verse !== undefined &&
      req.body.to_verse !== undefined &&
      req.body.from_verse > req.body.to_verse
    ) {
      return res.status(400).json({ message: "Invalid ayah range" });
    }

    if (req.body.from_sura_id !== undefined)
      quranRecitation.from_sura_id = req.body.from_sura_id;
    if (req.body.from_verse !== undefined)
      quranRecitation.from_verse = req.body.from_verse;
    if (req.body.to_sura_id !== undefined)
      quranRecitation.to_sura_id = req.body.to_sura_id;
    if (req.body.to_verse !== undefined)
      quranRecitation.to_verse = req.body.to_verse;
    if (req.body.attendance !== undefined)
      quranRecitation.attendance = req.body.attendance;

    await quranRecitation.save();

    return res.status(200).json({
      message: 'Quran Talkeen recitation record updated successfully.',
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
      return res.status(200).json({
        message: 'No Quran recitation records found for this student.',data: []
      });
    }
quranRecitations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const resultsQuran = quranRecitations.map(element => {
      const dateObj = dayjs(element.date);
      return {
        date: dateObj.format("YYYY-MM-DD"),
        day: dateObj.format("dddd"),
        attendance: !!element.session ? "تم الحضور" :"تم الغياب", // true إذا كان داخل الحلقة
        fromSurahName: element.from_sura?.name || null,
        fromAyah: element.from_ayah?.ayah_number || null,
        toSurahName: element.to_sura?.name || null,
        toAyah: element.to_ayah?.ayah_number || null,
        is_counted: "محسوبة" 
      };
    });

    return res.status(200).json({
      message: 'Retrieved all Quran recitations for the student.',
      studentID,
      studentFirstName: quranRecitations[0]?.student?.first_name || null,
      studentLastName: quranRecitations[0]?.student?.last_name || null,
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
