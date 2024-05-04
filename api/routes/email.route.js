import express from 'express';
import {
    sendEmail,
    verifyEmail,
    sendEmailOTP,
    verifyEmailOTP,
    sendContactUsEmail,
} from '../controllers/email.controller.js';

const router = express.Router();

router.post('/sendEmail', sendEmail);
router.get('/verify', verifyEmail);
router.post('/sendEmailOTP', sendEmailOTP);
router.post('/verifyEmailOTP', verifyEmailOTP);
router.post('/send-contact-us-email', sendContactUsEmail);

export default router;
