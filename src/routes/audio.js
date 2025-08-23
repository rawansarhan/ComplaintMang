const express = require('express')
const {
  uploadAudio,
  getAllAudiosForStudent,
  getAudioById,
  deleteAudio,
  createComment,
  getAllAudiosForTeacher
} = require('../controllers/AudioController')
const {
  authMiddleware,
  studentOnly,
  teacherOnly,
  adminOnly,
  superAdminOnly,
  authorizeRoles
} = require('../middleware/authMiddleware')

const router = express.Router()
/**
 * @swagger
 * tags:
 *   name: UserAudio
 *   description: Manage student audio uploads
 */

/**
 * @swagger
 * /api/UserAudio/uploadAudio:
 *   post:
 *     summary: Upload a new audio file for a student
 *     tags: [UserAudio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - audio
 *               - surah_id
 *               - from_ayah_id
 *               - to_ayah_id
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: Audio file (mp3, wav, m4a)
 *               surah_id:
 *                 type: integer
 *                 example: 1
 *               from_ayah_id:
 *                 type: integer
 *                 example: 1
 *               to_ayah_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Audio uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example:  Audio uploaded and saved successfully
 *                 data:
 *                   $ref: '#/components/schemas/UserAudio'
 *       400:
 *         description: Validation error or invalid file type
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserAudio:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         student_id:
 *           type: integer
 *         surah_id:
 *           type: integer
 *         from_ayah_id:
 *           type: integer
 *         to_ayah_id:
 *           type: integer
 *         file:
 *           type: string
 *           example: 1692801234-123456789.mp3
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

router.post('/uploadAudio', authMiddleware, studentOnly, uploadAudio)
/**
 * @swagger
 * /api/UserAudio/getAllAudiosForStudent:
 *   get:
 *     summary: Get all audios uploaded by the logged-in student
 *     tags: [UserAudio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all audios for the student
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All audios retrieved successfully
 *                 audios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserAudio'
 *       404:
 *         description: No audios found for this student
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You don't have any audio yet
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */

router.get(
  '/getAllAudiosForStudent',
  authMiddleware,
  studentOnly,
  getAllAudiosForStudent
)
/**
 * @swagger
 * /api/UserAudio/getAudioById/{id}:
 *   get:
 *     summary: Get a specific audio by ID (with its comment if available) =>(student only)
 *     tags: [UserAudio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the audio
 *     responses:
 *       200:
 *         description: Audio retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Audio retrieved successfully
 *                 audio:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     filePath:
 *                       type: string
 *                       example: "/audios/1755959981597-47937656.mp3"
 *                     from_ayah_id:
 *                       type: integer
 *                     to_ayah_id:
 *                       type: integer
 *                     surah_name:
 *                       type: string
 *                       example: "Al-Faatiha"
 *                 comment:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                     audio_id:
 *                       type: integer
 *                     text:
 *                       type: string
 *                       example: "Good recitation, but try to improve tajweed."
 *                     rate:
 *                       type: integer
 *                     teacher_id:
 *                       type: integer
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Audio not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */

router.get('/getAudioById/:id', authMiddleware, studentOnly, getAudioById)
/**
 * @swagger
 * /api/UserAudio/delete/{id}:
 *   delete:
 *     summary: Delete an audio by ID (student can delete only their own audios)
 *     tags: [UserAudio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the audio to delete
 *     responses:
 *       200:
 *         description: Audio deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Audio deleted successfully
 *       404:
 *         description: Audio not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Audio not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */

router.delete('/delete/:id', authMiddleware, studentOnly, deleteAudio)
/**
 * @swagger
 * /api/UserAudio/comment/{id}:
 *   post:
 *     summary: Create a new comment on a student's audio (Teacher only)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the audio to comment on
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - audio_id
 *               - text
 *               - rate
 *             properties:
 *               textComment:
 *                 type: string
 *                 description: Comment content
 *                 example: "Good recitation, but you need to improve tajweed."
 *               rate:
 *                 type: integer
 *                 description: Rating out of 5
 *                 example: 4
 *     responses:
 *       200:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment created successfully
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     teacher_id:
 *                       type: integer
 *                     textComment:
 *                       type: string
 *                       example: "Good recitation, but you need to improve tajweed."
 *                     rate:
 *                       type: integer
 *                       example: 4
 *       400:
 *         description: Validation error
 *       404:
 *         description: Audio not found
 *       401:
 *         description: Unauthorized (only teachers can add comments)
 *       500:
 *         description: Server error
 */

router.post('/comment/:id', authMiddleware, teacherOnly, createComment)
/**
 * @swagger
 * /api/UserAudio/getAllAudiosForTeacher:
 *   get:
 *     summary: Get all audios uploaded for teacher
 *     tags: [UserAudio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all audios for the student
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All audios retrieved successfully
 *                 audios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserAudio'
 *       404:
 *         description: No audios found for this student
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No audios found for this student
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */

router.get(
  '/getAllAudiosForTeacher',
  authMiddleware,
  teacherOnly,
  getAllAudiosForTeacher
)



module.exports = router
