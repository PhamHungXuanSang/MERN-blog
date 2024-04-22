import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import {
    addToSchedule,
    scheduleBlogManagement,
    deleteScheduleBlog,
    editScheduleBlog,
} from '../controllers/scheduleBlog.controller.js';

const router = express.Router();

router.post('/add-to-schedule/:userId', authenToken, addToSchedule);
router.post('/schedule-blog-management/:userId', authenToken, scheduleBlogManagement);
router.delete('/delete-schedule-blog/:scheduleBlogId', authenToken, deleteScheduleBlog);
router.post('/edit-schedule-blog/:slug', authenToken, editScheduleBlog);

export default router;
