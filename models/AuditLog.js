const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    entity: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    details: {
        type: Object, // Flexible field to store changed fields
        default: {}
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
