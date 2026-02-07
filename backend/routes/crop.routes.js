import express from 'express';
import {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop
} from '../controllers/crop.controller.js';
import { addSale } from '../controllers/crop.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCrops)
  .post(createCrop);

router.route('/:id')
  .get(getCropById)
  .put(updateCrop)
  .delete(deleteCrop);

router.post('/:id/sales', addSale);

export default router;
