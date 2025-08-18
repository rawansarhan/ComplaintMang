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
  AllAyahAndSurah
} = require('../controllers/QuranController');
/**
 * @swagger
 * /api/SurahAndAyah/AllSurahAndAyah:
 *   get:
 *     summary: Get all surahs and their ayahs (teacher only)
 *     tags: [Surah]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of surahs and their ayahs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All surahs with their ayahs
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       surah:
 *                         $ref: '#/components/schemas/Surah'
 *                       ayahs:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Ayah'
 *       404:
 *         description: No ayahs found for surahs
 *       500:
 *         description: Internal server error
 */


router.get('/AllSurahAndAyah',authMiddleware,teacherOnly,AllAyahAndSurah);
module.exports = router
