const express = require('express');
const { 
  authMiddleware,
  teacherOnly,
  authorizeRoles
  } =require('../middleware/authMiddleware')
const router = express.Router();
const {
  getAllStudent,
  createSession_attendance,
  createLessonSession,
  updateLessonSession,
  GetAllSessionesLession,
} = require('../controllers/LessonController');

/**
 * @swagger
 * /api/LessonSession/createLessonSession/{id}:
 *   post:
 *     summary: Create a new lesson session for a specific circle (teacher only)
 *     tags: [LessonSession]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the circle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, date, description]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Algebra Basics"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-01"
 *               description:
 *                 type: string
 *                 example: "An intro to basic algebra concepts"
 *     responses:
 *       200:
 *         description: Lesson session created successfully.
 *       400:
 *         description: Validation error or bad request.
 *       404:
 *         description: Circle not found.
 */
router.post('/createLessonSession/:id', authMiddleware, teacherOnly, createLessonSession);
/**
 * @swagger
 * /api/LessonSession/updateLessonSession/{id}:
 *   post:
 *     summary: Update a lesson session (teacher only)
 *     tags: [LessonSession]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lesson session to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 400
 *                 example: "Updated Lesson Title"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-02"
 *               description:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 400
 *                 example: "Updated description for the lesson"
 *     responses:
 *       200:
 *         description: Lesson session updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lesson session updated successfully"
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/LessonSession'
 *       400:
 *         description: Validation error or bad request
 *       404:
 *         description: Lesson session not found
 *       500:
 *         description: Internal server error
 */

router.post('/updateLessonSession/:id', authMiddleware, teacherOnly, updateLessonSession);
/**
 * @swagger
 * /api/LessonSession/GetAllSessionesLession/{id}:
 *   get:
 *     summary: Get all lesson sessions for a specific circle (teacher only)
 *     tags: [LessonSession]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the circle
 *     responses:
 *       200:
 *         description: All lesson sessions retrieved successfully
 *       404:
 *         description: No lesson sessions or circle not found
 */

router.get('/GetAllSessionesLession/:id', authMiddleware,  authorizeRoles('student','teacher'), GetAllSessionesLession);

/**
 * @swagger
 * /api/LessonSession/createSessionAttendance/{id}:
 *   post:
 *     summary: Create attendance records for students in a lesson session
 *     tags: [LessonAttendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Lesson session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [student_id]
 *             properties:
 *               student_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Attendance created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Lesson session or student not found
 */
router.post('/createSessionAttendance/:id', authMiddleware, teacherOnly, createSession_attendance);
/**
 * @swagger
 * /api/LessonSession/getAllStudentForAttendance/{id}:
 *   get:
 *     summary: Get all students from same mosque who haven't attended this session
 *     tags: [LessonAttendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Lesson session ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Students without attendance retrieved successfully"
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       404:
 *         description: Lesson session not found
 */

router.get('/getAllStudentForAttendance/:id', authMiddleware, teacherOnly, getAllStudent);

module.exports = router;