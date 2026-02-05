const mongoose = require('mongoose');
const Counter = require('./Counter');

const BlogSchema = new mongoose.Schema({
    _id: { type: Number },
    title: {
        type: String,
        required: [true, 'Please add a blog title'],
        trim: true,
        maxlength: [100, 'Title can not be more than 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add content'],
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

BlogSchema.pre('save', async function(next) {
    if (this.isNew) {
        this._id = await Counter.getNextSequence('blogId');
    }
    next();
});

module.exports = mongoose.model('Blog', BlogSchema);
