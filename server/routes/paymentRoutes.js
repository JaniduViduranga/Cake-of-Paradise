import { Router } from 'express';
import {
  createPaymentIntent,
  verifyPayment,
  handleGatewayWebhook,
} from '../controllers/paymentController.js';

const router = Router();

router.post('/create-intent', createPaymentIntent);
router.post('/verify', verifyPayment);
router.post('/webhook', handleGatewayWebhook);

export default router;
