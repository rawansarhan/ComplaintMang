const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/Auth')
const {
  hasPermission,
  authMiddlewaree
} = require('../middlewares/authMiddleware') // ⬅️ افترض أن لديك middleware للتحقق من هوية المستخدم

// -------------------- Register for employee ---------------------//
/**
 * @swagger
 * /api/auth/registerAdmin:
 *   post:
 *     summary: Register a new employee => (adminOnly)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterEmployee'
 *     responses:
 *       200:
 *         description: Employee registered successfully
 */
router.post(
  '/registerAdmin',
  authMiddlewaree,
  hasPermission('admin_register_employee'),
  AuthController.registerEmployee
)
//---------------------- register for citizen ---------------------//

/**
 * @swagger
 * /api/auth/registerCitizen:
 *   post:
 *     summary: Register a new citizen => (citizen)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterCitizen'
 *     responses:
 *       200:
 *         description: Employee registered successfully
 */
router.post('/registerCitizen', AuthController.registerCitizen)

////-------------------login for admin and Employee---------///
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: login for admin and employee
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: login successfully
 */
router.post('/login', AuthController.login)

// -------------------- Login Step 1 --------------------//
/**
 * @swagger
 * /api/auth/loginStep1:
 *   post:
 *     summary: OTP (Login Step 1)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: login step 1 successfully
 */
router.post('/loginStep1', AuthController.loginStep1)

// -------------------- Verify OTP Step 2 --------------------
/**
 * @swagger
 * /api/auth/verify_otp:
 *   post:
 *     summary: login step 2 (verify_otp)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtp'
 *     responses:
 *       200:
 *         description: login step 2 successfully
 */
router.post('/verify_otp', AuthController.verifyOtp)

/**
 * @swagger
 * /api/auth/permission:
 *   get:
 *     summary: Get all permission
 *     tags: [Permission]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions
 */
router.get(
  '/permission',
  authMiddlewaree,
  hasPermission('get_all_permission'),
  AuthController.getAllPermissionController
)

module.exports = router
