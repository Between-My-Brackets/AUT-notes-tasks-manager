const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Note = require('../models/Note');
const Notebook = require('../models/Notebook');

// @desc      Get notes
// @route     GET /api/notes
// @route     GET /api/notebooks/:notebookId/notes
// @access    Private
exports.getNotes = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.notebookId) {
        query = Note.find({ notebookId: req.params.notebookId });
    } else {
        // If getting all notes, arguably we should still filter by user ownership via notebook lookups or population
        // For simplicity, let's just return all notes for the user via a more complex query if needed
        // Or just require notebookId for now.
        // Let's implement getting all notes for the user.
        // We need to find all notebooks owned by user first.
        const notebooks = await Notebook.find({ owner: req.user.id });
        const notebookIds = notebooks.map(nb => nb._id);
        query = Note.find({ notebookId: { $in: notebookIds } });
    }

    const notes = await query;

    res.status(200).json({
        success: true,
        count: notes.length,
        data: notes
    });
});

// @desc      Get single note
// @route     GET /api/notes/:id
// @access    Private
exports.getNote = asyncHandler(async (req, res, next) => {
    const note = await Note.findById(req.params.id).populate({
        path: 'notebookId',
        select: 'name owner'
    });

    if (!note) {
        return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
    }

    // Check ownership
    if (note.notebookId.owner.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this note`, 401));
    }

    res.status(200).json({
        success: true,
        data: note
    });
});

// @desc      Add note
// @route     POST /api/notebooks/:notebookId/notes
// @access    Private
exports.createNote = asyncHandler(async (req, res, next) => {
    req.body.notebookId = req.params.notebookId;

    const notebook = await Notebook.findById(req.params.notebookId);

    if (!notebook) {
        return next(new ErrorResponse(`Notebook not found with id of ${req.params.notebookId}`, 404));
    }

    // Check ownership
    if (notebook.owner.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a note to this notebook`, 401));
    }

    // Check if notebook is archived - Requirement: "Archived notebooks reject new notes/tasks"
    if (notebook.isArchived) {
        return next(new ErrorResponse(`Cannot add note to archived notebook`, 400));
    }

    const note = await Note.create(req.body);

    res.status(201).json({
        success: true,
        data: note
    });
});

// @desc      Update note
// @route     PUT /api/notes/:id
// @access    Private
exports.updateNote = asyncHandler(async (req, res, next) => {
    let note = await Note.findById(req.params.id);

    if (!note) {
        return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
    }

    // Check ownership (need to populate or fetch notebook)
    // To be efficient, let's fetch notebook separately if needed, but note.notebookId is just an ID unless populated
    // We need to check the notebook owner.
    const notebook = await Notebook.findById(note.notebookId);

    if (notebook.owner.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this note`, 401));
    }

    if (notebook.isArchived) {
         return next(new ErrorResponse(`Cannot update note in archived notebook`, 400));
    }

    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: note
    });
});

// @desc      Delete note
// @route     DELETE /api/notes/:id
// @access    Private
exports.deleteNote = asyncHandler(async (req, res, next) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
        return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
    }

    const notebook = await Notebook.findById(note.notebookId);

    if (notebook.owner.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this note`, 401));
    }

    if (notebook.isArchived) {
         return next(new ErrorResponse(`Cannot delete note from archived notebook`, 400));
    }

    await note.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
