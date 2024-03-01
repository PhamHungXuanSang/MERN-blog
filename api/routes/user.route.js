import express from 'express';
import {
    getUserProfileById,
    updateUserProfile,
    signout,
    deleteAccount,
} from '../controllers/user.controller.js';
import { authenToken } from '../utils/authenToken.js';

const router = express.Router();

router.get('/profile/:userId', authenToken, getUserProfileById);
router.put('/update-profile/:userId', authenToken, updateUserProfile);
router.delete('/delete-account/:userId', authenToken, deleteAccount);
router.post('/signout', signout);

export default router;
