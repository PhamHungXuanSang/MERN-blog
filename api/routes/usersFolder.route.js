import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import { addNewFolder, getUserFolder, saveBlogToFolder } from '../controllers/usersFolder.controller.js';

const router = express.Router();

router.post('/get-user-folders/:userId', authenToken, getUserFolder);
router.post('/add-new-folder/:userId', authenToken, addNewFolder);
router.post(`/save-blog-to-folder/:userId`, authenToken, saveBlogToFolder);

export default router;
