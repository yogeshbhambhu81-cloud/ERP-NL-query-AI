import { Router } from 'express';
import { partnerController } from '../controllers/partnerController.js';

const router = Router();

// GET /api/suppliers   — All suppliers list
router.get('/suppliers', partnerController.getSuppliers);

// GET /api/buyers      — All buyers list
router.get('/buyers', partnerController.getBuyers);

// GET /api/orders      — Sales orders (desc by date)
router.get('/orders', partnerController.getOrders);

// GET /api/invoices    — Sales invoices (desc by date)
router.get('/invoices', partnerController.getInvoices);

export default router;
