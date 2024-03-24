import express from 'express';
import { authenToken } from '../utils/authenToken.js';
import { addNewPackage, getAllPackages } from '../controllers/package.controller.js';

const router = express.Router();

router.post('/add-new-package', authenToken, addNewPackage);
router.get('/get-all-packages', getAllPackages);

export default router;
