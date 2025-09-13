import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createBudget, getBudgets, updateBudget, deleteBudget, addSpending, getBudgetSummary, getBudgetById } from '../controllers/budgetController.js';
const router = express.Router();

router.post('/',protect,createBudget);
router.get('/',protect,getBudgets);
router.put('/:id',protect,updateBudget);
router.delete('/:id',protect,deleteBudget);
router.post('/:id/spend',protect,addSpending);
router.get('/summary/all',protect,getBudgetSummary);
router.get('/:id',protect,getBudgetById);

export default router;
