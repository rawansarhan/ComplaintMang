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
 *               description:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *           example:
 *             circle_id: 1
 *             date: "2024-07-01"
 *             description: "new session for math class"
 *     responses:
 *       200:
 *         description: Session created successfully.
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
 * /api/session/showAll/{id}:
 *   get:
 *     summary: Get all sessions for a specific circle (teacher only)
 *     tags: [CircleSession]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Circle ID
 *     responses:
 *       200:
 *         description: Successfully retrieved session 
 *       500:
 *         description: Internal server error
 * 
 */

router.get('/showAll/:id',authMiddleware,teacherOnly,showAllSession);

module.exports = router
