import express from 'express';
import { search } from '../controllers/search.controller.js';

const router = express.Router();

router.post('/:query', search);

export default router;
