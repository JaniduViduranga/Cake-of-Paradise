import { Router } from 'express';
const router = Router();
import { createOrder, getAllOrders } from '../controllers/orderController.js';

router.post('/', createOrder);
router.get('/', getAllOrders);

export default router;