const express = require('express');
const router = express.Router();
const {
  registerStudent,
  registerTeacher,
  registerAdmin,
  loginUser
} = require('../controllers/AuthController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: عمليات تسجيل الدخول والتسجيل
 */

/**
 * @swagger
 * /api/auth/register/student:
 *   post:
 *     summary: تسجيل طالب جديد
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *               - mosque_id
 *               - birth_date
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               mosque_id:
 *                 type: integer
 *               birth_date:
 *                 type: string
 *                 format: date
 *               is_save_quran:
 *                 type: boolean
 *               phone:
 *                 type: string
 *               father_phone:
 *                 type: string
 *               address:
 *                 type: string
 *               certificates:
 *                 type: string
 *               experiences:
 *                 type: string
 *               memorized_parts:
 *                 type: string
 *     responses:
 *       201:
 *         description: تم تسجيل الطالب بنجاح
 *       400:
 *         description: بيانات غير صالحة أو المستخدم موجود بالفعل
 */
router.post('/register/student', registerStudent);

/**
 * @swagger
 * /api/auth/register/teacher:
 *   post:
 *     summary: تسجيل معلم جديد
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: تم تسجيل المعلم بنجاح
 */
router.post('/register/teacher', registerTeacher);

/**
 * @swagger
 * /api/auth/register/admin:
 *   post:
 *     summary: تسجيل مسؤول جديد
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: تم تسجيل المسؤول بنجاح
 */
router.post('/register/admin', registerAdmin);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: تسجيل الدخول باستخدام كود المستخدم ومعرف المسجد
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
 *                 type: integer
 *               mosque_code:
 *                 type: integer
 *     responses:
 *       200:
 *         description: تسجيل دخول ناجح مع JWT
 *       400:
 *         description: بيانات تسجيل دخول غير صحيحة
 */
router.post('/login', loginUser);

module.exports = router;
