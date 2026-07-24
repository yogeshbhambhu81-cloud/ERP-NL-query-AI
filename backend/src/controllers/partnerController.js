import { supabase } from '../config/supabase.js';

export const partnerController = {
  // 1. GET /suppliers
  async getSuppliers(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');

      if (error) throw error;
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  // 2. GET /buyers
  async getBuyers(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('buyers')
        .select('*')
        .order('name');

      if (error) throw error;
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  // 3. GET /orders
  async getOrders(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('sales_orders')
        .select('*, buyers(name)')
        .order('order_date', { ascending: false });

      if (error) throw error;
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  // 4. GET /invoices
  async getInvoices(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('sales_invoices')
        .select('*')
        .order('invoice_date', { ascending: false });

      if (error) throw error;
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
};

export default partnerController;
