const express = require('express');
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/task.controller');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 */

/**
 * @swagger
 * /api/notebooks/{notebookId}/tasks:
 *   get:
 *     summary: Get all tasks for a specific notebook
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notebookId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the notebook
 *     responses:
 *       200:
 *         description: A list of tasks
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
 *                     $ref: '#/components/schemas/Task'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Notebook not found
 *   post:
 *     summary: Create a new task in a specific notebook
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notebookId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the notebook
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *             properties:
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [OPEN, DONE]
 *                 default: OPEN
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Notebook not found
 */
router
    .route('/')
    .get(getTasks)
    .post(createTask);

/**
 * @swagger
 * /api/notebooks/{notebookId}/tasks/{id}:
 *   get:
 *     summary: Get single task by ID for a specific notebook
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notebookId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the notebook
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the task to retrieve
 *     responses:
 *       200:
 *         description: Successful response with the task data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Notebook or Task not found
 *   put:
 *     summary: Update a task by ID for a specific notebook
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notebookId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the notebook
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [OPEN, DONE]
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Notebook or Task not found
 *   delete:
 *     summary: Delete a task by ID for a specific notebook
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notebookId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the notebook
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the task to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
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
 *         description: Notebook or Task not found
 *       403:
 *         description: Not authorized to delete this task (e.g., if note does not exist)
 */
router
    .route('/:id')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;
