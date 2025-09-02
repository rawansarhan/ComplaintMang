const asyncHandler = require('express-async-handler')
const {
  HadithBook,
  CircleType,
  HadithRecitation,
  UndividualRecitationHadith,
  User,
  CircleSession,Circle,CircleUser
} = require('../models')
const { where, Op } = require('sequelize')
const {
  ValidateCreateHadithRecitation,
  ValidateUpdateHadithRecitation
} = require('../validations/HadithRecitationValidation')
const dayjs = require('dayjs');


const createHadithRecitation = asyncHandler(async (req, res) => {
  try {
    const { error } = ValidateCreateHadithRecitation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingRecord = await HadithRecitation.findOne({
      where: {
        student_id: req.body.student_id,
        session_id: req.body.session_id
      }
    });

    if (existingRecord) {
      return res.status(400).json({
        message: 'This student already has a Hadith recitation record for this session.'
      });
    }

    const teacherId = req.user.id;
    const teacher = await User.findOne({ where: { id: teacherId } });

    const book = await HadithBook.findOne({
      where: {
        id: req.body.book_id,
        mosque_id: teacher.mosque_id
      }
    });

    if (!book) {
      return res.status(404).json({ message: 'Not found Hadith Book' });
    }
 
 if (req.body.from_hadith > book.pages_num) {
  return res.status(400).json({
    message: `'from_hadith' value (${req.body.from_hadith}) exceeds book's max hadith (${book.pages_num})`
  });
}

if (req.body.to_hadith > book.pages_num) {
  return res.status(400).json({
    message: `'to_hadith' value (${req.body.to_hadith}) exceeds book's max hadith (${book.pages_num})`
  });
}
if (req.body.to_hadith < req.body.from_hadith) {
  return res.status(400).json({
    message: `'from_hadith' value (${req.body.to_hadith}) exceeds book's max to_hadith`
  });
}
    const session = await CircleSession.findOne({
      where: { id: req.body.session_id },
      include: [
        {
          model: Circle,
          as: 'circle'
        }
      ]
    });
if(session.circle.circle_type_id !== 2){
      return res.status(404).json({ message: 'this circle not hadith circle' });

}
    if (!session) {
      return res.status(404).json({ message: 'Not found session' });
    }

    if (!session.circle) {
      return res.status(404).json({ message: 'Circle not found for this session' });
    }

    const circleStudent = await CircleUser.findOne({
      where: {
        circle_id: session.circle_id,
        user_id: req.body.student_id
      }
    });

    if (!circleStudent) {
      return res.status(404).json({ message: 'This circle does not have this student' });
    }

    const student = await User.findOne({ where: { id: req.body.student_id } });

    if (!student) {
      return res.status(404).json({ message: 'Not found student' });
    }

    const newRecitation = await HadithRecitation.create({
      session_id: req.body.session_id,
      student_id: req.body.student_id,
      book_id: req.body.book_id,
      teacher_id: teacherId,
      from_hadith: req.body.from_hadith,
      to_hadith: req.body.to_hadith,
      is_counted: req.body.is_counted,
      is_exam: req.body.is_exam,
      attendance: req.body.attendance
    });

    return res.status(200).json({
      message: 'Hadith recitation record created successfully.',
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

///////////////////////update
const updateHadithRecitation = asyncHandler(async (req, res) => {
  try {
    const { error } = ValidateUpdateHadithRecitation(req.body)
    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      })
    }

    const IdHadithRecitation = req.params.id

    const hadithRecitation = await HadithRecitation.findOne({
      where: { id: IdHadithRecitation }
    })

 const book = await HadithBook.findOne({
      where: {
        id: hadithRecitation.book_id,
      }
    });

    if (!book) {
      return res.status(404).json({ message: 'Not found Hadith Book' });
    }
 
 if (req.body.from_hadith > book.pages_num) {
  return res.status(400).json({
    message: `'from_hadith' value (${req.body.from_hadith}) exceeds book's max hadith (${book.pages_num})`
  });
}

if (req.body.to_hadith > book.pages_num) {
  return res.status(400).json({
    message: `'to_hadith' value (${req.body.to_hadith}) exceeds book's max hadith (${book.pages_num})`
  });
}
if (req.body.to_hadith < req.body.from_hadith) {
  return res.status(400).json({
    message: `'from_hadith' value (${req.body.to_hadith}) exceeds book's max to_hadith`
  });
}
    if (!hadithRecitation) {
      return res
        .status(404)
        .json({ message: 'Hadith recitation record not found.' })
    }

    if (req.body.from_hadith !== undefined)
      hadithRecitation.from_hadith = req.body.from_hadith
    if (req.body.to_hadith !== undefined)
      hadithRecitation.to_hadith = req.body.to_hadith
    if (req.body.is_counted !== undefined)
      hadithRecitation.is_counted = req.body.is_counted
    if (req.body.is_exam !== undefined)
      hadithRecitation.is_exam = req.body.is_exam

    await hadithRecitation.save()

    return res.status(200).json({
      message: 'Hadith recitation record updated successfully.',
      data: hadithRecitation
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Internal server error',
      details: err.message
    })
  }
})
//////////////////show
const showAllRecitationsForStudent = asyncHandler(async (req, res) => {
  try {
    const studentID = req.params.id

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
    })

    const HadithRecitationsOnline = await UndividualRecitationHadith.findAll({
      where: { student_id: studentID },
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' },
         { model: HadithBook, as: 'book' }
      ],
      raw: true,
      nest: true
    })

    const allRecitations = [...hadithRecitations, ...HadithRecitationsOnline]

    if (allRecitations.length === 0) {
      return res.status(404).json({
        message: 'No Hadith recitation records found for this student.'
      })
    }

    allRecitations.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )

   const resultsHadith = allRecitations.map(element => {
      const dateObj = dayjs(element.date);
      return {
        date: dateObj.format("YYYY-MM-DD"),
        day: dateObj.format("dddd"),
        attendance: !!element.session, // true إذا كان داخل الحلقة
        bookName: element.book?.name || null,
        pageNamber: element.book?.pages_num || null,
      };
    });

    return res.status(200).json({
      message: 'Retrieved all Hadith recitations for the student.',
      studentID,
      studentFirstName: allRecitations[0]?.student?.first_name || null,
      studentLastName: allRecitations[0]?.student?.last_name || null,
      data: resultsHadith
    });
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Internal server error',
      details: err.message
    })
  }
})

module.exports = {
  createHadithRecitation,
  updateHadithRecitation,
  showAllRecitationsForStudent
}
