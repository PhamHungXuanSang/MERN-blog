import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import {
    newNotification,
    getNotifications,
    allNotificationCount,
    deleteNotification,
    markAsRead,
} from '../controllers/noti.controller.js';

const router = express.Router();

router.get('/newNotification/:userId', authenToken, newNotification);
router.post(`/get-notifications/:userId`, authenToken, getNotifications);
router.post(`/allNotificationCount/:userId`, authenToken, allNotificationCount);
router.delete(`/delete-notification/:notificationId`, authenToken, deleteNotification);
router.post(`/mark-as-read/:notificationId`, authenToken, markAsRead);

export default router;
