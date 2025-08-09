const jwt = require('jsonwebtoken');
const ApiResponder = require('../utils/ApiResponder');
const dotenv = require('dotenv');
dotenv.config();

// Middleware للتحقق من التوكن
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader);

  const token = authHeader?.replace('Bearer ', ''); // لاحظ أضفت مسافة بعد Bearer
  console.log('Extracted Token:', token);

  if (!token) {
    return ApiResponder.unauthorizedResponse(res, 'No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
    console.log('Decoded Token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return ApiResponder.unauthorizedResponse(res, 'Token has expired');
    }
    return ApiResponder.unauthorizedResponse(res, 'Invalid token');
  }
};


// Middlewares للتحقق من الأدوار بالنص
const studentOnly = (req, res, next) => {
  if (req.user?.role !== 'student') {
    return ApiResponder.forbiddenResponse(res, 'Access restricted to students only');
  }
  next();
};

const teacherOnly = (req, res, next) => {
  if (req.user?.role !== 'teacher') {
    return ApiResponder.forbiddenResponse(res, 'Access restricted to teachers only');
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return ApiResponder.forbiddenResponse(res, 'Access restricted to admins only');
  }
  next();
};

const superAdminOnly = (req, res, next) => {
  if (req.user?.role !== 'superAdmin') {
    return ApiResponder.forbiddenResponse(res, 'Access restricted to super admins only');
  }
  next();
};

// يمكن تمرير أدوار مسموحة
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return ApiResponder.forbiddenResponse(res, 'You do not have permission');
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  studentOnly,
  teacherOnly,
  adminOnly,
  superAdminOnly,
  authorizeRoles
};
