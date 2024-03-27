import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import { sendEmail, verifyEmail, sendEmailOTP, verifyEmailOTP } from '../controllers/email.controller.js';

const router = express.Router();

router.post('/sendEmail', sendEmail);
router.get('/verify', verifyEmail);
router.post('/sendEmailOTP', authenToken, sendEmailOTP);
router.post('/verifyEmailOTP', authenToken, verifyEmailOTP);

export default router;
