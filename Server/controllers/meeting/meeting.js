const MeetingHistory = require('../../model/schema/meeting')
const User = require('../../model/schema/user')
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        const { agenda, location, dateTime, notes, createBy } = req.body;
        
        const meeting = new MeetingHistory({
            agenda,
            location,
            dateTime,
            notes,
            createBy,
            timestamp: new Date()
        });

        await meeting.save();
        res.status(201).json({ message: 'Meeting created successfully', data: meeting });
    } catch (error) {
        console.error('Error creating meeting:', error);
        res.status(400).json({ message: 'Failed to create meeting', error: error.message });
    }
}

const index = async (req, res) => {
    try {
        const meetings = await MeetingHistory.find({ deleted: false })
            .populate('createBy', 'firstName lastName')
            .sort({ createdDate: -1 });

        const formattedMeetings = meetings.map(meeting => ({
            _id: meeting._id,
            agenda: meeting.agenda,
            location: meeting.location,
            dateTime: meeting.dateTime,
            notes: meeting.notes,
            createdDate: meeting.createdDate,
            timestamp: meeting.timestamp,
            createBy: meeting.createBy?._id,
            createdByName: meeting.createBy ? `${meeting.createBy.firstName} ${meeting.createBy.lastName}` : 'Unknown'
        }));

        res.status(200).json({ data: formattedMeetings });
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ message: 'Failed to fetch meetings', error: error.message });
    }
}

const view = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid meeting ID' });
        }

        const meeting = await MeetingHistory.findOne({ _id: id, deleted: false })
            .populate('createBy', 'firstName lastName');

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        const formattedMeeting = {
            _id: meeting._id,
            agenda: meeting.agenda,
            location: meeting.location,
            dateTime: meeting.dateTime,
            notes: meeting.notes,
            createdDate: meeting.createdDate,
            timestamp: meeting.timestamp,
            createBy: meeting.createBy?._id,
            createdByName: meeting.createBy ? `${meeting.createBy.firstName} ${meeting.createBy.lastName}` : 'Unknown'
        };

        res.status(200).json({ data: formattedMeeting });
    } catch (error) {
        console.error('Error fetching meeting:', error);
        res.status(500).json({ message: 'Failed to fetch meeting', error: error.message });
    }
}

const deleteData = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid meeting ID' });
        }

        const meeting = await MeetingHistory.findByIdAndUpdate(
            id,
            { deleted: true },
            { new: true }
        );

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        console.error('Error deleting meeting:', error);
        res.status(500).json({ message: 'Failed to delete meeting', error: error.message });
    }
}

const deleteMany = async (req, res) => {
    try {
        console.log('Delete request body:', req.body);
        
        let ids = req.body.ids || req.body;
        
        if (Array.isArray(ids) && ids.length > 0) {
            const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
            
            if (validIds.length === 0) {
                return res.status(400).json({ message: 'No valid IDs provided' });
            }

            const result = await MeetingHistory.updateMany(
                { _id: { $in: validIds }, deleted: false },
                { deleted: true }
            );

            res.status(200).json({ 
                message: `${result.modifiedCount} meetings deleted successfully`,
                deletedCount: result.modifiedCount
            });
        } else if (typeof ids === 'string' && mongoose.Types.ObjectId.isValid(ids)) {
            const result = await MeetingHistory.findByIdAndUpdate(
                ids,
                { deleted: true },
                { new: true }
            );

            if (!result) {
                return res.status(404).json({ message: 'Meeting not found' });
            }

            res.status(200).json({ 
                message: '1 meeting deleted successfully',
                deletedCount: 1
            });
        } else {
            return res.status(400).json({ message: 'Invalid IDs format provided' });
        }
    } catch (error) {
        console.error('Error deleting meetings:', error);
        res.status(500).json({ message: 'Failed to delete meetings', error: error.message });
    }
}

module.exports = { add, index, view, deleteData, deleteMany }