import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import {
    allblogByUserId,
    categoryBlogs,
    createBlog,
    latestBlogs,
    trendingBlogs,
} from '../controllers/blog.controller.js';

const router = express.Router();

router.get('/allblog/:userId', allblogByUserId);
router.get('/latest-blogs', latestBlogs);
router.get('/trending-blogs', trendingBlogs);
router.get('/category/:cate', categoryBlogs);
router.post('/create-blog/:userId', authenToken, createBlog);

export default router;
