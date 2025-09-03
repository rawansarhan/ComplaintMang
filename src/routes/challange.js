const express = require('express');
const router = express.Router();
const {
AllAgeGroups,
AgeGroupById,
createChallenge,
createLevel2,
challangeTeasher,
createLevel1,
AllTaskChallenge
  
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
 * /api/challenge/allTasksForStudent/{id}:
 *   get:
 *     summary: Get a tasks for student (student)
 *     tags:
 *       - Challenge
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
router.get('/allTasksForStudent/:id', authMiddleware, studentOnly, AgeGroupById);


/**
 * @swagger
 * /api/challenge/createChallengelevel/{id}:
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
 *                 type: integer
 *                 description: ID of the student
 *             example:
 *               student_id: 4
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


router.post('/createChallengelevel/:id', authMiddleware, adminOnly, createChallenge);
/**
 * @swagger
 * /api/challenge/createChallangelevel1/{id}:
 *   post:
 *     summary: second step to create challenge tasks  (Level 1) - Admin Only
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
 *             example:
 *               taskQuranId: 3
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


router.post('/createChallangelevel1/:id', authMiddleware, adminOnly, createLevel1);
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

router.post('/createChallangelevel2/:id', authMiddleware, adminOnly, createLevel2);
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

/**
 * @swagger
 * /api/challenge/showChallenge/{id}:
 *   get:
 *     summary: Get challenge for this student => (teacherOnly)
 *     tags: [Challenge]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Successfully retrieved challenge tasks
 *       404:
 *         description: No challenge found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/showChallenge/:id',
  authMiddleware,
  authorizeRoles('admin', 'teacher'),
  AllTaskChallenge
);
module.exports = router;
