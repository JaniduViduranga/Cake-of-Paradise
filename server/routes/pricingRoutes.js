import { Router } from 'express';
import { getPricing, updatePricing } from '../controllers/pricingController.js';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/pricing (Public: Customers can calculate prices)
router.get('/', getPricing);

// PUT /api/pricing or POST /api/pricing (Admin only)
router.put('/', protect, authorizeAdmin, updatePricing);
router.post('/', protect, authorizeAdmin, updatePricing);

export default router;
