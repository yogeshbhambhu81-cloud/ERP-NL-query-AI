import fs from 'fs';
import csvParser from 'csv-parser';
import { supabase } from '../config/supabase.js';
import { typesenseService } from '../services/typesenseService.js';
import CustomError from '../utils/CustomError.js';

export const productController = {
  // 1. GET /products (filtered & paginated)
  async getProducts(req, res, next) {
    try {
      const { page = 1, limit = 100, q = '', category, fabric, supplier, buyer, color, season, gsmRange, print } = req.query;

      // Query live Supabase with supplier name join
      let query = supabase.from('finished_goods').select('*, suppliers ( name )');

      // Apply full-text search across multiple fields
      if (q) query = query.or(`style_name.ilike.%${q}%,style_number.ilike.%${q}%,fabric.ilike.%${q}%,category.ilike.%${q}%,color.ilike.%${q}%,print.ilike.%${q}%`);
      
      // Apply optional filter params
      if (category && category !== 'All' && category !== '') query = query.ilike('category', `%${category}%`);
      if (fabric && fabric !== '') query = query.ilike('fabric', `%${fabric}%`);
      if (color && color !== '') query = query.ilike('color', `%${color}%`);
      if (season && season !== '') query = query.ilike('season', `%${season}%`);
      if (print && print !== '') query = query.ilike('print', `%${print}%`);
      
      // GSM Range filter
      if (gsmRange && gsmRange !== '' && gsmRange !== 'All Weights') {
        // Parse gsmRange patterns like "Lightweight (<150 GSM)", "Midweight (150-300 GSM)", "Heavyweight (>300 GSM)"
        if (gsmRange.includes('<150') || gsmRange.includes('Lightweight')) {
          query = query.lt('gsm', 150);
        } else if (gsmRange.includes('150-300') || gsmRange.includes('Midweight')) {
          query = query.gte('gsm', 150).lte('gsm', 300);
        } else if (gsmRange.includes('>300') || gsmRange.includes('Heavyweight')) {
          query = query.gt('gsm', 300);
        }
      }

      // Supplier filter — join to suppliers table
      if (supplier && supplier !== '') {
        // Get supplier IDs matching the name first
        const { data: supData } = await supabase.from('suppliers').select('id').ilike('name', `%${supplier}%`);
        if (supData && supData.length > 0) {
          const supIds = supData.map(s => s.id);
          query = query.in('supplier_id', supIds);
        } else {
          // No matching supplier found — return empty
          return res.status(200).json({ success: true, data: [], pagination: { totalItems: 0, currentPage: 1, totalPages: 0, itemsPerPage: Number(limit) } });
        }
      }

      // Limit results (no server-side pagination — frontend handles its own page splitting)
      query = query.limit(Number(limit));
      const { data, error } = await query;

      if (error) throw error;

      // Flatten supplier name from joined data
      const normalized = (data || []).map(item => {
        const supplierName = item.suppliers?.name || null;
        const { suppliers, ...rest } = item;
        return {
          ...rest,
          supplier_name: supplierName,
        };
      });

      res.status(200).json({
        success: true,
        data: normalized,
        pagination: {
          totalItems: normalized.length,
          currentPage: 1,
          totalPages: 1,
          itemsPerPage: Number(limit)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // 2. GET /products/:id
  async getProductById(req, res, next) {
    const { id } = req.params;

    try {
      const { data, error } = await supabase
        .from('finished_goods')
        .select('*, suppliers(*)')
        .eq('id', id)
        .single();

      if (error || !data) {
        throw new CustomError(`Product not found with ID: ${id}`, 404);
      }

      res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  },

  // 3. GET /products/search (Typesense search endpoint)
  async searchProducts(req, res, next) {
    const { q = '', category, fabric, color } = req.query;

    try {
      const results = await typesenseService.searchFinishedGoods(q, { category, fabric, color });
      res.status(200).json({
        success: true,
        data: results
      });
    } catch (err) {
      next(err);
    }
  },

  // 4. POST /products (Create a single product)
  async createProduct(req, res, next) {
    try {
      const {
        styleNumber, styleName, category, fabric, gsm, color, print,
        costPrice, sellingPrice, stockQuantity, season, imageUrl, supplierId
      } = req.body;

      const { data, error } = await supabase
        .from('finished_goods')
        .insert({
          style_number: styleNumber,
          style_name: styleName,
          category,
          fabric,
          gsm: Number(gsm),
          color,
          print,
          cost_price: Number(costPrice),
          selling_price: Number(sellingPrice),
          stock_quantity: Number(stockQuantity),
          season,
          image_url: imageUrl,
          supplier_id: supplierId || null
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ success: true, message: 'Product created successfully.', data });
    } catch (err) {
      next(err);
    }
  },

  // 5. PATCH /products/:id (Update product)
  async updateProduct(req, res, next) {
    const { id } = req.params;

    try {
      // Map camelCase body keys to snake_case DB columns
      const updatePayload = {};
      const mapping = {
        styleName: 'style_name', category: 'category', fabric: 'fabric', gsm: 'gsm',
        color: 'color', print: 'print', costPrice: 'cost_price', sellingPrice: 'selling_price',
        stockQuantity: 'stock_quantity', season: 'season', imageUrl: 'image_url', supplierId: 'supplier_id'
      };

      for (const [camel, snake] of Object.entries(mapping)) {
        if (req.body[camel] !== undefined) {
          updatePayload[snake] = req.body[camel];
        }
      }

      if (Object.keys(updatePayload).length === 0) {
        throw new CustomError('No valid fields to update.', 400);
      }

      const { data, error } = await supabase
        .from('finished_goods')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new CustomError(`Product not found with ID: ${id}`, 404);

      res.status(200).json({ success: true, message: 'Product updated successfully.', data });
    } catch (err) {
      next(err);
    }
  },

  // 6. DELETE /products/:id
  async deleteProduct(req, res, next) {
    const { id } = req.params;

    try {
      const { data, error } = await supabase
        .from('finished_goods')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new CustomError(`Product not found with ID: ${id}`, 404);

      res.status(200).json({ success: true, message: 'Product deleted successfully.', data });
    } catch (err) {
      next(err);
    }
  },

  // 7. POST /products/import (CSV Bulking Importer)
  async importProductsCSV(req, res, next) {
    if (!req.file) {
      return next(new CustomError('No CSV file uploaded.', 400));
    }

    const filePath = req.file.path;
    const parsedRows = [];
    const skippedRows = [];
    let processedCount = 0;

    try {
      console.log(`[CSV Importer] Reading temporary file at: ${filePath}`);

      // Step A: Parse CSV via ReadStream pipeline
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (row) => {
            processedCount++;
            // Row Validation check
            if (!row.styleNumber || !row.styleName || !row.category || !row.fabric) {
              skippedRows.push({
                index: processedCount,
                styleNumber: row.styleNumber || 'Unknown',
                reason: 'Missing required catalog fields (styleNumber, styleName, category, fabric)'
              });
              return;
            }

            parsedRows.push({
              style_number: row.styleNumber.trim(),
              style_name: row.styleName.trim(),
              category: row.category.trim(),
              fabric: row.fabric.trim(),
              gsm: parseInt(row.gsm || '200', 10),
              color: row.color ? row.color.trim() : 'Solid Black',
              print: row.print ? row.print.trim() : 'Solid Color',
              cost_price: parseFloat(row.costPrice || '0.00'),
              selling_price: parseFloat(row.sellingPrice || '0.00'),
              stock_quantity: parseInt(row.stockQuantity || '0', 10),
              season: row.season ? row.season.trim() : 'Spring 2026',
              image_url: row.imageUrl ? row.imageUrl.trim() : 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80'
            });
          })
          .on('end', resolve)
          .on('error', reject);
      });

      // Cleanup CSV file on disk
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('[CSV Importer] Temp file cleanup error:', err.message);
      }

      // Step B: Bulk upsert rows into database
      if (parsedRows.length > 0) {
        // Live bulk write on Supabase
        const { error } = await supabase
          .from('finished_goods')
          .upsert(parsedRows, { onConflict: 'style_number' });

        if (error) throw error;
      }

      res.status(200).json({
        success: true,
        message: 'CSV import pipeline executed.',
        data: {
          totalProcessed: processedCount,
          importedCount: parsedRows.length,
          skippedCount: skippedRows.length,
          skippedDetails: skippedRows
        }
      });
    } catch (err) {
      // Remove file on error if it wasn't cleaned
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
      next(err);
    }
  }
};

export default productController;
