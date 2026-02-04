const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Notebook = require('../models/Notebook');

// @desc      Get all notebooks (User sees only their own)
// @route     GET /api/notebooks
// @access    Private
exports.getNotebooks = asyncHandler(async (req, res, next) => {
    const notebooks = await Notebook.find({ owner: req.user.id });

    res.status(200).json({
        success: true,
        count: notebooks.length,
        data: notebooks
    });
});

// @desc      Get single notebook
// @route     GET /api/notebooks/:id
// @access    Private
exports.getNotebook = asyncHandler(async (req, res, next) => {
    const notebook = await Notebook.findById(req.params.id);

    if (!notebook) {
        return next(new ErrorResponse(`Notebook not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns the notebook
    if (notebook.owner.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this notebook`, 401));
    }

    res.status(200).json({
        success: true,
        data: notebook
    });
});

// @desc      Create new notebook
// @route     POST /api/notebooks
// @access    Private
exports.createNotebook = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.owner = req.user.id;

    const notebook = await Notebook.create(req.body);

    res.status(201).json({
        success: true,
        data: notebook
    });
});

// @desc      Update notebook
// @route     PUT /api/notebooks/:id
// @access    Private
exports.updateNotebook = asyncHandler(async (req, res, next) => {
    let notebook = await Notebook.findById(req.params.id);

    if (!notebook) {
        return next(new ErrorResponse(`Notebook not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns the notebook
    if (notebook.owner.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this notebook`, 401));
    }

    // Logic: Archived notebooks cannot be updated (except maybe to unarchive? - keeping simple)
    // Requirement says: "Archived notebooks reject new notes/tasks", doesn't explicitly say cannot update notebook itself.
    // However, let's allow updating name/archive status.

    notebook = await Notebook.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: notebook
    });
});

// @desc      Delete notebook
// @route     DELETE /api/notebooks/:id
// @access    Private
exports.deleteNotebook = asyncHandler(async (req, res, next) => {
    const notebook = await Notebook.findById(req.params.id);

    if (!notebook) {
        return next(new ErrorResponse(`Notebook not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns the notebook
    if (notebook.owner.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this notebook`, 401));
    }

    // Check for OPEN tasks - Requirement: "Prevent deleting a notebook if OPEN tasks exist"
    const Task = require('../models/Task');
    const openTasks = await Task.countDocuments({ notebookId: notebook._id, status: 'OPEN' });

    if (openTasks > 0) {
        return next(new ErrorResponse(`Cannot delete notebook with ${openTasks} open tasks`, 400));
    }

    await notebook.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
