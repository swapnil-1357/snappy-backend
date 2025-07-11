const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markAllSeen,
    deleteNotification,
    createNotification,
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

router
    .route('/create')
    .post(createNotification);

module.exports = router;
