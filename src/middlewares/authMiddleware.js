const jwt = require('jsonwebtoken');
const ApiResponder = require('../utils/ApiResponder');
const dotenv = require('dotenv');
dotenv.config();

const { UserPermission, Permission } = require('../entities'); /// 👈 اضف هذا

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

const authMiddlewaree = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader);

  const token = authHeader?.replace('Bearer ', ''); 
  console.log('Extracted Token:', token);

  if (!token) {
    return ApiResponder.unauthorizedResponse(res, 'No token provided');
  }

  console.log("AUTH SECRET_KEY:", SECRET_KEY);

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
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

// const citizenOnly = (req, res, next) => {
//   if (req.user?.role !== 'citizen') {
//     return ApiResponder.forbiddenResponse(res, 'Access restricted to citizens only');
//   }
//   next();
// };

// const employeeOnly = (req, res, next) => {
//   if (req.user?.role !== 'employee') {
//     return ApiResponder.forbiddenResponse(res, 'Access restricted to employees only');
//   }
//   next();
// };

// const adminOnly = (req, res, next) => {
//   if (req.user?.role !== 'admin') {
//     return ApiResponder.forbiddenResponse(res, 'Access restricted to admins only');
//   }
//   next();
// };

// const authorizeRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user || !allowedRoles.includes(req.user.role)) {
//       return ApiResponder.forbiddenResponse(res, 'You do not have permission');
//     }
//     next();
//   };
// };

const hasPermission = (permissionName) => async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userPermissions = await UserPermission.findAll({
      where: { user_id: userId },
      include: [{
        model: Permission,
        as: 'permission',   
        attributes: ['name'],
        required: true
      }]
    });

    const permissions = userPermissions.map(up => up.permission.name);

    if (!permissions.includes(permissionName)) {
      return res.status(403).json({ message: 'you are not have this permission' });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  authMiddlewaree,
  hasPermission
};
