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
  createQuranRecitation,
  updateQuranRecitation,
  showAllRecitationsForStudent
} = require('../controllers/talkeenRecitation')

/**
 * @swagger
 * /api/talkeen-recitation/create:
 *   post:
 *     summary: Create a new talkeen Recitation record (teacher only)
 *     tags: [QuranTalkeen]
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
 *               - from_sura_id
 *               - from_verse
 *               - to_sura_id
 *               - to_verse
 *               - attendance
 *             properties:
 *               session_id:
 *                 type: integer
 *               student_id:
 *                 type: integer
 *               from_sura_id:
 *                 type: integer
 *               from_verse:
 *                 type: integer
 *               to_sura_id:
 *                 type: integer
 *               to_verse:
 *                 type: integer
 *               attendance:
 *                 type: boolean
 *           example:
 *             session_id: 10
 *             student_id: 5
 *             from_sura_id: 2
 *             from_verse: 1
 *             to_sura_id: 2
 *             to_verse: 5
 *             attendance: true
 *     responses:
 *       200:
 *         description: Talkeen recitation record created successfully.
 *       400:
 *         description: Validation error or bad request.
 *       409:
 *         description: Record already exists for this session and student.
 *       500:
 *         description: Internal server error.
 */

router.post('/create', authMiddleware, teacherOnly, createQuranRecitation)
/**
 * @swagger
 * /api/talkeen-recitation/{id}:
 *   put:
 *     summary: Update an existing Talkeen Recitation record (teacher only)
 *     tags: [QuranTalkeen]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Quran Recitation record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from_sura_id:
 *                 type: integer
 *               from_verse:
 *                 type: integer
 *               to_sura_id:
 *                 type: integer
 *               to_verse:
 *                 type: integer
 *           example:
 *             from_sura_id: 2
 *             from_verse: 5
 *             to_sura_id: 2
 *             to_verse: 10
 *     responses:
 *       200:
 *         description: Talkeen recitation record updated successfully.
 *       400:
 *         description: Validation error or bad request.
 *       404:
 *         description: Record not found.
 *       500:
 *         description: Internal server error.
 */

router.put('/:id', authMiddleware, teacherOnly, updateQuranRecitation)
/**
 * @swagger
 * /api/talkeen-recitation/showAll/{id}:
 *   get:
 *     summary: Get all Talkeen recitations for a student => (onlyteacher)
 *     tags: [QuranTalkeen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Student ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of Quran recitations
 *       404:
 *         description: No Talkeen recitations found for this student
 *       500:
 *         description: Internal server error
 */

router.get(
  '/showAll/:id',
  authMiddleware,
  teacherOnly,
  showAllRecitationsForStudent
)


module.exports = router;
