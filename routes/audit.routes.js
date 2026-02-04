const express = require('express');
const {
    getAuditLogs,
    getAuditLog,
    createAuditLog,
    updateAuditLog,
    deleteAuditLog,
    clearAuditLogs,
    getAuditLogsByEntity
} = require('../controllers/audit.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

/**
 * @swagger
 * tags:
 *   name: Audit Logs
 *   description: Audit log management (Admin only)
 */

/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     summary: Get all audit logs
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of audit logs
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
 *                     $ref: '#/components/schemas/AuditLog'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not permitted (Admins only)
 *   post:
 *     summary: Create an audit log
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entity
 *               - action
 *               - userId
 *             properties:
 *               entity:
 *                 type: string
 *               action:
 *                 type: string
 *               userId:
 *                 type: string
 *               details:
 *                 type: object
 *     responses:
 *       201:
 *         description: Audit log created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/AuditLog'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not permitted (Admins only)
 *   delete:
 *     summary: Clear all audit logs
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All audit logs cleared successfully
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
 *         description: Not permitted (Admins only)
 */
router
    .route('/')
    .get(getAuditLogs)
    .post(createAuditLog)
    .delete(clearAuditLogs);

/**
 * @swagger
 * /api/audit-logs/entity/{entity}:
 *   get:
 *     summary: Get audit logs filtered by entity type
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entity
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the entity to filter audit logs by (e.g., User, Notebook)
 *     responses:
 *       200:
 *         description: A list of audit logs for the specified entity
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
 *                     $ref: '#/components/schemas/AuditLog'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not permitted (Admins only)
 */
router
    .route('/entity/:entity')
    .get(getAuditLogsByEntity);

/**
 * @swagger
 * /api/audit-logs/{id}:
 *   get:
 *     summary: Get single audit log by ID
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the audit log to retrieve
 *     responses:
 *       200:
 *         description: Successful response with the audit log data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/AuditLog'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not permitted (Admins only)
 *       404:
 *         description: Audit log not found
 *   put:
 *     summary: Update an audit log by ID (Note: Audit logs are typically immutable, use with caution)
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the audit log to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entity:
 *                 type: string
 *               action:
 *                 type: string
 *               userId:
 *                 type: string
 *               details:
 *                 type: object
 *     responses:
 *       200:
 *         description: Audit log updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/AuditLog'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not permitted (Admins only)
 *       404:
 *         description: Audit log not found
 *   delete:
 *     summary: Delete an audit log by ID
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the audit log to delete
 *     responses:
 *       200:
 *         description: Audit log deleted successfully
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
 *         description: Not permitted (Admins only)
 *       404:
 *         description: Audit log not found
 */
router
    .route('/:id')
    .get(getAuditLog)
    .put(updateAuditLog)
    .delete(deleteAuditLog);

module.exports = router;
