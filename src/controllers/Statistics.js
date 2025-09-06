const asyncHandler = require('express-async-handler')
const { QuranRecitation,UndividualRecitationQuran,HadithBook,Mosque,CircleUser,UndividualRecitationHadith,User,HadithRecitation,Surah,Ayah,CircleSession,SessionAttendance,Circle,QuranTalkeen} = require('../models');
const { Op, where } = require('sequelize');
const { statistics_create } = require('../validations/statisticsValidation');

const attendance = async (user_id, session_id, startOfDay, endOfDay) => {
  const sessionAttendance = await SessionAttendance.findAll({
    where: {
      user_id,
      session_id
    },
    include: [
      {
        model: CircleSession,
        as: 'session',
        where: {
          date: { [Op.between]: [startOfDay, endOfDay] }
        },
        attributes: ['date'] // بس رجّع التاريخ
      }
    ],
    attributes: [] // ما بدنا أعمدة SessionAttendance نفسها
  });

  // فلترة بحيث ناخد تاريخ واحد لكل يوم
  const uniqueDates = new Set(
    sessionAttendance.map(record => record.session.date.toISOString().split('T')[0])
  );

  return uniqueDates.size; // عدد الأيام المميزة
};

/////////////////get pages number for student

const savedQuran = async (user_id, session_id, startOfDay, endOfDay) => {
  const quranRecitations = await QuranRecitation.findAll({
    where: {
      student_id: user_id,
      session_id: session_id,
      is_counted: true,
      created_at: { [Op.between]: [startOfDay.toISOString(), endOfDay.toISOString()] }
    },
    include: [
      { model: Surah, as: 'fromSurah' },
      { model: Surah, as: 'toSurah' },
      { model: Ayah, as: 'fromVerse' },
      { model: Ayah, as: 'toVerse' },
    ],
    order: [['created_at', 'ASC']]
  });

  const quranRecitationsOnline = await UndividualRecitationQuran.findAll({
    where: {
      student_id: user_id,
      is_counted: true,
      created_at: { [Op.between]: [startOfDay.toISOString(), endOfDay.toISOString()] }
    },
    include: [
      { model: Surah, as: 'fromSurah' },
      { model: Surah, as: 'toSurah' },
      { model: Ayah, as: 'fromVerse' },
      { model: Ayah, as: 'toVerse' },
    ],
    order: [['created_at', 'ASC']]
  });

  if (quranRecitations.length === 0 && quranRecitationsOnline.length === 0) return 0;

  // نجيب آخر آية بكل صفحة مرة وحدة
  const pageAyahMax = {};
  const lastAyat = await Ayah.findAll({
    attributes: [
      'page_number',
      [Sequelize.fn('MAX', Sequelize.col('ayah_number')), 'last_ayah']
    ],
    group: ['page_number']
  });
  lastAyat.forEach(p => {
    pageAyahMax[p.page_number] = parseInt(p.get('last_ayah'), 10);
  });

  let completedPages = new Set();

  const processRecitation = async (rec) => {
    const { fromSurah, toSurah, fromVerse, toVerse } = rec;
    if (!fromSurah || !toSurah || !fromVerse || !toVerse) return;

    const verses = await Ayah.findAll({
      where: {
        [Op.or]: [
          { surah_id: fromSurah.id, ayah_number: { [Op.gte]: fromVerse.ayah_number } },
          { surah_id: toSurah.id, ayah_number: { [Op.lte]: toVerse.ayah_number } },
          { surah_id: { [Op.gt]: fromSurah.id, [Op.lt]: toSurah.id } }
        ]
      },
      order: [['surah_id', 'ASC'], ['ayah_number', 'ASC']]
    });

    const pageGroups = {};
    verses.forEach(v => {
      if (!pageGroups[v.page_number]) pageGroups[v.page_number] = [];
      pageGroups[v.page_number].push(v);
    });

    for (const [page, ayat] of Object.entries(pageGroups)) {
      const maxRead = Math.max(...ayat.map(v => v.ayah_number));
      const lastAyah = pageAyahMax[page];

      if (maxRead === lastAyah) {
        completedPages.add(page);
      }
    }
  };

  for (const rec of quranRecitations) {
    await processRecitation(rec);
  }
  for (const rec of quranRecitationsOnline) {
    await processRecitation(rec);
  }

  return completedPages.size;
};
////////////////////////get hadith number for student

