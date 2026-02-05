const mongoose = require('mongoose');
const Counter = require('./Counter');

const TaskSchema = new mongoose.Schema({
    _id: { type: Number },
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
        type: Number,
        ref: 'Notebook',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

TaskSchema.pre('save', async function(next) {
    if (this.isNew) {
        this._id = await Counter.getNextSequence('taskId');
    }
    next();
});

module.exports = mongoose.model('Task', TaskSchema);
