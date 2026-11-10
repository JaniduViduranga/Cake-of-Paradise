import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

import express, { json, urlencoded } from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Initialize initial DB connection
connectDB().catch((err) => {
  console.warn('⚠️ Initial MongoDB connection deferred to request handler:', err.message);
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(json({ limit: '20mb' }));
app.use(urlencoded({ extended: true, limit: '20mb' }));

// Pre-route middleware to ensure DB connection is ready before processing API routes
app.use(async (req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[DB Middleware] Database connection failed:', err.message);
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please retry in a moment.',
    });
  }
});

// Strict Guardrail: Ensure admin, auth, orders, and payment routes are never cached
const noCache = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

app.use('/api/auth', noCache, authRoutes);
app.use('/api/orders', noCache, orderRoutes);
app.use('/api/payment', noCache, paymentRoutes);
app.use('/api/admin', noCache, adminRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/gallery', galleryRoutes);

// Catch-all 404 for unhandled API routes (ensures JSON response, never HTML)
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handling middleware (ensures JSON response, never HTML)
app.use((err, req, res, next) => {
  console.error('[ServerError] Global error handler caught:', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// 1. Only listen on a port when running locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on http://localhost:${PORT}`);
  });
}

// 2. Export app so Vercel can run it as a serverless function
export default app;
