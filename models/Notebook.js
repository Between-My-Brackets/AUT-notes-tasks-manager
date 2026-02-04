const mongoose = require('mongoose');

const NotebookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a notebook name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Cascade delete notes and tasks when a notebook is deleted - Optional feature, avoiding for now to keep things simple or manual
// In a real app we might want to cascade delete or prevent delete.
// Requirement says: "Prevent deleting a notebook if OPEN tasks exist"

module.exports = mongoose.model('Notebook', NotebookSchema);
