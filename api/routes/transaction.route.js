import express from 'express';
import { checkFreeTrial, getFreeTrial, checkCreatePermission } from '../controllers/transaction.controller.js';
import { authenToken } from '../utils/authenToken.js';

const router = express.Router();

router.post('/checkFreeTrial/:userId', authenToken, checkFreeTrial);
router.post('/getFreeTrial/:userId', authenToken, getFreeTrial);
router.get('/checkCreatePermission/:userId', checkCreatePermission);

export default router;
