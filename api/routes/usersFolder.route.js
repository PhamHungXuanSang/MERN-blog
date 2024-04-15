import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import {
    addNewFolder,
    getUserFolder,
    saveBlogToFolder,
    getBlogsByFolder,
    deleteBlogInFolder,
    deleteFolder,
} from '../controllers/usersFolder.controller.js';

const router = express.Router();

router.post('/get-user-folders/:userId', authenToken, getUserFolder);
router.post('/add-new-folder/:userId', authenToken, addNewFolder);
router.post(`/save-blog-to-folder/:userId`, authenToken, saveBlogToFolder);
router.post(`/get-blogs-by-folder/:userId`, authenToken, getBlogsByFolder);
router.delete('/delete-blog-in-folder/:userId', authenToken, deleteBlogInFolder);
router.delete('/delete-folder/:userId', authenToken, deleteFolder);

export default router;
