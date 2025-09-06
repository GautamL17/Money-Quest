import express from 'express';
import {addSpending,createBudget,deleteBudget,getBudgetById,getBudgetSummary,getBudgets,updateBudget} from '../controllers/budgetController.js'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',protect,createBudget);
router.get('/',protect,getBudgets);
router.get('/:id',protect,getBudgetById);
router.put('/:id',protect,updateBudget);
router.delete('/:id',protect,deleteBudget);
router.post('/:id/spend',protect,addSpending);
router.get('/summary/all',protect,getBudgetSummary);

export default router;
