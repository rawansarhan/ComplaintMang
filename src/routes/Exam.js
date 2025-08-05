const express = require('express');
const { 
  authMiddleware,
  teacherOnly,
  } =require('../middleware/authMiddleware')
const router = express.Router();
const {
  examCreate,
  examGetAll,
  examUpdate,
  AddMarksCreate
} = require('../controllers/ExamController');
/**
 * @swagger
 * /api/exam/examCreate/{id}:
 *   post:
 *     summary: Create an exam for a lesson session
 *     tags: [Exam]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Lesson session ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, date]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 400
 *                 example: "Final Exam - Algebra"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-10"
 *               description:
 *                 type: string
 *                 example: "This is the final exam covering all chapters."
 *     responses:
 *       200:
 *         description: Exam created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lesson exam created successfully"
 *                 lessonSession:
 *                   $ref: '#/components/schemas/LessonSession'
 *                 data:
 *                   $ref: '#/components/schemas/Exam'
 *       400:
 *         description: Validation error or bad request
 *       404:
 *         description: Lesson session not found
 */

router.post('/examCreate/:id', authMiddleware, teacherOnly, examCreate);
/**
 * @swagger
 * /api/exam/update/{id}:
 *   put:
 *     summary: Update an existing exam
 *     tags: [Exam]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Exam ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Exam Title"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-15"
 *               description:
 *                 type: string
 *                 example: "Updated exam description"
 *     responses:
 *       200:
 *         description: Exam updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Exam updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Exam'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Exam not found
 */

router.put('/update/:id', authMiddleware, teacherOnly, examUpdate);
/**
 * @swagger
 * /api/exam/getAll/{id}:
 *   get:
 *     summary: Get all exams for a specific circle
 *     tags: [Exam]
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
 *         description: Exams retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All exams retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exam'
 *       404:
 *         description: Circle not found
 */

router.get('/getAll/:id', authMiddleware, teacherOnly, examGetAll);
/**
 * @swagger
 * /api/exam/AddMarksCreate/{id}:
 *   post:
 *     summary: Add or update exam marks for multiple students
 *     tags: [Exam]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exam ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     student_id:
 *                       type: integer
 *                       example: 101
 *                     score:
 *                       type: integer
 *                       example: 85
 *                     has_taken_exam:
 *                       type: boolean
 *                       example: true
 *                     notes:
 *                       type: string
 *                       example: "Good performance"
 *     responses:
 *       200:
 *         description: Marks added or updated successfully
 *       400:
 *         description: Validation error or bad student ID
 *       404:
 *         description: Exam not found
 */

router.post('/AddMarksCreate/:id', authMiddleware, teacherOnly, AddMarksCreate);
module.exports = router;
