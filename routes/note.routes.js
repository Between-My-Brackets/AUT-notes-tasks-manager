const express = require('express');
const {
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote
} = require('../controllers/note.controller');

// Merge params to allow getting notes from notebook route
const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Note management
 */

/**
 * @swagger
 * /api/notebooks/{notebookId}/notes:
 *   get:
 *     summary: Get all notes for a specific notebook
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notebookId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the notebook
 *     responses:
 *       200:
 *         description: A list of notes
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
 *                     $ref: '#/components/schemas/Note'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Notebook not found
 *   post:
 *     summary: Create a new note in a specific notebook
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notebookId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the notebook
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Note created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Notebook not found
 */
router
    .route('/')
    .get(getNotes)
    .post(createNote);

/**
 * @swagger
 * /api/notebooks/{notebookId}/notes/{id}:
 *   get:
 *     summary: Get single note by ID for a specific notebook
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notebookId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the notebook
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the note to retrieve
 *     responses:
 *       200:
 *         description: Successful response with the note data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Notebook or Note not found
 *   put:
 *     summary: Update a note by ID for a specific notebook
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notebookId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the notebook
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the note to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Notebook or Note not found
 *   delete:
 *     summary: Delete a note by ID for a specific notebook
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notebookId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the notebook
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the note to delete
 *     responses:
 *       200:
 *         description: Note deleted successfully
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
 *       404:
 *         description: Notebook or Note not found
 */
router
    .route('/:id')
    .get(getNote)
    .put(updateNote)
    .delete(deleteNote);

module.exports = router;
