import express from 'express';
import {
    checkFreeTrial,
    getFreeTrial,
    checkCreatePermission,
    storePayment,
    getTransactionHistory,
    createPaymentLink,
    getPaymentInfo,
    adminViewAllTransaction,
    getCreateDate,
} from '../controllers/transaction.controller.js';
import { authenToken } from '../utils/authenToken.js';

const router = express.Router();

router.post('/checkFreeTrial/:userId', authenToken, checkFreeTrial);
router.post('/getFreeTrial/:userId', authenToken, getFreeTrial);
router.get('/checkCreatePermission/:userId', checkCreatePermission);
router.post('/store-payment', authenToken, storePayment);
router.get(`/get-transaction-history/:userId`, authenToken, getTransactionHistory);
router.post('/create-payment-link', createPaymentLink);
router.post('/get-payment-info/:orderCode', getPaymentInfo);
router.get('/admin-view-all-transaction', authenToken, adminViewAllTransaction);
router.get('/getCreateDate/:userId', authenToken, getCreateDate);

export default router;
