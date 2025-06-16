const express = require('express');
const userRoutes = require('../features/users/user');
const authRoutes = require('../features/auth/auth');
const postRoutes = require('../features/posts/post');
const commentRoutes = require('../features/comments/comment');

const router = express.Router();

router.use('/v1/auth', authRoutes);


module.exports = router;