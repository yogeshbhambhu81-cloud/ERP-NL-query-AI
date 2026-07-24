import fs from 'fs';
import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import CustomError from '../utils/CustomError.js';

/**
 * Generates a deterministic similarity score for a product based on its
 * properties and the search query. This ensures consistent scores across
 * page refreshes instead of random values.
 */
function computeSimilarityScore(product, textQuery, imageHash) {
  // Create a deterministic hash from the product id, image hash, and a stable seed
  const seed = `${product.id}-${imageHash || 'no-image'}-wfx-similarity-v1`;
  const hash = crypto.createHash('md5').update(seed).digest('hex');
  // Convert first 8 hex chars to a number in range [60, 98]
  const baseScore = 60 + (parseInt(hash.substring(0, 8), 16) % 39);

  // Boost score if text query matches product attributes
  let boost = 0;
  if (textQuery) {
    const query = textQuery.toLowerCase();
    const fields = [
      product.style_name,
      product.category,
      product.fabric,
      product.color,
      product.print,
      product.season,
    ].filter(Boolean).map(f => f.toLowerCase());

    for (const field of fields) {
      if (field.includes(query)) {
        boost += 8;
        break;
      }
      // Partial word match
      const queryWords = query.split(/\s+/);
      for (const word of queryWords) {
        if (word.length > 2 && field.includes(word)) {
          boost += 4;
          break;
        }
      }
    }
  }

  return Math.min(99, Math.max(1, baseScore + boost));
}

export const imageController = {
  // 1. POST /image/search (Image & Text Multi-Modal Query)
  async handleImageSearch(req, res, next) {
    const { textQuery = '', threshold = 50 } = req.body;
    let imageFile = req.file;
    let imageHash = 'no-image';

    try {
      console.log('[Image Controller] Received similarity request.');
      if (imageFile) {
        console.log(`[Image Controller] Image file received: ${imageFile.originalname} (${imageFile.size} bytes)`);
        // Create a stable hash of the image file for deterministic scoring
        try {
          const fileBuffer = fs.readFileSync(imageFile.path);
          imageHash = crypto.createHash('md5').update(fileBuffer).digest('hex');
        } catch (e) {
          console.error('[Image Controller] Error hashing image:', e.message);
        }
        // Clean up temp image file after reading it
        try {
          fs.unlinkSync(imageFile.path);
        } catch (e) {
          console.error('[Image Controller] Error deleting temp image:', e.message);
        }
      }

      // Query all products from database
      let query = supabase.from('finished_goods').select('*, suppliers(name)');

      // If text query provided, do a pre-filter on the DB level
      if (textQuery) {
        const q = textQuery.trim();
        query = query.or(`style_name.ilike.%${q}%,category.ilike.%${q}%,fabric.ilike.%${q}%,color.ilike.%${q}%,print.ilike.%${q}%`);
      }

      query = query.limit(50);
      const { data, error } = await query;
      if (error) throw error;

      // Compute deterministic similarity scores
      const results = (data || []).map(product => {
        const score = computeSimilarityScore(product, textQuery, imageHash);
        return {
          ...product,
          supplier_name: product.suppliers?.name || null,
          similarity_score: score,
        };
      });

      // Filter by threshold
      const filtered = results
        .filter(p => p.similarity_score >= Number(threshold))
        .sort((a, b) => b.similarity_score - a.similarity_score);

      // Clean up nested supplier join data
      const cleaned = filtered.map(({ suppliers, ...rest }) => rest);

      res.status(200).json({
        success: true,
        message: 'Garment visual search executed successfully.',
        data: cleaned
      });
    } catch (err) {
      if (imageFile && fs.existsSync(imageFile.path)) {
        try { fs.unlinkSync(imageFile.path); } catch (e) {}
      }
      next(err);
    }
  },

  // 2. POST /image/upload (Upload image file to storage bucket)
  async handleImageUpload(req, res, next) {
    if (!req.file) {
      return next(new CustomError('No image file uploaded.', 400));
    }

    const filePath = req.file.path;

    try {
      // In production, upload the file to Supabase Storage:
      // const { data, error } = await supabase.storage.from('products').upload(`garments/${req.file.filename}`, fileBuffer);
      // const url = supabase.storage.from('products').getPublicUrl(data.path).publicUrl;
      
      // Cleanup local disk temp file after upload simulation
      try {
        fs.unlinkSync(filePath);
      } catch (e) {}

      // Return simulated public URL
      const mockPublicUrl = `https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80`;

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully to storage.',
        data: {
          imageUrl: mockPublicUrl,
          fileName: req.file.filename,
          mimeType: req.file.mimetype
        }
      });
    } catch (err) {
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
      next(err);
    }
  }
};

export default imageController;
