const express = require('express')
const router = express.Router()
const {
  authMiddleware,
  studentOnly,
  teacherOnly,
  adminOnly,
  superAdminOnly,
  authorizeRoles
} = require('../middleware/authMiddleware')
const {
  createHadithRecitation,
  updateHadithRecitation,
  showAllRecitationsForStudent
} = require('../controllers/HadithRecitationController')
const {
  createHadithRecitationOnline,
  updateHadithRecitationOnline
} = require('../controllers/HadithRecitationOnline')
/**
 * @swagger
 * /api/hadith-recitation/create:
 *   post:
 *     summary: Create a new hadith Recitation record (teacher only)
 *     tags: [HadithRecitation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_id
 *               - student_id
 *               - book_id
 *               - from_hadith
 *               - to_hadith
 *               - is_counted
 *               - is_exam
 *               - attendance
 *             properties:
 *               session_id:
 *                 type: integer
 *               student_id:
 *                 type: integer
 *               book_id:
 *                 type: integer
 *               from_hadith:
 *                 type: integer
 *               to_hadith:
 *                 type: integer
 *               is_counted:
 *                 type: boolean
 *               is_exam:
 *                 type: boolean
 *               attendance:
 *                 type: boolean
 *           example:
 *             session_id: 10
 *             student_id: 5
 *             book_id: 2
 *             from_hadith: 1
 *             to_hadith: 2
 *             is_counted: true
 *             is_exam: false
 *             attendance: true
 *     responses:
 *       200:
 *         description: Hadith recitation record created successfully.
 *       400:
 *         description: Validation error or bad request.
 *       409:
 *         description: Record already exists for this session and student.
 *       500:
 *         description: Internal server error.
 */


router.post('/create', authMiddleware, teacherOnly, createHadithRecitation)
/**
 * @swagger
 * /api/hadith-recitation/{id}:
 *   put:
 *     summary: Update an existing Hadith Recitation record (teacher only)
 *     tags: [HadithRecitation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the hadith Recitation record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from_hadith:
 *                 type: integer
 *               to_hadith:
 *                 type: integer
 *               is_counted:
 *                 type: boolean
 *               is_exam:
 *                 type: boolean
 *           example:
 *             from_hadith: 2
 *             to_hadith: 5
 *             is_counted: false
 *             is_exam: false
 *     responses:
 *       200:
 *         description: Hadith recitation record updated successfully.
 *       400:
 *         description: Validation error or bad request.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Internal server error.
 */

router.put('/:id', authMiddleware, teacherOnly, updateHadithRecitation)
/**
 * @swagger
 * /api/hadith-recitation/showAll/{id}:
 *   get:
 *     summary: Get all hadith recitations for a student => (onlyteacher)
 *     tags: [HadithRecitation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Student ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of hadith recitations
 *       404:
 *         description: No hadith recitations found for this student
 *       500:
 *         description: Internal server error
 */

router.get(
  '/showAll/:id',
  authMiddleware,
  teacherOnly,
  showAllRecitationsForStudent
)

/**
 * @swagger
 * /api/hadith-recitation/createOnline:
 *   post:
 *     summary: Create a new hadith Recitation online record (teacher only)
 *     tags: [UndividualRecitationHadith]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - book_id
 *               - from_hadith
 *               - to_hadith
 *               - is_counted
 *               - is_exam
 *               - date
 *             properties:
 *               student_id:
 *                 type: integer
 *               book_id:
 *                 type: integer
 *               from_hadith:
 *                 type: integer
 *               to_hadith:
 *                 type: integer
 *               is_counted:
 *                 type: boolean
 *               is_exam:
 *                 type: boolean
 *               date:
 *                 type: string
 *                 format: date
 *           example:
 *             student_id: 5
 *             book_id: 2
 *             from_hadith: 1
 *             to_hadith: 2
 *             is_counted: true
 *             is_exam: false
 *             date: "2024-07-01"
 *     responses:
 *       200:
 *         description: Hadith recitation record created successfully.
 *       400:
 *         description: Validation error or bad request.
 *       409:
 *         description: Record already exists for this session and student.
 *       500:
 *         description: Internal server error.
 */
router.post(
  '/createOnline',
  authMiddleware,
  teacherOnly,
  createHadithRecitationOnline
)

/**
 * @swagger
 * /api/hadith-recitation/updateOnline/{id}:
 *   put:
 *     summary: Update an existing hadith Recitation online record (teacher only)
 *     tags: [UndividualRecitationHadith]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the hadith Recitation record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from_hadith:
 *                 type: integer
 *               to_hadith:
 *                 type: integer
 *               is_counted:
 *                 type: boolean
 *               is_exam:
 *                 type: boolean
 *           example:
 *             from_hadith: 2
 *             to_hadith: 5
 *             is_counted: false
 *             is_exam: true
 *     responses:
 *       200:
 *         description: Hadith recitation record updated successfully.
 *       400:
 *         description: Validation error or bad request.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Internal server error.
 */
router.put(
  '/updateOnline/:id',
  authMiddleware,
  teacherOnly,
  updateHadithRecitationOnline
)

module.exports = router
