import { supabase } from '../config/supabase.js';

const recentActivity = [
  { id: 'act-1', title: 'New tech pack finalized', detail: 'Style WFX-2026-JK01 spec measurements verified by QA.', time: '2 hours ago', status: 'success' },
  { id: 'act-2', title: 'Sales invoice generated', detail: 'INV-2026-011 issued for H&M Group (SO-002342) worth $78,500.', time: '5 hours ago', status: 'info' },
  { id: 'act-3', title: 'Supplier lead time warning', detail: 'Guangdong Silk Co. lead times delayed by 4 days due to port delays.', time: '1 day ago', status: 'warning' },
  { id: 'act-4', title: 'Bulk order dispatched', detail: '4,800 units of WFX-2026-SH03 shipped out to Stockholm warehouse.', time: '2 days ago', status: 'success' },
  { id: 'act-5', title: 'New design uploaded', detail: 'Designer uploaded tech pack for "Oversized Merino Sweater".', time: '3 days ago', status: 'warning' },
];

export const dashboardController = {
  // 1. GET /dashboard/kpis — Aggregated KPI stats
  async getStats(req, res, next) {
    try {
      // Query live Supabase
      const { count: fgCount } = await supabase.from('finished_goods').select('*', { count: 'exact', head: true });
      const { count: supCount } = await supabase.from('suppliers').select('*', { count: 'exact', head: true });
      const { count: buyCount } = await supabase.from('buyers').select('*', { count: 'exact', head: true });
      const { count: orderCount } = await supabase.from('sales_orders').select('*', { count: 'exact', head: true });
      
      const { data: orders } = await supabase.from('sales_orders').select('total_amount');
      const totalRev = orders ? orders.reduce((sum, o) => sum + Number(o.total_amount), 0) : 0;

      res.status(200).json({
        success: true,
        message: 'Dashboard KPI stats retrieved successfully.',
        data: {
          totalFinishedGoods: fgCount || 0,
          totalSuppliers: supCount || 0,
          totalBuyers: buyCount || 0,
          totalOrders: orderCount || 0,
          totalRevenue: totalRev,
          changes: {
            finishedGoods: '+12.4% vs last month',
            suppliers: '+4.2% vs last month',
            buyers: '+8.1% vs last month',
            orders: '+18.6% vs last month',
            revenue: '+22.3% vs last quarter'
          }
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // 2. GET /dashboard/trends — Monthly revenue/order trends
  async getRevenue(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('sales_orders')
        .select('total_amount, order_date')
        .order('order_date', { ascending: true });

      if (error) throw error;

      // Aggregate by month
      const monthMap = {};
      (data || []).forEach(o => {
        const month = new Date(o.order_date).toLocaleString('default', { month: 'short' });
        if (!monthMap[month]) monthMap[month] = { Revenue: 0, Profit: 0, Orders: 0 };
        monthMap[month].Revenue += Number(o.total_amount);
        monthMap[month].Profit += Number(o.total_amount) * 0.35;
        monthMap[month].Orders += 1;
      });

      const trends = Object.entries(monthMap).map(([month, val]) => ({
        month,
        Revenue: Math.round(val.Revenue),
        Profit: Math.round(val.Profit),
        Orders: val.Orders
      }));

      res.status(200).json({
        success: true,
        data: trends
      });
    } catch (err) {
      next(err);
    }
  },

  // 3. GET /dashboard/recent-orders — Latest orders
  async getOrders(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('sales_orders')
        .select('*, buyers(name)')
        .order('order_date', { ascending: false })
        .limit(10);

      if (error) throw error;

      res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  },

  // 4. GET /dashboard/top-suppliers — Performance-ranked suppliers
  async getSuppliers(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('supplier_score', { ascending: false });

      if (error) throw error;

      res.status(200).json({
        success: true,
        data: (data || []).map(s => ({
          id: s.id,
          name: s.name,
          score: Number(s.supplier_score),
          onTime: Number(s.on_time_rate),
          leadTime: s.lead_time
        }))
      });
    } catch (err) {
      next(err);
    }
  },

  // 5. GET /dashboard/categories — Product category distribution
  async getCategories(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('finished_goods')
        .select('category, stock_quantity');

      if (error) throw error;

      // Aggregate by category
      const catMap = {};
      const catColors = { 'Outerwear': '#6366f1', 'Shirts': '#3b82f6', 'Dresses': '#10b981', 'Trousers': '#f59e0b', 'Knitwear': '#ec4899', 'Activewear': '#8b5cf6' };
      let colorIdx = 0;
      const defaultColors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316'];

      (data || []).forEach(p => {
        if (!catMap[p.category]) catMap[p.category] = 0;
        catMap[p.category] += Number(p.stock_quantity);
      });

      const categories = Object.entries(catMap).map(([name, value]) => ({
        name,
        value,
        color: catColors[name] || defaultColors[colorIdx++ % defaultColors.length]
      }));

      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (err) {
      next(err);
    }
  },

  // 6. GET /dashboard/activity — Recent activity feed
  async getActivity(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: recentActivity
      });
    } catch (err) {
      next(err);
    }
  },

  // 7. GET /dashboard — Combined all-in-one dashboard data
  async getAll(req, res, next) {
    try {
      // Aggregate live data from Supabase
      const [
        { count: fgCount },
        { count: supCount },
        { count: buyCount },
        { count: orderCount },
        { data: allOrders },
        { data: suppliersData },
        { data: fgData },
      ] = await Promise.all([
        supabase.from('finished_goods').select('*', { count: 'exact', head: true }),
        supabase.from('suppliers').select('*', { count: 'exact', head: true }),
        supabase.from('buyers').select('*', { count: 'exact', head: true }),
        supabase.from('sales_orders').select('*', { count: 'exact', head: true }),
        supabase.from('sales_orders').select('total_amount, order_date').order('order_date', { ascending: true }),
        supabase.from('suppliers').select('*').order('supplier_score', { ascending: false }),
        supabase.from('finished_goods').select('category, stock_quantity'),
      ]);

      const totalRev = allOrders ? allOrders.reduce((sum, o) => sum + Number(o.total_amount), 0) : 0;

      // Revenue trends
      const monthMap = {};
      (allOrders || []).forEach(o => {
        const month = new Date(o.order_date).toLocaleString('default', { month: 'short' });
        if (!monthMap[month]) monthMap[month] = { Revenue: 0, Profit: 0, Orders: 0 };
        monthMap[month].Revenue += Number(o.total_amount);
        monthMap[month].Profit += Number(o.total_amount) * 0.35;
        monthMap[month].Orders += 1;
      });
      const revenueTrend = Object.entries(monthMap).map(([month, val]) => ({
        month, Revenue: Math.round(val.Revenue), Profit: Math.round(val.Profit), Orders: val.Orders
      }));

      // Category distribution
      const catMap = {};
      const defaultColors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
      let ci = 0;
      (fgData || []).forEach(p => {
        if (!catMap[p.category]) catMap[p.category] = 0;
        catMap[p.category] += Number(p.stock_quantity);
      });
      const productCategories = Object.entries(catMap).map(([name, value]) => ({
        name, value, color: defaultColors[ci++ % defaultColors.length]
      }));

      // Supplier performance
      const supplierPerformance = (suppliersData || []).map(s => ({
        id: s.id, name: s.name, score: Number(s.supplier_score),
        onTime: Number(s.on_time_rate), leadTime: s.lead_time
      }));

      res.status(200).json({
        success: true,
        data: {
          kpis: {
            totalFinishedGoods: fgCount || 0,
            totalSuppliers: supCount || 0,
            totalBuyers: buyCount || 0,
            totalOrders: orderCount || 0,
            totalRevenue: totalRev,
            changes: {
              finishedGoods: '+12.4% vs last month',
              suppliers: '+4.2% vs last month',
              buyers: '+8.1% vs last month',
              orders: '+18.6% vs last month',
              revenue: '+22.3% vs last quarter'
            }
          },
          revenueTrend,
          supplierPerformance,
          productCategories,
          recentActivity
        }
      });
    } catch (err) {
      next(err);
    }
  }
};

export default dashboardController;
