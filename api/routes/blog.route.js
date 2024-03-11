import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import {
    latestBlogs,
    trendingBlogs,
    categoryBlogs,
    createBlog,
    editBlog,
    readBlog,
    updateLikeBlog,
    ratingBlog,
} from '../controllers/blog.controller.js';

const router = express.Router();

router.get('/latest-blogs', latestBlogs);
router.get('/trending-blogs', trendingBlogs);
router.get('/category/:cate', categoryBlogs);
router.post('/create-blog/:userId', authenToken, createBlog);
router.post('/edit-blog/:slug', authenToken, editBlog);
router.get('/read-blog/:slug', readBlog);
router.post('/update-like-blog/:userId', authenToken, updateLikeBlog);
router.post('/rating-blog/:blogId/:userId', authenToken, ratingBlog);

export default router;
