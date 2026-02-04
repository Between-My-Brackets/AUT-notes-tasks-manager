const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Task = require('../models/Task');
const Notebook = require('../models/Notebook');

// @desc      Get tasks
// @route     GET /api/tasks
// @route     GET /api/notebooks/:notebookId/tasks
// @access    Private
exports.getTasks = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.notebookId) {
        query = Task.find({ notebookId: req.params.notebookId });
    } else {
        const notebooks = await Notebook.find({ owner: req.user.id });
        const notebookIds = notebooks.map(nb => nb._id);
        query = Task.find({ notebookId: { $in: notebookIds } });
    }

    const tasks = await query;

    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});

// @desc      Get single task
// @route     GET /api/tasks/:id
// @access    Private
exports.getTask = asyncHandler(async (req, res, next) => {
    const task = await Task.findById(req.params.id).populate({
        path: 'notebookId',
        select: 'name owner'
    });

    if (!task) {
        return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
    }

    if (task.notebookId.owner.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this task`, 401));
    }

    res.status(200).json({
        success: true,
        data: task
    });
});

// @desc      Create task
// @route     POST /api/notebooks/:notebookId/tasks
// @access    Private
exports.createTask = asyncHandler(async (req, res, next) => {
    req.body.notebookId = req.params.notebookId;

    const notebook = await Notebook.findById(req.params.notebookId);

    if (!notebook) {
        return next(new ErrorResponse(`Notebook not found with id of ${req.params.notebookId}`, 404));
    }

    if (notebook.owner.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a task to this notebook`, 401));
    }

    if (notebook.isArchived) {
        return next(new ErrorResponse(`Cannot add task to archived notebook`, 400));
    }

    const task = await Task.create(req.body);

    res.status(201).json({
        success: true,
        data: task
    });
});

// @desc      Update task
// @route     PUT /api/tasks/:id
// @access    Private
exports.updateTask = asyncHandler(async (req, res, next) => {
    let task = await Task.findById(req.params.id);

    if (!task) {
        return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
    }

    const notebook = await Notebook.findById(task.notebookId);

    if (notebook.owner.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this task`, 401));
    }

    if (notebook.isArchived) {
         return next(new ErrorResponse(`Cannot update task in archived notebook`, 400));
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: task
    });
});

// @desc      Delete task
// @route     DELETE /api/tasks/:id
// @access    Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
    }

    const notebook = await Notebook.findById(task.notebookId);

    if (notebook.owner.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this task`, 401));
    }

    if (notebook.isArchived) {
         return next(new ErrorResponse(`Cannot delete task from archived notebook`, 400));
    }

    await task.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
