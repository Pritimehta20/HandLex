import express from 'express';
import { listSigns, getSign, getCategories, getSignsByCategory } from '../controllers/sign.controller.js';

const router = express.Router();

router.get('/categories/all', getCategories);
router.get('/category/:category', getSignsByCategory);
router.get('/', listSigns);
router.get('/:id', getSign);

export default router;
