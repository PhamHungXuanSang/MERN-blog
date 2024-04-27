import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import {
    addNewPackage,
    getAllPackages,
    getAllNotBlockedPackages,
    blockPackage,
} from '../controllers/package.controller.js';

const router = express.Router();

router.post('/add-new-package', authenToken, addNewPackage);
router.get('/get-all-packages', authenToken, getAllPackages); // Thêm code test thêm authen coi có sao không
router.get('/get-all-not-blocked-packages', authenToken, getAllNotBlockedPackages); // Thêm code test thêm authen coi có sao không
router.post('/block-package/:userId', authenToken, blockPackage);

export default router;
