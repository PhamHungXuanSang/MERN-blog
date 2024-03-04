import express from 'express';
import { search, searchUsers } from '../controllers/search.controller.js';

const router = express.Router();

router.post('/:query', search);
router.post('/users/:query', searchUsers);

export default router;
