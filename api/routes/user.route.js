import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    deleteAccount,
    getAllUser,
    updateUserRole,
    resetPassword,
    getViewedBlogsHistory,
    toggleSubscribe,
} from '../controllers/user.controller.js';
import { authenToken } from '../utils/authenToken.js';

const router = express.Router();

router.get('/profile/:username', getUserProfile);
router.put('/update-profile/:userId', authenToken, updateUserProfile);
router.delete('/delete-account/:userId', authenToken, deleteAccount);
router.get('/get-all-user', authenToken, getAllUser);
router.put('/update-user-role/:userId', authenToken, updateUserRole);
router.put('/resetPassword/:email', resetPassword);
router.get(`/get-viewed-blogs-history/:userId`, authenToken, getViewedBlogsHistory);
router.get(`/toggle-subscribe/:authorId/:userId`, authenToken, toggleSubscribe);

export default router;
