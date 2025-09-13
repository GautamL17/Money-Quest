import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAllBits, getBitById, generateAllLevels, deleteBit, updateProgress, getAnalytics } from '../controllers/bitController.js';

const router = express.Router();

router.get('/', protect, getAllBits);
router.get('/:id', protect, getBitById);
router.post('/generate-all', protect, generateAllLevels);
router.delete('/:id', protect, deleteBit);

// NEW routes
router.patch('/:id/progress', protect, updateProgress);  // update progress for user
router.get('/:id/analytics', protect, getAnalytics);    // get analytics for current user

export default router;
