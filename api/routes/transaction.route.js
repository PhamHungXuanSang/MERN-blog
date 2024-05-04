import express from 'express';
import {
    checkFreeTrial,
    getFreeTrial,
    checkCreatePermission,
    paypalPayment,
    getTransactionHistory,
    createPaymentLink,
} from '../controllers/transaction.controller.js';
import { authenToken } from '../utils/authenToken.js';

const router = express.Router();

router.post('/checkFreeTrial/:userId', authenToken, checkFreeTrial);
router.post('/getFreeTrial/:userId', authenToken, getFreeTrial);
router.get('/checkCreatePermission/:userId', checkCreatePermission);
router.post('/paypal-payment', authenToken, paypalPayment);
router.get(`/get-transaction-history/:userId`, authenToken, getTransactionHistory);
router.post('/create-payment-link', authenToken, createPaymentLink);

export default router;
