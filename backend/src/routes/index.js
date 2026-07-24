import { Router } from 'express';
import dashboardRoutes from './dashboardRoutes.js';
import aiRoutes from './aiRoutes.js';
import productRoutes from './productRoutes.js';
import imageRoutes from './imageRoutes.js';
import partnerRoutes from './partnerRoutes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'WFX ERP Backend API is operational',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount all module routes
router.use('/dashboard', dashboardRoutes);
router.use('/ai', aiRoutes);
router.use('/products', productRoutes);
router.use('/image', imageRoutes);
router.use('/', partnerRoutes);        // /suppliers /buyers /orders /invoices

export default router;
