import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    getAllUser,
    updateUserRole,
    resetPassword,
    changePassword,
    getViewedBlogsHistory,
    toggleSubscribe,
    getTopAuthors,
    getAllUserProfile,
    getUserSubscribeAuthors,
    getAllNotThisUser,
    getSubscribedStatus,
    getSuggestedBlog,
} from '../controllers/user.controller.js';
import { authenToken } from '../utils/authenToken.js';

const router = express.Router();

router.get('/profile/:username', getUserProfile);
router.put('/update-profile/:userId', authenToken, updateUserProfile);
router.get('/get-all-user', getAllUser);
router.put('/update-user-role/:userId', authenToken, updateUserRole);
router.put('/resetPassword/:email', resetPassword);
router.put('/changePassword/:email', changePassword);
router.get(`/get-viewed-blogs-history/:userId`, authenToken, getViewedBlogsHistory);
router.get(`/toggle-subscribe/:authorId/:userId`, authenToken, toggleSubscribe);
router.post('/get-top-authors', getTopAuthors);
router.post('/get-all-user-profile', getAllUserProfile);
router.post('/get-user-subscribe-authors', authenToken, getUserSubscribeAuthors);
router.get('/get-all-not-this-user', authenToken, getAllNotThisUser);
router.post('/get-subscribed-status', authenToken, getSubscribedStatus);
router.post('/get-suggested-blog/:userId', authenToken, getSuggestedBlog);

export default router;
