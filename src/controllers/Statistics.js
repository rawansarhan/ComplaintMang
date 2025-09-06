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
    const sessionAttendance = await SessionAttendance.findAll({
        where: {
            user_id,
            created_at: {
                [Op.between]: [fromDate, toDate]
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
    const quranRecitations = await QuranRecitation.findAll({
        where: {
            student_id: user_id,
            is_counted: true,
            created_at: {
                [Op.between]: [fromDate, toDate]
            }
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
            created_at: {
                [Op.between]: [fromDate, toDate]
            }
        },
        include: [
            { model: Surah, as: "fromSurah" },
            { model: Surah, as: "toSurah" },
            { model: Ayah, as: "fromVerse" },
            { model: Ayah, as: "toVerse" },
        ],
    });

    if (quranRecitations.length === 0 && quranRecitationsOnline.length === 0) {
        return 0;
    }

    let combinedRecitations = [...quranRecitations, ...quranRecitationsOnline];

    const uniqueRecitationsMap = new Map();
    combinedRecitations.forEach((rec) => {
        const key = `${rec.fromVerse?.id}-${rec.toVerse?.id}`;
        if (!uniqueRecitationsMap.has(key)) {
            uniqueRecitationsMap.set(key, rec);
        }
    });
    const uniqueRecitations = Array.from(uniqueRecitationsMap.values());

    const lastAyat = await Ayah.findAll({
        attributes: [
            "page_number",
            [Sequelize.fn("MAX", Sequelize.col("ayah_number")), "last_ayah"],
        ],
        group: ["page_number"],
    });

    const pageAyahMax = {};
    lastAyat.forEach((p) => {
        pageAyahMax[p.page_number] = parseInt(p.get("last_ayah"), 10);
    });

    let completedPages = new Set();

    for (const rec of uniqueRecitations) {
        const { fromSurah, toSurah, fromVerse, toVerse } = rec;
        if (!fromSurah || !toSurah || !fromVerse || !toVerse) continue;

        const verses = await Ayah.findAll({
            where: {
                [Op.or]: [
                    {
                        surah_id: fromSurah.id,
                        ayah_number: { [Op.gte]: fromVerse.ayah_number },
                    },
                    {
                        surah_id: toSurah.id,
                        ayah_number: { [Op.lte]: toVerse.ayah_number },
                    },
                    {
                        surah_id: { [Op.gt]: fromSurah.id, [Op.lt]: toSurah.id },
                    },
                ],
            },
        });

        const pageGroups = {};
        verses.forEach((v) => {
            if (v.page_number) {
                if (!pageGroups[v.page_number]) pageGroups[v.page_number] = [];
                pageGroups[v.page_number].push(v);
            }
        });

        for (const page in pageGroups) {
            const ayatInPage = pageGroups[page];
            const maxAyahNumberRead = Math.max(...ayatInPage.map((v) => v.ayah_number));
            const lastAyahOfPage = pageAyahMax[page];

            if (lastAyahOfPage && maxAyahNumberRead >= lastAyahOfPage) {
                completedPages.add(Number(page));
            }
        }
    }

    return completedPages.size;
};

const savedHadith = async (user_id, fromDate, toDate) => {
    const hadithRecitations = await HadithRecitation.findAll({
        where: {
            student_id: user_id,
            is_counted: true,
            created_at: {
                [Op.between]: [fromDate, toDate]
            }
        },
    });

    const hadithRecitationsOnline = await UndividualRecitationHadith.findAll({
        where: {
            student_id: user_id,
            is_counted: true,
            created_at: {
                [Op.between]: [fromDate, toDate]
            }
        },
    });

    if (hadithRecitations.length === 0 && hadithRecitationsOnline.length === 0) return 0;

    const allHadithRecitations = [...hadithRecitations, ...hadithRecitationsOnline];

    const completedHadiths = allHadithRecitations.reduce((acc, r) => {
        if (typeof r.from_hadith === "number" && typeof r.to_hadith === "number") {
            return acc + Math.abs(r.to_hadith - r.from_hadith) + 1;
        }
        return acc;
    }, 0);

    return completedHadiths;
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