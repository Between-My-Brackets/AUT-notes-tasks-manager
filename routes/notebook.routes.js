const express = require('express');
const {
    getNotebooks,
    getNotebook,
    createNotebook,
    updateNotebook,
    deleteNotebook
} = require('../controllers/notebook.controller');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Re-route into other resource routers
const noteRouter = require('./note.routes');
const taskRouter = require('./task.routes');

router.use('/:notebookId/notes', noteRouter);
router.use('/:notebookId/tasks', taskRouter);

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Notebooks
 *   description: Notebook management
 */

/**
 * @swagger
 * /api/notebooks:
 *   get:
 *     summary: Get all notebooks
 *     tags: [Notebooks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notebooks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notebook'
 *       401:
 *         description: Not authorized
 *   post:
 *     summary: Create new notebook
 *     tags: [Notebooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               isArchived:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Notebook created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Notebook'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 */
router
    .route('/')
    .get(getNotebooks)
    .post(createNotebook);

/**
 * @swagger
 * /api/notebooks/{id}:
 *   get:
 *     summary: Get single notebook by ID
 *     tags: [Notebooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the notebook to retrieve
 *     responses:
 *       200:
 *         description: Successful response with the notebook data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Notebook'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Notebook not found
 *   put:
 *     summary: Update a notebook by ID
 *     tags: [Notebooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the notebook to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               isArchived:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notebook updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Notebook'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Notebook not found
 *   delete:
 *     summary: Delete a notebook by ID
 *     tags: [Notebooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the notebook to delete
 *     responses:
 *       200:
 *         description: Notebook deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to delete this notebook (e.g., if it has open tasks)
 *       404:
 *         description: Notebook not found
 */
router
    .route('/:id')
    .get(getNotebook)
    .put(updateNotebook)
    .delete(deleteNotebook);

module.exports = router;
