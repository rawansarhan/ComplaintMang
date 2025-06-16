const express = require('express');
const { mosqueCreate } = require('../controllers/MosqueController');
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
 */
router.post('/create', mosqueCreate);

module.exports = router;
