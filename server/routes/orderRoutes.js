import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';

const router = Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.patch('/:id/status', updateOrderStatus);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;
