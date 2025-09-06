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
  statisticsForAdmin
} = require('../controllers/Statistics');

/**
 * @swagger
 * /api/Statistics/statisticsForAdmin:
 *   post:
 *     summary: Get statistics for all students in mosque (admin only)
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromDate
 *               - toDate
 *             properties:
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-01
 *               toDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-06
 *     responses:
 *       200:
 *         description: List of statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All Statistics
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       studentInf:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                             example: Ahmed
 *                           lastName:
 *                             type: string
 *                             example: Ali
 *                       sessions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 12
 *                             date:
 *                               type: string
 *                               format: date
 *                               example: 2025-09-01
 *                       attendance:
 *                         type: integer
 *                         example: 5
 *                       savedQuran:
 *                         type: integer
 *                         example: 20
 *                       savedHadith:
 *                         type: integer
 *                         example: 15
 *       400:
 *         description: Validation error (invalid or missing dates)
 *       404:
 *         description: No students found
 *       500:
 *         description: Internal server error
 */



router.post('/statisticsForAdmin',authMiddleware,adminOnly,statisticsForAdmin);
module.exports = router