import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import { createBlog } from '../controllers/blog.controller.js';
import { allblogByUserId } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/allblog/:userId', allblogByUserId);
router.post('/create-blog/:userId', authenToken, createBlog);

export default router;
