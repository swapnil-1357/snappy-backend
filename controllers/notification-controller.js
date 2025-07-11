const NotificationModel = require('../model/NotificationModel');
const getNotifications = async (req, res) => {
    try {
        const uid = req.headers['uid'];
        const notifications = await NotificationModel.find({ userId: uid }).sort({ timestamp: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

const markAllSeen = async (req, res) => {
    try {
        const uid = req.headers['uid'];
        await NotificationModel.updateMany({ userId: uid, seen: false }, { $set: { seen: true } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to mark notifications as seen' });
    }
};

const deleteNotification = async (req, res) => {
    try {
        await NotificationModel.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
};

module.exports = {
    getNotifications,
    markAllSeen,
    deleteNotification,
};
