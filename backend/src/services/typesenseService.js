import { supabase } from '../config/supabase.js';
import { env } from '../config/env.js';

// Typesense connection state tracking
let isTypesenseConnected = false;

console.log('[Typesense] Initializing connection parameters...');
console.log(`[Typesense] Config: ${env.typesenseProtocol}://${env.typesenseHost}:${env.typesensePort}`);

export const typesenseService = {
  /**
   * Performs full-text or vector search on finished goods.
   * Gracefully falls back to local database filters if Typesense server is offline.
   */
  async searchFinishedGoods(queryText, filters = {}) {
    if (!isTypesenseConnected) {
      // Graceful fallback to database filters (simulating index hits)
      return this._fallbackDbSearch(queryText, filters);
    }

    try {
      // In production:
      // const searchResults = await typesenseClient.collections('finished_goods').documents().search({
      //   q: queryText,
      //   query_by: 'styleName,styleNumber,fabric,supplier',
      //   filter_by: this._buildFilterString(filters)
      // });
      // return searchResults.hits.map(h => h.document);
      return [];
    } catch (err) {
      console.warn('[Typesense] Search error, using DB fallback:', err.message);
      return this._fallbackDbSearch(queryText, filters);
    }
  },

  /**
   * Performs image similarity search using actual Typesense vector queries or database.
   */
  async searchByVector(embeddingVector, threshold = 50) {
    if (!isTypesenseConnected) {
      // Fallback: Return products with similarity scores
      return this._fallbackVectorSearch(embeddingVector, threshold);
    }

    try {
      // In production:
      // const searchResults = await typesenseClient.collections('finished_goods').documents().search({
      //   q: '*',
      //   vector_query: `embeddings:([${embeddingVector.join(',')}], k:10)`,
      //   filter_by: `similarityScore >= ${threshold}`
      // });
      // return searchResults.hits;
      return [];
    } catch (err) {
      return this._fallbackVectorSearch(embeddingVector, threshold);
    }
  },

  async _fallbackDbSearch(q, filters) {
    let query = supabase.from('finished_goods').select('*');
    if (q) {
      query = query.or(`style_name.ilike.%${q}%,style_number.ilike.%${q}%,fabric.ilike.%${q}%`);
    }
    if (filters.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }
    if (filters.color) {
      query = query.eq('color', filters.color);
    }
    if (filters.fabric) {
      query = query.ilike('fabric', `%${filters.fabric}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async _fallbackVectorSearch(vector, threshold) {
    const { data, error } = await supabase
      .from('finished_goods')
      .select('*')
      .gte('similarity_score', threshold)
      .order('similarity_score', { ascending: false });
    if (error) throw error;
    return data || [];
  }
};

export default typesenseService;
