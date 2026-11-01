import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import orderRoutes from './routes/orderRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';

const app = express();

connectDB();

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(json({ limit: '20mb' }));
app.use(urlencoded({ extended: true, limit: '20mb' }));

app.use('/api/orders', orderRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/gallery', galleryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://127.0.0.1:${PORT}`));
