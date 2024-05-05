import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import { newNotification, getNotifications, deleteNotification, markAsRead } from '../controllers/noti.controller.js';

const router = express.Router();

router.get('/newNotification/:userId', newNotification);
router.post(`/get-notifications/:userId`, authenToken, getNotifications);
router.delete(`/delete-notification/:notificationId`, authenToken, deleteNotification);
router.post(`/mark-as-read/:notificationId`, authenToken, markAsRead);

export default router;