const savedHadith = async (user_id, session_id, startOfDay, endOfDay) => {
  const hadithRecitations = await HadithRecitation.findAll({
    where: {
      student_id: user_id,
      session_id: session_id,
      is_counted: true,
      created_at: { [Op.between]: [startOfDay.toISOString(), endOfDay.toISOString()] }
    },
    include: [{ model: HadithBook, as: 'book' }],
    order: [['created_at', 'ASC']]
  });

  const hadithRecitationsOnline = await UndividualRecitationHadith.findAll({
    where: {
      student_id: user_id,
      is_counted: true,
      created_at: { [Op.between]: [startOfDay.toISOString(), endOfDay.toISOString()] }
    },
    include: [{ model: HadithBook, as: 'book' }],
    order: [['created_at', 'ASC']]
  });

  if (hadithRecitations.length === 0 && hadithRecitationsOnline.length === 0) return 0;

  let completedHadiths = 0;
  const allRecitations = [...hadithRecitations, ...hadithRecitationsOnline];

  for (const element of allRecitations) {
    const fromHadith = element.from_hadith;
    const toHadith = element.to_hadith;
    if (fromHadith && toHadith) {
      const count = Math.abs(toHadith - fromHadith) + 1;
      completedHadiths += count;
    }
  }

  return completedHadiths;
};

const statisticsForAdmin = asyncHandler(async (req, res) => {
  const { error } = statistics_create(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const AdminId = req.user.id;
  const admin = await User.findOne({
    where: { id: AdminId },
    attributes: ['first_name', 'last_name', 'code', 'phone', 'mosque_id']
  });

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const students = await User.findAll({
    where: { mosque_id: admin.mosque_id, role_id: 1 },
    attributes: ['id', 'first_name', 'last_name']
  });

  if (students.length === 0) {
    return res.status(404).json({ message: "لا يوجد طلاب في هذا المسجد" });
  }

  const results = [];

  for (const student of students) {
    const sessions = await CircleSession.findAll({
      include: [
        {
          model: SessionAttendance,
          as: 'session', // تأكد إنه مطابق لتعريف الـ association
          where: { user_id: student.id },
          required: true
        }
      ],
      attributes: ['id', 'date']
    });

    let attendanceStudent = 0;
    let savedQuranStudent = 0;
    let savedHadithStudent = 0;

    for (const session of sessions) {
      const startOfDay = new Date(session.date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(session.date);
      endOfDay.setHours(23, 59, 59, 999);

      attendanceStudent += await attendance(student.id, session.id, startOfDay, endOfDay);

      // مبدئياً صفر لأنك لسه ما عرّفت دوال savedQuran / savedHadith
    savedQuranStudent += await savedQuran(student.id, session.id, startOfDay, endOfDay);
savedHadithStudent += await savedHadith(student.id, session.id, startOfDay, endOfDay);

    }

    results.push({
      studentInf: {
        id : student.id,
        firstName: student.first_name,
        lastName: student.last_name
      },
      attendance: attendanceStudent || 0,
      savedQuran: savedQuranStudent || 0,
      savedHadith: savedHadithStudent || 0
    });
  }

  if (results.length === 0) {
    return res.status(404).json({ message: "لا يوجد احصائيات" });
  }

  res.json({
    message: "All Statistics",
    result: results
  });
});

module.exports = { statisticsForAdmin ,savedHadith,savedHadith,attendance};
