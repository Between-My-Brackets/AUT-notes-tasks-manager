const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a note title'],
        trim: true,
        maxlength: [100, 'Title can not be more than 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add content'],
    },
    notebookId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Notebook',
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Note', NoteSchema);
