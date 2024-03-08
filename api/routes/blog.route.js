import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import {
    latestBlogs,
    trendingBlogs,
    categoryBlogs,
    createBlog,
    readBlog,
    editBlog,
} from '../controllers/blog.controller.js';

const router = express.Router();

router.get('/latest-blogs', latestBlogs);
router.get('/trending-blogs', trendingBlogs);
router.get('/category/:cate', categoryBlogs);
router.post('/create-blog/:userId', authenToken, createBlog);
router.get('/read-blog/:slug', readBlog);
router.post('/edit-blog/:slug', authenToken, editBlog);

export default router;
