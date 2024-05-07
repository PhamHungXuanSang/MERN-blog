import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import {
    addNewCate,
    getAllCategory,
    getAllNotBlockedCategory,
    blockCategory,
    deleteCategory,
} from '../controllers/category.controller.js';

const router = express.Router();

router.post('/add-new-category', authenToken, addNewCate);
router.get('/get-all-category', getAllCategory);
router.get('/get-all-not-blocked-category', getAllNotBlockedCategory);
router.post('/block-category/:userId', authenToken, blockCategory);
router.delete('/delete-category/:userId', authenToken, deleteCategory);

export default router;
