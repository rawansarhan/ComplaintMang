const asyncHandler = require('express-async-handler')
const { QuranRecitation,UndividualRecitationQuran,User,Surah,Ayah,CircleSession,SessionAttendance,Circle,QuranTalkeen} = require('../models');
const { Op, where } = require('sequelize');

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

 const savedQuran = async(user_id,session_id, startOfDay, endOfDay)=>{
    const preAyah = null;
    const postAyah = null;
   const quranRecitations = await QuranRecitation.findAll({
      where: { student_id: user_id },
        where: {
          create_at: { [Op.between]: [startOfDay.toISOString(), endOfDay.toISOString()] }},
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' },
        { model: CircleSession, as: 'circleSession' },
        { model: Surah, as: 'fromSurah' },
        { model: Surah, as: 'toSurah' },
        { model: Ayah, as: 'fromVerse' },
        { model: Ayah, as: 'toVerse' },
        
      ],})


 }
const statistics = asyncHandler(async(req,res)=>{

})