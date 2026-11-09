import { Router } from 'express';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';
import Order from '../models/Order.js';
import Gallery from '../models/Gallery.js';
import User from '../models/User.js';
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import {
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import { updatePricing } from '../controllers/pricingController.js';

const router = Router();

// Apply [protect, authorizeAdmin] on all administrative routes
router.use(protect, authorizeAdmin);

/**
 * @route   GET /api/admin/metrics
 * @desc    Get aggregated dashboard metrics for administration
 * @access  Private (Admin only)
 */
router.get('/metrics', async (req, res) => {
  try {
    const [allOrders, galleryCount, userCount] = await Promise.all([
      Order.find({}).sort({ createdAt: -1 }),
      Gallery.countDocuments({}),
      User.countDocuments({ role: 'admin' }),
    ]);

    const todayStr = new Date().toISOString().split('T')[0];

    let totalRevenue = 0;
    let activeInKitchen = 0;
    let scheduledToday = 0;

    allOrders.forEach((o) => {
      // Calculate revenue from non-cancelled orders with recorded total
      if (o.orderStatus !== 'Cancelled' && o.pricing?.finalTotal) {
        totalRevenue += Number(o.pricing.finalTotal) || 0;
      }

      if (['Received', 'Baking', 'Decorating'].includes(o.orderStatus)) {
        activeInKitchen++;
      }

      const deliveryDateStr = o.deliveryDate
        ? new Date(o.deliveryDate).toISOString().split('T')[0]
        : '';
      if (deliveryDateStr === todayStr) {
        scheduledToday++;
      }
    });

    res.status(200).json({
      success: true,
      metrics: {
        totalRevenue,
        totalOrders: allOrders.length,
        activeInKitchen,
        scheduledToday,
        totalGalleryDesigns: galleryCount,
        adminCount: userCount,
      },
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve administrative metrics',
    });
  }
});

// ── Admin Order Management ──
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

// ── Admin Gallery Management ──
router.post('/gallery', createGalleryItem);
router.patch('/gallery/:id', updateGalleryItem);
router.put('/gallery/:id', updateGalleryItem);
router.delete('/gallery/:id', deleteGalleryItem);

// ── Admin Pricing Management ──
router.put('/pricing', updatePricing);

export default router;

