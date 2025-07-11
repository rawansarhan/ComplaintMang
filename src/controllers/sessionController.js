const asyncHandler = require('express-async-handler');
const { ValidateSessionCraete } = require('../validations/session');
const { User, Role, Mosque, Circle, CircleUser,CircleType,CircleSession}= require('../models')
//////////////create

const sessionCreate = asyncHandler(async (req, res) => {
  try {
    const { error } = ValidateSessionCraete(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const existingSession = await CircleSession.findOne({
      where: {
        date: req.body.date,
        circle_id: req.body.circle_id
      }
    });

    if (existingSession) {
      return res.status(409).json({ message: "You already have a session on this date for this circle" });
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
      message: 'Database error',
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
