const asyncHandler = require("express-async-handler");
const { QuranRecitation, UndividualRecitationQuran, HadithBook, Mosque, CircleUser, UndividualRecitationHadith, User, HadithRecitation, Surah, Ayah, CircleSession, SessionAttendance, Circle, QuranTalkeen } = require("../models");
const { Op, where, Sequelize } = require("sequelize");
const Joi = require("joi"); // Import Joi

// Define the validation schema for statistics_create
const statistics_create = Joi.object({
    fromDate: Joi.date().required(),
    toDate: Joi.date().required(),
});

const attendance = async (user_id, fromDate, toDate) => {
  const from = new Date(fromDate);
  from.setHours(0,0,0,0);
  const to = new Date(toDate);
  to.setHours(23,59,59,999);

    const sessionAttendance = await SessionAttendance.findAll({
        where: {
            user_id,
            created_at: {
                [Op.between]: [from, to]
            }
        },
        include: [
            {
                model: CircleSession,
                as: "session",
                attributes: ["date"]
            }
        ],
        attributes: []
    });

    const uniqueDates = new Set(
        sessionAttendance.map(record => record.session.date.toISOString().split("T")[0])
    );

    return uniqueDates.size;
};

const savedQuran = async (user_id, fromDate, toDate) => {
  const from = new Date(fromDate);
  from.setHours(0, 0, 0, 0);
  const to = new Date(toDate);
  to.setHours(23, 59, 59, 999);

  const quranRecitations = await QuranRecitation.findAll({
    where: {
      student_id: user_id,
      is_counted: true,
      created_at: { [Op.between]: [from, to] },
    },
    include: [
      { model: Ayah, as: "fromVerse" },
      { model: Ayah, as: "toVerse" },
    ],
  });

  const quranRecitationsOnline = await UndividualRecitationQuran.findAll({
    where: {
      student_id: user_id,
      is_counted: true,
      created_at: { [Op.between]: [from, to] },
    },
    include: [
      { model: Ayah, as: "fromVerse" },
      { model: Ayah, as: "toVerse" },
    ],
  });

  const combined = [...quranRecitations, ...quranRecitationsOnline];
  if (combined.length === 0) return 0;

  let completedPagesCount = 0;

  for (const rec of combined) {
    const fromAyah = rec.fromVerse;
    const toAyah = rec.toVerse;

    if (!fromAyah || !toAyah) continue;

    // الصفحات التي غطاها الطالب في الجلسة
    const pages = await Ayah.findAll({
      where: {
        page_number: { [Op.between]: [fromAyah.page_number, toAyah.page_number] },
      },
      attributes: ["page_number"],
      group: ["page_number"],
      order: [["page_number", "ASC"]],
    });

    for (const p of pages) {
      const pageNum = p.page_number;

      const firstVerse = await Ayah.findOne({
        where: { page_number: pageNum },
        order: [["ayah_number", "ASC"]],
      });

      const lastVerse = await Ayah.findOne({
        where: { page_number: pageNum },
        order: [["ayah_number", "DESC"]],
      });

      if (!firstVerse || !lastVerse) continue;

      const startedBeforeOrAtFirst =
        fromAyah.page_number < pageNum ||
        (fromAyah.page_number === pageNum && fromAyah.ayah_number <= firstVerse.ayah_number);

      const endedAfterOrAtLast =
        toAyah.page_number > pageNum ||
        (toAyah.page_number === pageNum && toAyah.ayah_number >= lastVerse.ayah_number);

      if (startedBeforeOrAtFirst && endedAfterOrAtLast) {
        completedPagesCount++;
      }
    }
  }

  return completedPagesCount;
};

const savedHadith = async (user_id, fromDate, toDate) => {
    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const hadithRecitations = await HadithRecitation.findAll({
        where: {
            student_id: user_id,
            is_counted: true,
            created_at: {
                [Op.between]: [from, to]
            },
        },
        include: [
            { model: HadithBook, as: "book" },
        ],
    });

    const hadithRecitationsOnline = await UndividualRecitationHadith.findAll({
        where: {
            student_id: user_id,
            is_counted: true,
            created_at: {
                [Op.between]: [from, to]
            },
        },
        include: [
            { model: HadithBook, as: "book" },
        ],
    });

    const allHadithRecitations = [...hadithRecitations, ...hadithRecitationsOnline];

    if (allHadithRecitations.length === 0) return 0;

    const uniqueHadiths = new Set();

    for (const rec of allHadithRecitations) {
        if (rec.book && typeof rec.from_hadith === "number" && typeof rec.to_hadith === "number") {
            for (let i = rec.from_hadith; i <= rec.to_hadith; i++) {
                uniqueHadiths.add(`${rec.book.id}-${i}`);
            }
        }
    }

    return uniqueHadiths.size;
};

const statisticsForAdmin = asyncHandler(async (req, res) => {
    const { error, value } = statistics_create.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { fromDate, toDate } = value;

    const AdminId = req.user.id;
    const admin = await User.findOne({
        where: { id: AdminId },
        attributes: ["first_name", "last_name", "code", "phone", "mosque_id"]
    });

    if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
    }

    const students = await User.findAll({
        where: { mosque_id: admin.mosque_id, role_id: 1,
         },
        attributes: ["id", "first_name", "last_name"]
    });

    if (students.length === 0) {
        return res.status(200).json({ message: "لا يوجد طلاب في هذا المسجد" });
    }

    const results = [];

    for (const student of students) {
        const attendanceStudent = await attendance(student.id, fromDate, toDate);
        const savedQuranStudent = await savedQuran(student.id, fromDate, toDate);
        const savedHadithStudent = await savedHadith(student.id, fromDate, toDate);

        results.push({
            studentInf: {
                id: student.id,
                firstName: student.first_name,
                lastName: student.last_name
            },
            attendance: attendanceStudent,
            savedQuran: savedQuranStudent,
            savedHadith: savedHadithStudent
        });
    }

    if (results.length === 0) {
        return res.status(200).json({ message: "لا يوجد احصائيات" });
    }

    res.json({
        message: "All Statistics",
        result: results
    });
});

module.exports = { statisticsForAdmin, savedHadith, attendance, savedQuran };
