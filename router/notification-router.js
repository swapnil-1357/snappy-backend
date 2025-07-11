const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markAllSeen,
    deleteNotification,
} = require('../controllers/notification-controller');

router
    .route('/get')
    .get(getNotifications);

router
    .route('/mark-all-seen')
    .put(markAllSeen);

router
    .route('/delete/:id')
    .delete(deleteNotification);

module.exports = router;
