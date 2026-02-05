const mongoose = require('mongoose');
const Counter = require('./Counter');

const NotebookSchema = new mongoose.Schema({
    _id: { type: Number },
    name: {
        type: String,
        required: [true, 'Please add a notebook name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    owner: {
        type: Number,
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
}, { _id: false });

NotebookSchema.pre('save', async function(next) {
    if (this.isNew) {
        this._id = await Counter.getNextSequence('notebookId');
    }
    next();
});

// Cascade delete notes and tasks when a notebook is deleted - Optional feature, avoiding for now to keep things simple or manual
// In a real app we might want to cascade delete or prevent delete.
// Requirement says: "Prevent deleting a notebook if OPEN tasks exist"

module.exports = mongoose.model('Notebook', NotebookSchema);
