const express = require('express');
const {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog
} = require('../controllers/blog.controller');

// Merge params to allow getting blogs from notebook route
const router = express.Router({ mergeParams: true });

// Note: Blogs are now unprotected, so no 'protect' middleware here.

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management
 */

/**
 * @swagger
 * /api/notebooks/{notebookId}/blogs:
 *   get:
 *     summary: Get all blogs for a specific notebook
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: notebookId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the notebook
 *     responses:
 *       200:
 *         description: A list of blogs
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
 *                     $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Notebook not found
 *   post:
 *     summary: Create a new blog in a specific notebook
 *     tags: [Blogs]
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
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized (if ownership check fails)
 *       404:
 *         description: Notebook not found
 */
router
    .route('/')
    .get(getBlogs)
    .post(createBlog);

/**
 * @swagger
 * /api/notebooks/{notebookId}/blogs/{id}:
 *   get:
 *     summary: Get single blog by ID for a specific notebook
 *     tags: [Blogs]
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
 *         description: ID of the blog to retrieve
 *     responses:
 *       200:
 *         description: Successful response with the blog data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Notebook or Blog not found
 *   put:
 *     summary: Update a blog by ID for a specific notebook
 *     tags: [Blogs]
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
 *         description: ID of the blog to update
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
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized (if ownership check fails)
 *       404:
 *         description: Notebook or Blog not found
 *   delete:
 *     summary: Delete a blog by ID for a specific notebook
 *     tags: [Blogs]
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
 *         description: ID of the blog to delete
 *     responses:
 *       200:
 *         description: Blog deleted successfully
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
 *         description: Not authorized (if ownership check fails)
 *       404:
 *         description: Notebook or Blog not found
 */
router
    .route('/:id')
    .get(getBlog)
    .put(updateBlog)
    .delete(deleteBlog);

module.exports = router;