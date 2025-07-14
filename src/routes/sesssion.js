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
  sessionCreate,
  showAllSession
} = require('../controllers/sessionController');
/**
 * @swagger
 * /api/session/create:
 *   post:
 *     summary: Create a new session (teacher only)
 *     tags: [CircleSession]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - circle_id
 *               - date
 *             properties:
 *               circle_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *           example:
 *             circle_id: 1
 *             date: "2024-07-01"
 *     responses:
 *       200:
 *         description: session created successfully.
 *       400:
 *         description: Validation error or bad request.
 *       409:
 *         description: Record already exists for this session and student.
 *       500:
 *         description: Internal server error.
 */


router.post('/create', authMiddleware, teacherOnly, sessionCreate);
/**
 * @swagger
 * /api/session/showAll:
 *   get:
 *     summary: Get all sessions =>(teacherOnly)
 *     tags: [CircleSession]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved session 
 *       500:
 *         description: Internal server error
 * 
 */

router.get('/showAll',authMiddleware,teacherOnly,showAllSession);

module.exports = router
