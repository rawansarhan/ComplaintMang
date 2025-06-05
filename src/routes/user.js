const express = require('express');
const asyncHandler = require('../../middleware/asyncHandler');
const ApiResponder = require('../../utils/ApiResponder');
const db = require('../../../models');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const users = await db.User.findAll();
  return ApiResponder.okResponse(res, users, 'Users retrieved successfully');
}));

router.post('/', asyncHandler(async (req, res) => {
  const user = await db.User.create(req.body);
  return ApiResponder.createdResponse(res, user, 'User created successfully');
}));

module.exports = router;