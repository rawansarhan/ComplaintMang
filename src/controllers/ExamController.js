const asyncHandler = require('express-async-handler')
const {
  User,
  Circle,
  LessonSession,
  ExamResult,
  Exam,
  CircleUser
} = require('../models')
const {
  exam_create,
  exam_update,
  Add_marks
} = require('../validations/LessonValidation')
const { where, Op } = require('sequelize')
const e = require('express')
const { date } = require('joi')
const { sendNotification } = require("../services/firebase-notification");
const { messaging } = require('firebase-admin')
 // استدعاء الدالة من server.js


const examCreate = asyncHandler(async (req, res) => {
  const { error } = exam_create(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
const circleId = req.params.id

  const circle = await Circle.findOne({
    where: { id: circleId , circle_type_id: 4}
  });

  if (!circle) {
    return res.status(404).json({ message: 'circle not found or the Circle type not dars' });
  }
  const examExist = await Exam.findOne({
  where: { circle_id: circle.id,    date: { [Op.eq]: new Date(req.body.date) } }
});

if (examExist) {
  return res.status(403).json({ message: "This circle already has an exam on this date" });
}

  const exam = await Exam.create({
    circle_id: circle.id,
    title: req.body.title,
    date: req.body.date, 
    description: req.body.description
  });

  return res.status(200).json({
    message: 'Lesson exam created successfully',
    circle: circle,
    dataExam: exam
  });
});

/////////////// update
const examUpdate = asyncHandler(async (req, res) => {
  const { error } = exam_update(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const examId = req.params.id;
  const exam = await Exam.findOne({ where: { id: examId } });

  if (!exam) {
    return res.status(404).json({ message: 'Exam not found' });
  }

  exam.title = req.body.title || exam.title;
  exam.date = req.body.date || exam.date;
  exam.description = req.body.description || exam.description;
  await exam.save();

  return res.status(200).json({
    message: 'Exam updated successfully',
    data: exam
  });
});

////////All exam for circle
const examGetAll = asyncHandler(async (req, res) => {
  const circleId = req.params.id
  const circle = await Circle.findOne({
    where: { id: circleId }
  })
  if (!circle) {
    res.status(404).json({ message: 'not found circle' })
  }
  const exams = await Exam.findAll({
    where: { circle_id: circleId }
  })
  if(exams.length === 0){
    return res.status(200).json({ message: "Not found exams for this circle"});
  }
  return res.status(200).json({
    message: 'get All exam for the circle',
    data: exams
  })
})

//////////////////////////////////
/////////////////////////////////
/////Add marks for examconst 



const AddMarksCreate = asyncHandler(async (req, res) => {
  const { error } = Add_marks(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const examId = req.params.id;
  const exam = await Exam.findOne({ where: { id: examId } });
  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  const groupOfData = req.body.data;

  try {
    const results = await Promise.all(
      groupOfData.map(async (entry) => {
        const user = await User.findOne({ where: { id: entry.student_id } });
        if (!user) {
          throw new Error(`Student with ID ${entry.student_id} not found`);
        }

        const circleUser = await CircleUser.findOne({
          where: { circle_id: exam.circle_id, user_id: user.id },
        });
        if (!circleUser) {
          throw new Error(
            `Student with ID ${entry.student_id} not found in this circle`
          );
        }

        const existingMark = await ExamResult.findOne({
          where: {
            exam_id: examId,
            student_id: user.id,
          },
        });

        let result;
        if (existingMark) {
          if (entry.score !== undefined) existingMark.score = entry.score;
          if (entry.has_taken_exam !== undefined)
            existingMark.has_taken_exam = entry.has_taken_exam;
          if (entry.notes) existingMark.notes = entry.notes;
          await existingMark.save();
          result = existingMark;

          // 🔔 إشعار عند تعديل العلامة
          // console.log("Sending notification to token:", user.fcm_token);
          // if (user.fcm_token) {
          //   const success = await sendNotification(
          //     user.fcm_token,
          //     "تعديل علامة الامتحان",
          //     `تم تعديل علامتك في الامتحان (${exam.title || "امتحان"}) إلى ${existingMark.score}`
          //   );
          //   console.log(
          //     `Notification for user ${user.id} ${
          //       success ? "sent ✅" : "failed ❌"
          //     }`
          //   );
          // }
        } else {
          const newMark = await ExamResult.create({
            exam_id: examId,
            student_id: user.id,
            score: entry.score,
            has_taken_exam: entry.has_taken_exam,
            notes: entry.notes || null,
          });
          result = newMark;

          // 🔔 إشعار عند إضافة علامة جديدة
          // console.log("Sending notification to token:", user.fcm_token);
          // if (user.fcm_token) {
          //   const success = await sendNotification(
          //     user.fcm_token,
          //     "إضافة علامة الامتحان",
          //     `تم إضافة علامتك في الامتحان (${exam.title || "امتحان"}): ${newMark.score}`
          //   );
          //   console.log(
          //     `Notification for user ${user.id} ${
          //       success ? "sent ✅" : "failed ❌"
          //     }`
          //   );
          // }
        }

        return result;
      })
    );

    return res.status(200).json({
      message: "Exam marks processed successfully",
      data: results,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

////////////////////
const getAllMarks = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const circleId = req.params.id;
  const exams = await Exam.findAll({
  where: { circle_id: circleId },
  include: [
    {
      model: ExamResult,
       as: "results", 
      where: { student_id: studentId },
      required: false // يخليها optional (يعني حتى لو ما فيه نتيجة يرجع الامتحان)
    }
  ]
});

const results = exams.map(exam => ({
  exam_title: exam.title,
  result_exam: exam.results?.[0]?.score || "not add mark yet"
}));


return res.status(200).json({
  message: "All exams with mark",
  results
});

});
/////////////////////////////////
const getAllMarksForTeacher = asyncHandler(async (req, res) => {
  try {
    const teacherId = req.user.id;
    const examId = req.params.id;

    // نجيب الامتحان
    const exam = await Exam.findOne({ where: { id: examId } });
    if (!exam) {
      return res.status(404).json({ message: "exam not found" });
    }

    // تحقق من أن المدرس داخل الـ circle
    const circleUser = await CircleUser.findOne({
      where: { circle_id: exam.circle_id, user_id: teacherId, role_id: 2 }
    });
    if (!circleUser) {
      return res.status(403).json({ message: "you dont have permission" });
    }

    // نجيب الطلاب داخل الـ circle
    const circleStudent = await CircleUser.findAll({
      where: { circle_id: exam.circle_id, role_id: 1 },
      include: [{ model: User, as: "user" }]
    });

    if (circleStudent.length === 0) {
      return res.status(200).json({
        message: "you dont have student in this circle",
        data: []
      });
    }

    // نجيب النتائج لكل طالب
    const results = await Promise.all(
      circleStudent.map(async (student) => {
        const resultExam = await ExamResult.findOne({
          where: { exam_id: examId, student_id: student.user_id }
        });

        return {
          IdStudent: student.user?.id,
          studentFirstName: student.user?.first_name || "N/A",
          studentLastName: student.user?.last_name || "N/A",
          exam_title: exam.title,
          result_exam: resultExam?.score || 0,
          notes: resultExam?.notes || null,
          has_taken_exam: resultExam?.has_taken_exam || false
        };
      })
    );

    return res.status(200).json({
      message: "get all student with marks",
      data: results
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


///////

//////////////////
module.exports = {
  examCreate,
  examGetAll,
  examUpdate,
  AddMarksCreate,
  getAllMarks,
  getAllMarksForTeacher
}
