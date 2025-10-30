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
  // 🔹 نجهّز النطاق الزمني
  const from = new Date(fromDate);
  from.setHours(0, 0, 0, 0);
  const to = new Date(toDate);
  to.setHours(23, 59, 59, 999);

  // 🔹 نجمع الصفحات من جدول الجلسات الحضورية
  const totalInPerson = await QuranRecitation.sum("new_pages", {
    where: {
      student_id: user_id,
      is_counted: true,
      created_at: { [Op.between]: [from, to] },
    },
  });

  // 🔹 نجمع الصفحات من جدول الجلسات الفردية (الأونلاين)
  const totalOnline = await UndividualRecitationQuran.sum("new_pages", {
    where: {
      student_id: user_id,
      is_counted: true,
      created_at: { [Op.between]: [from, to] },
    },
  });

  // 🔹 نجمعهم معًا (ونرجع صفر إذا كان null)
  const totalSaved = (totalInPerson || 0) + (totalOnline || 0);

  return totalSaved;
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

  // ✅ تحقق أن fromDate ليست أكبر من toDate
  if (new Date(fromDate) > new Date(toDate)) {
    return res.status(400).json({ message: "تاريخ البداية لا يمكن أن يكون بعد تاريخ النهاية" });
  }

  const adminId = req.user.id;
  const admin = await User.findOne({
    where: { id: adminId },
    attributes: ["first_name", "last_name", "code", "phone", "mosque_id"],
  });

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  // 🕌 جميع الطلاب في نفس المسجد
  const students = await User.findAll({
    where: {
      mosque_id: admin.mosque_id,
      role_id: 1, // 1 = Student
    },
    attributes: ["id", "first_name", "last_name"],
  });

  if (students.length === 0) {
    return res.status(200).json({ message: "لا يوجد طلاب في هذا المسجد" });
  }

  // ⚡ تنفيذ متوازي لزيادة السرعة
  const results = await Promise.all(
    students.map(async (student) => {
      const [attendanceStudent, savedQuranStudent, savedHadithStudent] = await Promise.all([
        attendance(student.id, fromDate, toDate),
        savedQuran(student.id, fromDate, toDate),
        savedHadith(student.id, fromDate, toDate),
      ]);

      return {
        studentInf: {
          id: student.id,
          firstName: student.first_name,
          lastName: student.last_name,
        },
        attendance: attendanceStudent,
        savedQuran: savedQuranStudent,
        savedHadith: savedHadithStudent,
      };
    })
  );

  if (results.length === 0) {
    return res.status(200).json({ message: "لا يوجد احصائيات" });
  }

  res.status(200).json({
    message: "All Statistics",
    result: results,
  });
});



const statisticsForTeacher = asyncHandler(async (req, res) => {
  const { error, value } = statistics_create.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { fromDate, toDate } = value;

  if (new Date(fromDate) > new Date(toDate)) {
    return res.status(400).json({ message: "تاريخ البداية لا يمكن أن يكون بعد تاريخ النهاية" });
  }

  const teacherId = req.user.id;
  const teacher = await User.findOne({
    where: { id: teacherId },
    attributes: ["first_name", "last_name", "code", "phone", "mosque_id"]
  });

  if (!teacher) {
    return res.status(404).json({ message: "teacher not found" });
  }

  const TEACHER_ROLE_ID = 2;
  const STUDENT_ROLE_ID = 1;

  const circles = await Circle.findAll({
    include: [
      {
        model: User,
        as: "users",
        through: { attributes: ["role_id"] }
      },
    ],
  });

  const teacherCircles = circles.filter(circle =>
    circle.users.some(user =>
      user.id === req.user.id && user.CircleUser.role_id === TEACHER_ROLE_ID
    )
  );

  const formatted = teacherCircles.flatMap(circle =>
    circle.users
      .filter(user => user.CircleUser.role_id === STUDENT_ROLE_ID)
      .map(student => ({
        id: student.id,
        mosque_id: student.mosque_id,
        first_name: student.first_name,
        last_name: student.last_name,
        phone: student.phone,
        father_phone: student.father_phone,
        birth_date: student.birth_date,
        address: student.address,
        certificates: student.certificates,
        code: student.code,
        experiences: student.experiences,
        memorized_parts: student.memorized_parts,
        role_id: student.role_id,
        is_save_quran: student.is_save_quran,
      }))
  );

  if (formatted.length === 0) {
    return res.status(200).json({ message: "لا يوجد طلاب لديك" });
  }

  const results = await Promise.all(
    formatted.map(async (student) => {
      const [attendanceStudent, savedQuranStudent, savedHadithStudent] = await Promise.all([
        attendance(student.id, fromDate, toDate),
        savedQuran(student.id, fromDate, toDate),
        savedHadith(student.id, fromDate, toDate),
      ]);

      return {
        studentInf: {
          id: student.id,
          firstName: student.first_name,
          lastName: student.last_name,
        },
        attendance: attendanceStudent,
        savedQuran: savedQuranStudent,
        savedHadith: savedHadithStudent,
      };
    })
  );

  if (results.length === 0) {
    return res.status(200).json({ message: "لا يوجد احصائيات" });
  }

  res.json({
    message: "All Statistics",
    result: results,
  });
});

module.exports = { statisticsForAdmin, savedHadith, attendance, savedQuran , statisticsForTeacher };
