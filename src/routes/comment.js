const express = require('express');
const asyncHandler = require('../../middleware/asyncHandler');
const authMiddleware = require('../../middleware/authMiddleware');
const ApiResponder = require('../../utils/ApiResponder');
const db = require('../../../models');

const router = express.Router();

router.get('/post/:postId', asyncHandler(async (req, res) => {
  const comments = await db.Comment.findAll({
    where: { post_id: req.params.postId },
    include: [
      { model: db.User, as: 'user' },
      { model: db.Post, as: 'post' },
    ],
  });
  return ApiResponder.okResponse(res, comments, 'Comments retrieved successfully');
}));

router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  const comment = await db.Comment.create({
    ...req.body,
    user_id: req.user.id,
  });
  return ApiResponder.createdResponse(res, comment, 'Comment created successfully');
}));

module.exports = router;