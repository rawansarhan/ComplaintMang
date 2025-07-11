const express = require('express');
const router = express.Router();
const {
AllAgeGroups,
AgeGroupById,
createChallenge,
createLevel2,
challangeTeasher
  
} = require('../controllers/challangeController');
const {
  authMiddleware,
  studentOnly,
  teacherOnly,
  adminOnly,
  superAdminOnly,
  authorizeRoles
} = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/challenge/allAgeGroup:
 *   get:
 *     summary: Get all age group =>(Admin and  student)
 *     tags: [Challenge]
 *     responses:
 *       200:
 *         description: List of ageGroup
 *       500:
 *         description: Internal server error
 */
router.get('/allAgeGroup',authMiddleware,authorizeRoles('student','admin'),AllAgeGroups);

/**
 * @swagger
 * /api/challenge/ageGroupById/{id}:
 *   get:
 *     summary: Get a specific age group by ID (student)
 *     tags:
 *       - Challenge
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Age group ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Age group fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AgeGroup'
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Age group not found
 */
router.get('/ageGroupById/:id', authMiddleware, studentOnly, AgeGroupById);


///id for ageGroup
/**
 * @swagger
 * /api/challenge/createChallengelevel1/{id}:
 *   post:
 *     summary: Create a new challenge for a student based on age group (Admin only)
 *     tags: [Challenge]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Age group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *               teacher_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               student_id: [10]
 *               teacher_id: [2]
 *     responses:
 *       200:
 *         description: Challenge created successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     challenge_id:
 *                       type: integer
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     challenge_id:
 *                       type: integer
 *                     quran:
 *                       type: array
 *                       items:
 *                         type: object
 *                     tasks_with_sublevels:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Validation error or student already has a challenge or invalid age group
 *       401:
 *         description: Unauthorized (if token is missing or user is not admin)
 */

router.post('/createChallengelevel1/:id', authMiddleware, adminOnly, createChallenge);
//id for challange
/**
 * @swagger
 * /api/challenge/createChallangelevel2/{id}:
 *   post:
 *     summary: Final step to create challenge tasks (Level 2) - Admin Only
 *     tags: [Challenge]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Challenge
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskQuranId:
 *                 type: integer
 *                 description: The ID of the Quran task to assign
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     task_id:
 *                       type: integer
 *                       description: The ID of the task
 *                     lavel_id:
 *                       type: integer
 *                       description: "The ID of the level (note: check spelling)"
 *             example:
 *               taskQuranId: 10
 *               data:
 *                 - task_id: 3
 *                   lavel_id: 1
 *                 - task_id: 4
 *                   lavel_id: 2
 *     responses:
 *       200:
 *         description: Challenge created and tasks assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 newChallengeTask:
 *                   type: object
 *                 updatedTasks:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Validation error
 *       404:
 *         description: Task or Challenge not found
 */

router.post('/createChallengelevel2/:id', authMiddleware, adminOnly, createLevel2);
//id for student
/**
 * @swagger
 * /api/challenge/ChallengePerformance/{id}:
 *   put:
 *     summary: Update challenge tasks performance for a student (Teacher Only)
 *     tags: [Challenge]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
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
 *                     task_id:
 *                       type: integer
 *                       example: 5
 *                     is_done:
 *                       type: boolean
 *                       example: true
 *             example:
 *               data:
 *                 - task_id: 1
 *                   is_done: true
 *                 - task_id: 2
 *                   is_done: false
 *     responses:
 *       200:
 *         description: Tasks updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 wallet:
 *                   type: object
 *       400:
 *         description: Validation error
 *       404:
 *         description: Challenge, Sublevel, or Wallet not found
 */

router.put('/ChallengePerformance/:id', authMiddleware, teacherOnly,challangeTeasher);







module.exports = router;
