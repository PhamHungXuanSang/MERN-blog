import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import { addComment, getBlogComment } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/add-comment', authenToken, addComment);
router.post('/get-blog-comments', getBlogComment);

export default router;
