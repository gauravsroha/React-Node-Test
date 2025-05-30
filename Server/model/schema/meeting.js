const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    agenda: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    dateTime: {
        type: Date
    },
    notes: {
        type: String
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const MeetingHistory = mongoose.models.MeetingHistory || 
                      mongoose.model('MeetingHistory', meetingSchema, 'MeetingHistory');

module.exports = MeetingHistory;