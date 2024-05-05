import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    deleteAccount,
    getAllUser,
    updateUserRole,
    resetPassword,
    changePassword,
    getViewedBlogsHistory,
    toggleSubscribe,
    getTopAuthors,
    getAllUserProfile,
    getUserSubscribeAuthors,
} from '../controllers/user.controller.js';
import { authenToken } from '../utils/authenToken.js';

const router = express.Router();

router.get('/profile/:username', getUserProfile);
router.put('/update-profile/:userId', authenToken, updateUserProfile);
router.delete('/delete-account/:userId', authenToken, deleteAccount);
router.get('/get-all-user', getAllUser);
router.put('/update-user-role/:userId', authenToken, updateUserRole);
router.put('/resetPassword/:email', resetPassword);
router.put('/changePassword/:email', changePassword);
router.get(`/get-viewed-blogs-history/:userId`, authenToken, getViewedBlogsHistory);
router.get(`/toggle-subscribe/:authorId/:userId`, authenToken, toggleSubscribe);
router.post('/get-top-authors', getTopAuthors);
router.post('/get-all-user-profile', getAllUserProfile);
router.post('/get-user-subscribe-authors', getUserSubscribeAuthors);

export default router;
