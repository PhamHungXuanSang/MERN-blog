import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import {
    addComment,
    getBlogComment,
    getBlogReplies,
    deleteComment,
    getAllComment,
} from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/add-comment', authenToken, addComment);
router.post('/get-blog-comments', getBlogComment);
router.post('/get-blog-replies', getBlogReplies);
router.post('/delete-comment', authenToken, deleteComment);
router.get('/get-all-comment', getAllComment);

export default router;
