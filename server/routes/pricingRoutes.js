import { Router } from 'express';
import Pricing from '../models/Pricing.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const docs = await Pricing.find({});
    res.json({ success: true, data: docs });
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    res.status(500).json({ success: false, message: 'Server error fetching pricing data' });
  }
});

export default router;
