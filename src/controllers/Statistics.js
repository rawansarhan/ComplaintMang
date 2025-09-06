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
            created_at: { [Op.between]: [from, to] }
        },
        include: [
            { model: Surah, as: "fromSurah" },
            { model: Surah, as: "toSurah" },
            { model: Ayah, as: "fromVerse" },
            { model: Ayah, as: "toVerse" },
        ],
    });

    const quranRecitationsOnline = await UndividualRecitationQuran.findAll({
        where: {
            student_id: user_id,
            is_counted: true,
            created_at: { [Op.between]: [from, to] }
        },
        include: [
            { model: Surah, as: "fromSurah" },
            { model: Surah, as: "toSurah" },
            { model: Ayah, as: "fromVerse" },
            { model: Ayah, as: "toVerse" },
        ],
    });

    let combinedRecitations = [...quranRecitations, ...quranRecitationsOnline];
    if (combinedRecitations.length === 0) return 0;

    const coveredVerses = new Set();

    for (const rec of combinedRecitations) {
        const fromSurahId = rec.fromSurah.id;
        const fromAyahNumber = rec.fromVerse.ayah_number;
        const toSurahId = rec.toSurah.id;
        const toAyahNumber = rec.toVerse.ayah_number;

        const versesInRange = await Ayah.findAll({
            where: {
                [Op.or]: [
                    {
                        surah_id: fromSurahId,
                        ayah_number: { [Op.gte]: fromAyahNumber }
                    },
                    {
                        surah_id: toSurahId,
                        ayah_number: { [Op.lte]: toAyahNumber }
                    },
                    {
                        surah_id: { [Op.gt]: fromSurahId, [Op.lt]: toSurahId }
                    }
                ]
            },
            order: [['page_number', 'ASC'], ['ayah_number', 'ASC']]
        });

        for (const verse of versesInRange) {
            coveredVerses.add(`${verse.surah_id}-${verse.ayah_number}`);
        }
    }

    // First, find the last verse of each page
    const lastVerseOfEachPage = await Ayah.findAll({
        attributes: [
            'page_number',
            [Sequelize.fn('MAX', Sequelize.col('ayah_number')), 'last_ayah_number'],
            'surah_id'
        ],
        group: ['page_number', 'surah_id'],
        order: [['page_number', 'ASC'], ['surah_id', 'DESC']]
    });

    const pageCompletionStatus = {};
    for (const item of lastVerseOfEachPage) {
        const pageNum = item.page_number;
        if (!pageCompletionStatus[pageNum]) {
            // Store the verse key for the last verse on the page
            pageCompletionStatus[pageNum] = `${item.surah_id}-${item.get('last_ayah_number')}`;
        }
    }

    let completedPagesCount = 0;
    for (const pageNum in pageCompletionStatus) {
        const lastVerseKey = pageCompletionStatus[pageNum];
        // A page is considered complete only if its last verse is in the set of covered verses
        if (coveredVerses.has(lastVerseKey)) {
            completedPagesCount++;
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
        where: { mosque_id: admin.mosque_id, role_id: 1 },
        attributes: ["id", "first_name", "last_name"]
    });

    if (students.length === 0) {
        return res.status(404).json({ message: "لا يوجد طلاب في هذا المسجد" });
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
        return res.status(404).json({ message: "لا يوجد احصائيات" });
    }

    res.json({
        message: "All Statistics",
        result: results
    });
});

module.exports = { statisticsForAdmin, savedHadith, attendance, savedQuran };
