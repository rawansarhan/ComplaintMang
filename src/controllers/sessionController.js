const asyncHandler = require('express-async-handler');
const { ValidateSessionCraete } = require('../validations/session');
const { User, Role, Mosque, Circle, CircleUser,CircleType,CircleSession}= require('../models');
const { where } = require('sequelize');


const { Op } = require('sequelize');
//////////////create
const sessionCreate = asyncHandler(async (req, res) => {
  try {
    const { error } = ValidateSessionCraete(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const circle = await Circle.findOne({
      where: { id: req.body.circle_id }
    });
    if (!circle) {
      return res.status(404).json({ message: "Circle not found" });
    }

    const startOfDay = new Date(req.body.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(req.body.date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingSession = await CircleSession.findOne({
      where: {
        circle_id: req.body.circle_id,
        date: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    if (existingSession) {
      return res.status(409).json({ message: "A session already exists on this date for this circle" });
    }

    const createdSession = await CircleSession.create({
      circle_id: req.body.circle_id,
      date: req.body.date
    });

    return res.status(200).json({
      message: "Session created successfully",
      session: createdSession
    });

  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Internal server error',
      details: err.message
    });
  }
});



////////////////show all session
const showAllSession = asyncHandler(async(req,res)=>{
try{
const circle_id = req.params.id;
const session = await CircleSession.findAll({
  where : {id : circle_id }
})
 if( !session )
{
  return res.status(404).json(
    {
      message:"Ther are no sessions in this circles"
    }
  )
}
return res.status(200).json(
  {
    message:"All session for this circle" ,
    session
  }
)
}catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    });
  }
});
module.exports = {
  sessionCreate,
  showAllSession
}
