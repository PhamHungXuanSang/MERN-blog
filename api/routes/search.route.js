import express from 'express';
import { search, searchUsers, suggestTags } from '../controllers/search.controller.js';

const router = express.Router();

router.post('/:query', search);
router.post('/users/:query', searchUsers);
router.get('/suggestTags/:tag', suggestTags);

export default router;
