const asyncHandler = require('express-async-handler');
const { ValidateSessionCraete } = require('../validations/session');
const { User, Role, Mosque, Circle, CircleUser,CircleType,CircleSession}= require('../models');
const { where } = require('sequelize');


const { Op } = require('sequelize');
//////////////create
const dayjs = require('dayjs');

const sessionCreate = asyncHandler(async (req, res) => {
  const { error } = ValidateSessionCraete(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const circle = await Circle.findOne({
    where: { id: req.body.circle_id },
    include: [{ model: CircleType, as: 'circle_type' }]
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
      date: { [Op.between]: [startOfDay, endOfDay] }
    }
  });

  if (existingSession) {
    return res.status(409).json({ message: "A session already exists on this date for this circle" });
  }

  const formattedDate = dayjs(req.body.date).format("YYYY-MM-DD HH:mm:ss");

  const createdSession = await CircleSession.create({
    circle_id: req.body.circle_id,
    date: formattedDate,
    description: req.body.description
  });

  const sessionData = createdSession.toJSON();
  sessionData.date = dayjs(sessionData.date).format("YYYY-MM-DD");

  return res.status(201).json({
    message: "Session created successfully",
    data: {
      session: sessionData,
      circle: circle
    }
  });
});

////////////////show all session


const showAllSession = asyncHandler(async (req, res) => {
  try {
    const circle_id = req.params.id;
    const sessions = await CircleSession.findAll({
      where: { circle_id: circle_id }
    });

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({
        message: "There are no sessions in this circle"
      });
    }

    const formattedSessions = sessions.map(s => {
      const sessionData = s.toJSON();
      sessionData.date = dayjs(sessionData.date).format("YYYY-MM-DD");
      return sessionData;
    });

    return res.status(200).json({
      message: "All sessions for this circle",
      data: formattedSessions
    });
  } catch (err) {
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
