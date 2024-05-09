import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller.js';
import { authenToken } from '../utils/authenToken.js';

const router = express.Router();

router.get('/:userToChatId', authenToken, getMessages);
router.post('/send/:receiverId', authenToken, sendMessage);

export default router;
