import express from 'express';
import {
  addExpense,
  updateExpense,
  deleteExpense
} from '../controllers/expense.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/:cropId', addExpense);
router.put('/:cropId/:expenseId', updateExpense);
router.delete('/:cropId/:expenseId', deleteExpense);

export default router;
