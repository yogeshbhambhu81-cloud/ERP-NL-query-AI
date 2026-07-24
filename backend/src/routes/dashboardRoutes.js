import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController.js';

const router = Router();

// GET /api/dashboard             — All dashboard data in one call
router.get('/', dashboardController.getAll);

// GET /api/dashboard/kpis        — KPI summary cards
router.get('/kpis', dashboardController.getStats);

// GET /api/dashboard/trends      — Monthly revenue/order trends
router.get('/trends', dashboardController.getRevenue);

// GET /api/dashboard/recent-orders — Latest orders
router.get('/recent-orders', dashboardController.getOrders);

// GET /api/dashboard/top-suppliers — Performance-ranked suppliers
router.get('/top-suppliers', dashboardController.getSuppliers);

// GET /api/dashboard/categories  — Product category distribution
router.get('/categories', dashboardController.getCategories);

// GET /api/dashboard/activity    — Recent activity feed
router.get('/activity', dashboardController.getActivity);

export default router;
