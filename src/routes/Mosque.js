const express = require('express');
const {
  mosqueCreate,
  mosqueAllShow,
  mosqueShowById,
  mosqueUpdate,
  mosqueDelete
} = require('../controllers/MosqueController');

const { 
  authMiddleware,
  studentOnly,
  teacherOnly,
  adminOnly,
  superAdminOnly,
  authorizeRoles } =require('../middleware/authMiddleware')
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mosque
 *   description: Mosque management endpoints
 */

/**
 * @swagger
 * /api/mosque/create:
 *   post:
 *     summary: Add a new mosque
 *     tags: [Mosque]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mosque created successfully
 *       400:
 *         description: Validation error or bad request
 *       409:
 *         description: Mosque already exists
 */
router.post('/create',authMiddleware,superAdminOnly,mosqueCreate);

/**
 * @swagger
 * /api/mosque:
 *   get:
 *     summary: Get all mosques
 *     tags: [Mosque]
 *     responses:
 *       200:
 *         description: List of mosques
 *       500:
 *         description: Internal server error
 */
router.get('/',authMiddleware,superAdminOnly,mosqueAllShow);

/**
 * @swagger
 * /api/mosque/{id}:
 *   get:
 *     summary: Get a mosque by ID
 *     tags: [Mosque]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Mosque ID
 *     responses:
 *       200:
 *         description: Mosque data
 *       404:
 *         description: Mosque not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id',authMiddleware, authorizeRoles('superAdmin','admin'), mosqueShowById);

/**
 * @swagger
 * /api/mosque/update/{id}:
 *   put:
 *     summary: Update a mosque
 *     tags: [Mosque]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Mosque ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mosque updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Mosque not found
 *       500:
 *         description: Internal server error
 */
router.put('/update/:id',authMiddleware,superAdminOnly,mosqueUpdate);

/**
 * @swagger
 * /api/mosque/delete/{id}:
 *   delete:
 *     summary: Delete a mosque
 *     tags: [Mosque]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Mosque ID
 *     responses:
 *       200:
 *         description: Mosque deleted successfully
 *       404:
 *         description: Mosque not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:id',authMiddleware,superAdminOnly,mosqueDelete);

module.exports = router;
