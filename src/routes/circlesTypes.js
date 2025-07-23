const express = require('express');
const router = express.Router();

const {
  circleType,showAll
} = require('../controllers/circleTypeController');

const {
  authMiddleware,
  teacherOnly,
  authorizeRoles
} = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/circle-type/showAll:
 *   get:
 *     summary: Get all circle types (excluding hadith and lesson) with bookHadith =>(teacherOnly and admin)
 *     tags: [CircleType]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved circle types
 *       500:
 *         description: Internal server error
 */
router.get('/showAll', authMiddleware, authorizeRoles('admin','teacher'), circleType);
/**
 * @swagger
 * /api/circle-type/showAllType:
 *   get:
 *     summary: Get all circle types => (teacher and admin)
 *     tags: [CircleType]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved circle types
 *       500:
 *         description: Internal server error
 */
router.get('/showAllType', authMiddleware, authorizeRoles('admin','teacher'),showAll );
module.exports = router;

