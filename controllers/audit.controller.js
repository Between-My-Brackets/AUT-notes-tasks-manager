const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const AuditLog = require('../models/AuditLog');

// @desc      Get all audit logs
// @route     GET /api/audit-logs
// @route     GET /api/audits
// @access    Private (Admin only)
exports.getAuditLogs = asyncHandler(async (req, res, next) => {
    const logs = await AuditLog.find().sort({ timestamp: -1 });

    res.status(200).json({
        success: true,
        count: logs.length,
        data: logs
    });
});

// @desc      Get single audit log
// @route     GET /api/audit-logs/:id
// @access    Private (Admin only)
exports.getAuditLog = asyncHandler(async (req, res, next) => {
    const log = await AuditLog.findById(req.params.id);

    if (!log) {
        return next(new ErrorResponse(`Audit log not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: log
    });
});

// @desc      Create manual audit log
// @route     POST /api/audit-logs
// @access    Private (Admin only)
exports.createAuditLog = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.userId = req.user.id;

    const log = await AuditLog.create(req.body);

    res.status(201).json({
        success: true,
        data: log
    });
});

// @desc      Update audit log (Integrity test)
// @route     PUT /api/audit-logs/:id
// @access    Private (Admin only)
exports.updateAuditLog = asyncHandler(async (req, res, next) => {
    let log = await AuditLog.findById(req.params.id);

    if (!log) {
        return next(new ErrorResponse(`Audit log not found with id of ${req.params.id}`, 404));
    }

    log = await AuditLog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: log
    });
});

// @desc      Delete single audit log
// @route     DELETE /api/audit-logs/:id
// @access    Private (Admin only)
exports.deleteAuditLog = asyncHandler(async (req, res, next) => {
    const log = await AuditLog.findById(req.params.id);

    if (!log) {
        return next(new ErrorResponse(`Audit log not found with id of ${req.params.id}`, 404));
    }

    await log.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc      Clear all audit logs
// @route     DELETE /api/audit-logs
// @access    Private (Admin only)
exports.clearAuditLogs = asyncHandler(async (req, res, next) => {
    await AuditLog.deleteMany();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc      Get audit logs by entity
// @route     GET /api/audit-logs/entity/:entity
// @access    Private (Admin only)
exports.getAuditLogsByEntity = asyncHandler(async (req, res, next) => {
    const logs = await AuditLog.find({ entity: req.params.entity }).sort({ timestamp: -1 });

    res.status(200).json({
        success: true,
        count: logs.length,
        data: logs
    });
});
