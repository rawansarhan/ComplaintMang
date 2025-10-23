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
  showAllRecitationsForStudent,
  mySaved
} = require('../controllers/QuranRecitationController')
const {
  createQuranRecitationOnline,
  updateQuranRecitationOnline
} = require('../controllers/QuranRecititionOnline')
/**
 * @swagger
 * /api/quran-recitation/create:
 *   post:
 *     summary: Create a new Quran Recitation record (teacher only)
 *     tags: [QuranRecitation]
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
 *               - is_counted
 *               - is_exam
 *               - attendance
 *               - new_pages
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
 *               is_counted:
 *                 type: boolean
 *               is_exam:
 *                 type: boolean
 *               attendance:
 *                 type: boolean
 *               new_pages:
 *                 type: integer
 *             example:
 *               session_id: 10
 *               student_id: 5
 *               from_sura_id: 2
 *               from_verse: 1
 *               to_sura_id: 2
 *               to_verse: 5
 *               is_counted: true
 *               is_exam: false
 *               attendance: true
 *               new_pages: 3
 *     responses:
 *       200:
 *         description: Quran recitation record created successfully.
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
 * /api/quran-recitation/{id}:
 *   put:
 *     summary: Update an existing Quran Recitation record (teacher only)
 *     tags: [QuranRecitation]
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
 *               is_counted:
 *                 type: boolean
 *               is_exam:
 *                 type: boolean
 *               new_pages:
 *                 type: integer
 *           example:
 *             from_sura_id: 2
 *             from_verse: 5
 *             to_sura_id: 2
 *             to_verse: 10
 *             is_counted: false
 *             is_exam: true
 *             new_pages: 5
 *     responses:
 *       200:
 *         description: Quran recitation record updated successfully.
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
 * /api/quran-recitation/showAll/{id}:
 *   get:
 *     summary: Get all Quran recitations for a student => (onlyteacher)
 *     tags: [QuranRecitation]
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
 *         description: No Quran recitations found for this student
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
 * /api/quran-recitation/getMySaved:
 *   get:
 *     summary: Get all Quran recitations for a student => (onlystudent)
 *     tags: [QuranRecitation]
 *     responses:
 *       200:
 *         description: List of Quran recitations
 *       404:
 *         description: No Quran recitations found for this student
 *       500:
 *         description: Internal server error
 */

router.get(
  '/getMySaved',
  authMiddleware,
  studentOnly,
  mySaved
)

/**
 * @swagger
 * /api/quran-recitation/createOnline:
 *   post:
 *     summary: Create a new Quran Recitation online record (teacher only)
 *     tags: [IndividualRecitationQuran]
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
 *               - from_sura_id
 *               - from_verse
 *               - to_sura_id
 *               - to_verse
 *               - is_counted
 *               - is_exam
 *               - date
 *             properties:
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
 *               is_counted:
 *                 type: boolean
 *               is_exam:
 *                 type: boolean
 *               date:
 *                 type: string
 *                 format: date
 *              new_pages: 
 *                  type: integer
 *           example:
 *             student_id: 5
 *             from_sura_id: 2
 *             from_verse: 1
 *             to_sura_id: 2
 *             to_verse: 5
 *             is_counted: true
 *             is_exam: false
 *             date: "2024-07-01"
 *             new_pages :5
 *     responses:
 *       201:
 *         description: Quran recitation record created successfully.
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
  createQuranRecitationOnline
);

/**
 * @swagger
 * /api/quran-recitation/updateOnline/{id}:
 *   put:
 *     summary: Update an existing Quran Recitation online record (teacher only)
 *     tags: [IndividualRecitationQuran]
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
 *               is_counted:
 *                 type: boolean
 *               is_exam:
 *                 type: boolean
 *               date:
 *                 type: string
 *                 format: date
 *               new_pages: 
 *                  type: integer
 *           example:
 *             from_sura_id: 2
 *             from_verse: 5
 *             to_sura_id: 2
 *             to_verse: 10
 *             is_counted: false
 *             is_exam: true
 *             date: "2024-07-01"
 *             new_pages : 5
 *     responses:
 *       200:
 *         description: Quran recitation record updated successfully.
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
  updateQuranRecitationOnline
);

module.exports = router;
