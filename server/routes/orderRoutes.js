import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public: Customer creates order
router.post('/', createOrder);

// Admin Protected: View all orders, update status, and delete orders
router.get('/', protect, authorizeAdmin, getAllOrders);
router.patch('/:id/status', protect, authorizeAdmin, updateOrderStatus);
router.put('/:id/status', protect, authorizeAdmin, updateOrderStatus);
router.delete('/:id', protect, authorizeAdmin, deleteOrder);

export default router;
