const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Blog = require('../models/Blog');
const Notebook = require('../models/Notebook');

// @desc      Get blogs
// @route     GET /api/notebooks/:notebookId/blogs
// @access    Public (formerly Private)
exports.getBlogs = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.notebookId) {
        query = Blog.find({ notebookId: req.params.notebookId });
    } else {
        // Since roles are removed, we can simplify this.
        // We'll allow getting all blogs if not specified by notebook, but generally they are nested.
        // For now, let's assume getBlogs is always called with notebookId as per the route definition.
        // If there's no notebookId, we should not return all blogs.
        return next(new ErrorResponse('Please specify a notebook ID', 400));
    }

    const blogs = await query;

    res.status(200).json({
        success: true,
        count: blogs.length,
        data: blogs
    });
});

// @desc      Get single blog
// @route     GET /api/notebooks/:notebookId/blogs/:id
// @access    Public
exports.getBlog = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id).populate({
        path: 'notebookId',
        select: 'name owner'
    });

    if (!blog) {
        return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
    }

    // Check ownership (no longer role-based, simply check if it belongs to the user or is public)
    // For now, if a blog is found by ID, we'll assume it's accessible.
    // If we wanted to restrict access to a blog based on notebook ownership even for unprotected GET,
    // we would need more logic here. For unprotected GET, it implies anyone can view if they have the ID.

    res.status(200).json({
        success: true,
        data: blog
    });
});

// @desc      Add blog
// @route     POST /api/notebooks/:notebookId/blogs
// @access    Public
exports.createBlog = asyncHandler(async (req, res, next) => {
    req.body.notebookId = req.params.notebookId;

    const notebook = await Notebook.findById(req.params.notebookId);

    if (!notebook) {
        return next(new ErrorResponse(`Notebook not found with id of ${req.params.notebookId}`, 404));
    }

    // Check ownership
    if (notebook.owner !== req.user.id) { // Use === for number IDs
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a blog to this notebook`, 401));
    }

    // Check if notebook is archived - Requirement: "Archived notebooks reject new notes/tasks"
    if (notebook.isArchived) {
        return next(new ErrorResponse(`Cannot add blog to archived notebook`, 400));
    }

    const blog = await Blog.create(req.body);

    res.status(201).json({
        success: true,
        data: blog
    });
});

// @desc      Update blog
// @route     PUT /api/notebooks/:notebookId/blogs/:id
// @access    Public
exports.updateBlog = asyncHandler(async (req, res, next) => {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
    }

    const notebook = await Notebook.findById(blog.notebookId);

    if (notebook.owner !== req.user.id) { // Use !== for number IDs
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this blog`, 401));
    }

    if (notebook.isArchived) {
         return next(new ErrorResponse(`Cannot update blog in archived notebook`, 400));
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: blog
    });
});

// @desc      Delete blog
// @route     DELETE /api/notebooks/:notebookId/blogs/:id
// @access    Public
exports.deleteBlog = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
    }

    const notebook = await Notebook.findById(blog.notebookId);

    if (notebook.owner !== req.user.id) { // Use !== for number IDs
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this blog`, 401));
    }

    if (notebook.isArchived) {
         return next(new ErrorResponse(`Cannot delete blog from archived notebook`, 400));
    }

    await blog.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
