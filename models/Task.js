const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true
    },
    status: {
        type: String,
        enum: ['OPEN', 'DONE'],
        default: 'OPEN'
    },
    notebookId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Notebook',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', TaskSchema);
