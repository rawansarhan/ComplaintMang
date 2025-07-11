const asyncHandler = require('express-async-handler')
const { HadithBook,CircleType} = require('../models');
const { where, Op } = require('sequelize');


const circleType= asyncHandler(async(req,res)=>{
    try{
     const Type = await CircleType.findAll({
      where :{
        name :{
          [Op.notIn] : ['Dars', 'Hadith','Talqeen']
        }
      }
     });
 const books = await HadithBook.findAll({
      where: { mosque_id :req.user.mosque_id},
    });

     return res.status(200).json({
        message:"All circle types excluding 'lesson','Talqeen' and 'hadith'",
        Type,
        books
     })
    }catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    });
  }

})
//////////////////////////////////
const showAll = asyncHandler(async(req,res)=>{
    try{
  const Type = await CircleType.findAll();
   return res.status(200).json({
        message:"All circle types",
        Type
     })

       }catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    });
  }

})
module.exports = {
  circleType,
  showAll
}
