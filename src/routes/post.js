const express = require('express');
const asyncHandler = require('../../middleware/asyncHandler');
const authMiddleware = require('../../middleware/authMiddleware');
const ApiResponder = require('../../utils/ApiResponder');
const db = require('../../../models');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const posts = await db.Post.findAll({
    include: [{ model: db.User, as: 'user' }],
  });
  return ApiResponder.okResponse(res, posts, 'Posts retrieved successfully');
}));

router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  const post = await db.Post.create({
    ...req.body,
    user_id: req.user.id,
  });
  return ApiResponder.createdResponse(res, post, 'Post created successfully');
}));

module.exports = router;