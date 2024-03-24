import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import { getStatistical } from '../controllers/statistical.controller.js';

const router = express.Router();

router.get('/get-statistical', authenToken, getStatistical);

export default router;
