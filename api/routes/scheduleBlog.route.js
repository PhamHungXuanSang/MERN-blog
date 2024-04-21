import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import { addToSchedule } from '../controllers/scheduleBlog.controller.js';

const router = express.Router();

router.post('/add-to-schedule/:userId', authenToken, addToSchedule);

export default router;
