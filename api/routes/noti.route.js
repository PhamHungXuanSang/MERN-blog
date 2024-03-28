import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import { newNotification } from '../controllers/noti.controller.js';

const router = express.Router();

router.get('/newNotification', authenToken, newNotification);

export default router;
