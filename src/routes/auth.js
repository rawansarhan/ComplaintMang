const express = require('express');
const asyncHandler = require('../../middleware/asyncHandler');
const ApiResponder = require('../../utils/ApiResponder');
const db = require('../../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', asyncHandler(async (req, res) => {
  const { device_id, password } = req.body;
  const user = await db.User.findOne({ where: { device_id } });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return ApiResponder.unauthorizedResponse(res, 'Invalid credentials');
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return ApiResponder.okResponse(res, { token }, 'Login successful');
}));

module.exports = router;