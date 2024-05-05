import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import {
    latestBlogs,
    allCategoryTrendingHightestRatedBlogs,
    categoryBlogs,
    createBlog,
    editBlog,
    readBlog,
    updateLikeBlog,
    ratingBlog,
    deleteBlog,
    manageBlogs,
    blockBlog,
    adminBlogManagement,
} from '../controllers/blog.controller.js';

const router = express.Router();

router.get('/latest-blogs', latestBlogs);
router.get('/trending-hightest-rated-blogs', allCategoryTrendingHightestRatedBlogs);
router.get('/category/:cate', categoryBlogs);
router.post('/create-blog/:userId', authenToken, createBlog);
router.post('/edit-blog/:slug', authenToken, editBlog);
router.get('/read-blog/:slug/:userId', readBlog);
router.post('/update-like-blog/:userId', authenToken, updateLikeBlog);
router.post('/rating-blog/:blogId/:userId', authenToken, ratingBlog);
router.delete('/delete-blog/:blogId', authenToken, deleteBlog);
router.post('/manage-blogs/:userId', manageBlogs);
router.post('/block-blog/:userId', authenToken, blockBlog);
router.post('/admin-blog-management', authenToken, adminBlogManagement);

export default router;
