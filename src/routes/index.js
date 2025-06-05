const express = require('express');
const userRoutes = require('../features/users/user');
const authRoutes = require('../features/auth/auth');
const postRoutes = require('../features/posts/post');
const commentRoutes = require('../features/comments/comment');

const router = express.Router();

router.use('/v1/auth', authRoutes);
router.use('/v1/users', userRoutes);
router.use('/v1/posts', postRoutes);
router.use('/v1/comments', commentRoutes);

module.exports = router;