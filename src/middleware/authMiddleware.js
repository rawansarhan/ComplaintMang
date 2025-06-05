const jwt = require('jsonwebtoken');
const ApiResponder = require('../utils/ApiResponder');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return ApiResponder.unauthorizedResponse(res, 'No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return ApiResponder.unauthorizedResponse(res, 'Invalid token');
  }
};

module.exports = authMiddleware;