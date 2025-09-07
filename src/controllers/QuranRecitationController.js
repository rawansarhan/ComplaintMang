const asyncHandler = require('express-async-handler')
const { QuranRecitation,UndividualRecitationQuran,User,HadithRecitation ,HadithBook ,UndividualRecitationHadith ,SessionAttendance,QuranTalkeen,Surah,Ayah,CircleSession,Circle} = require('../models')
const {
  quranRecitationValidation_update,
  quranRecitationValidation_create
} = require('../validations/QuranRecitationValidation')
const dayjs = require('dayjs');
const { where } = require('sequelize');
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

    const teacherId = req.user.id;
    if (!teacherId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // تحقق من النطاق (السورة + الآية)
    if (from_sura_id > to_sura_id || 
        (from_sura_id === to_sura_id && from_verse > to_verse)) {
      return res.status(400).json({ message: "Invalid surah/ayah range" });
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

    // أنشئ التلاوة
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

    // إذا حاضر سجّل حضوره
    if (newRecitation.attendance === true) {
      const existingAttendance = await SessionAttendance.findOne({
        where: { session_id: session.id, user_id: student_id }
      });

      if (!existingAttendance) {
        await SessionAttendance.create({
          session_id: session.id,
          user_id: student_id
        });
      }
    }

    return res.status(201).json({
      message: 'Quran recitation record created successfully.',
      data: {
        id: newRecitation.id,
        student_id: newRecitation.student_id,
        session_id: newRecitation.session_id,
        from_sura_id: newRecitation.from_sura_id,
        from_verse: newRecitation.from_verse,
        to_sura_id: newRecitation.to_sura_id,
        to_verse: newRecitation.to_verse,
        is_counted: newRecitation.is_counted,
        is_exam: newRecitation.is_exam,
        attendance: newRecitation.attendance
      }
    });
  }  catch (err) {
    console.error(err); // 👈 اطبع كامل الخطأ
    return res.status(500).json({
      message: 'Internal server error',
      details: err.message,
      stack: err.stack // 👈 مفيد أثناء التطوير
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
      return res.status(200).json({
        message: 'No Quran recitation records found for this student.',  data: []
      });
    }

    // sort desc by created_at
    allRecitations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const resultsQuran = allRecitations.map(element => {
      const dateObj = dayjs(element.circleSession.date);
      return {
        date: dateObj.format("YYYY-MM-DD"),
        day: dateObj.format("dddd"),
        attendance: !!element.circleSession ? "تم الحضور" :"تم الغياب", // true إذا كان داخل الحلقة
        fromSurahName: element.fromSurah?.name || null,
        fromAyah: element.fromVerse?.ayah_number || null,
        toSurahName: element.toSurah?.name || null,
        toAyah: element.toVerse?.ayah_number || null,
        is_counted: element.is_counted ? "محسوبة" : "غير محسوبة"
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

////////////////////////////////////////////////
const mySaved = asyncHandler(async(req,res)=>{
  try{
    const studentID = req.user.id;

    // --- Quran Recitations ---
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

    const allQuranRecitations = [...quranRecitations, ...quranRecitationsOnline];
    allQuranRecitations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const resultsQuran = allQuranRecitations.map(element => {
      const dateObj = dayjs(element.circleSession?.date || element.date);
      return {
        date: dateObj.format("YYYY-MM-DD"),
        day: dateObj.format("dddd"),
        quranId: element.id,
        fromSurahName: element.fromSurah?.name || null,
        fromAyah: element.fromVerse?.ayah_number || null,
        toSurahName: element.toSurah?.name || null,
        toAyah: element.toVerse?.ayah_number || null,
        is_counted: element.is_counted ? "محسوبة" : "غير محسوبة"
      };
    });

    // --- Hadith Recitations ---
    const hadithRecitations = await HadithRecitation.findAll({
      where: { student_id: studentID },
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' },
        { model: CircleSession, as: 'session' },
        { model: HadithBook, as: 'book' }
      ],
      raw: true,
      nest: true
    });

    const hadithRecitationsOnline = await UndividualRecitationHadith.findAll({
      where: { student_id: studentID },
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' },
        { model: HadithBook, as: 'book' }
      ],
      raw: true,
      nest: true
    });

    const allHadithRecitations = [...hadithRecitations, ...hadithRecitationsOnline];
    allHadithRecitations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const resultsHadith = allHadithRecitations.map(element => {
      const dateObj = dayjs(element.session?.date || element.date);
      return {
        date: dateObj.format("YYYY-MM-DD"),
        day: dateObj.format("dddd"),
        HadithRecitationsId: element.id,
        bookName: element.book?.name || "",
        fromHadith: element.from_hadith || 0,
        toHadith: element.to_hadith || 0,
        is_counted: element.is_counted ? "محسوبة" : "غير محسوبة"
      };
    });

    // --- Talkeen Recitations ---
    const quranTalkeen = await QuranTalkeen.findAll({
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

    quranTalkeen.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const resultsTalkeen = quranTalkeen.map(element => {
      const dateObj = dayjs(element.session?.date || element.date);
      return {
        date: dateObj.format("YYYY-MM-DD"),
        day: dateObj.format("dddd"),
        idTalkeen: element.id,
        fromSurahName: element.from_sura?.name || null,
        fromAyah: element.from_ayah?.ayah_number || null,
        toSurahName: element.to_sura?.name || null,
        toAyah: element.to_ayah?.ayah_number || null,
        is_counted: "محسوبة"
      };
    });

    return res.status(200).json({
      message: 'Retrieved all recitations for the student.',
      studentID,
      studentFirstName: allQuranRecitations[0]?.student?.first_name || null,
      studentLastName: allQuranRecitations[0]?.student?.last_name || null,
      quran: resultsQuran,
      hadith: resultsHadith,
      talkeen: resultsTalkeen
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
  showAllRecitationsForStudent,
  mySaved
}
