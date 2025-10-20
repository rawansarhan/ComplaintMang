const express = require('express');
const router = express.Router();
const {
  registerStudent,
  registerTeacher,
  registerAdmin,
  loginUser,
  loginSuperAdmin
} = require('../controllers/AuthController');
const { authMiddleware,
  studentOnly,
  teacherOnly,
  adminOnly,
  superAdminOnly,
  authorizeRoles } =require('../middleware/authMiddleware')
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and Registration Operations
 */

/**
 * @swagger
 * /api/auth/register/student:
*   post:
 *     summary: Register a new teacher => (adminOnly)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       200:
 *         description: Teacher registered successfully
 */

router.post('/register/student',authMiddleware,adminOnly, registerStudent);

/**
 * @swagger
 * /api/auth/register/teacher:
 *   post:
 *     summary: Register a new teacher => (adminOnly)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterTeacher'
 *     responses:
 *       200:
 *         description: Teacher registered successfully
 */

router.post('/register/teacher',authMiddleware,adminOnly, registerTeacher);

/**
 * @swagger
 * /api/auth/register/admin:
 *   post:
 *     summary: Register a new admin => (superAdminOnly)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterAdmin'
 *     responses:
 *       200:
 *         description: Admin registered successfully
 */

router.post('/register/admin' ,authMiddleware,authorizeRoles('superAdmin'),registerAdmin);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login using user code and mosque code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code_user
 *               - mosque_code
 *             properties:
 *               code_user:
 *                 type: string
 *               mosque_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 *       400:
 *         description: Invalid login credentials
 */

router.post('/login', loginUser);
/**
 * @swagger
 * /api/auth/login/superadmin:
 *   post:
 *     summary: Super Admin login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code_user
 *             properties:
 *               code_user:
 *                 type: string
 *                 example: SUPER001
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 */

router.post('/login/superadmin', loginSuperAdmin);

module.exports = router;
