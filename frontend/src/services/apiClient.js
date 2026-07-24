import axios from 'axios';

// Normalizes Supabase snake_case product fields to camelCase used by UI components
const normalizeProduct = (p) => {
  if (!p) return p;
  return {
    ...p,
    // Core identity
    id:               p.id,
    styleNumber:      p.style_number   ?? p.styleNumber,
    styleName:        p.style_name     ?? p.styleName,
    // Product attributes
    fabric:           p.fabric,
    gsm:              p.gsm,
    color:            p.color,
    print:            p.print,
    season:           p.season,
    category:         p.category,
    brand:            p.brand,
    description:      p.description,
    // Pricing & stock
    costPrice:        p.cost_price     ?? p.costPrice     ?? p.cost,
    sellingPrice:     p.selling_price  ?? p.sellingPrice,
    stockQuantity:    p.stock_quantity ?? p.stockQuantity,
    // Relations
    supplier:         p.supplier_name  ?? p.supplier,
    buyer:            p.buyer_name     ?? p.buyer,
    supplierId:       p.supplier_id    ?? p.supplierId,
    // Images & AI
    imageUrl:         p.image_url      ?? p.imageUrl,
    similarityScore:  p.similarity_score ?? p.similarityScore,
  };
};

// Initialize Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 35000, // 35s timeout (AI queries on free-tier models can be slow)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message formats
    let message = 'An unexpected server error occurred.';
    if (error.response) {
      message = error.response.data?.message || `Server Error: ${error.response.status}`;
    } else if (error.request) {
      message = 'Network error: No response received from server.';
    } else {
      message = error.message;
    }
    error.customMessage = message;
    return Promise.reject(error);
  }
);

// Centralized ERP Service
export const erpService = {
  // 1. Dashboard metrics
  async getDashboardData(signal) {
    const res = await apiClient.get('/dashboard', { signal });
    if (res.data && res.data.success) {
      return res.data.data;
    }
    throw new Error('API request failed');
  },

  // 2. Natural Language Query
  async submitNLQuery(queryText, signal) {
    const res = await apiClient.post('/ai/query', { query: queryText }, { signal });
    if (res.data && res.data.success) {
      return res.data.data;
    }
    throw new Error('AI query request failed');
  },

  // 3. Product Search
  async searchProducts(params, signal) {
    const res = await apiClient.get('/products', { params: { ...params, limit: 100 }, signal });
    if (res.data && res.data.success) {
      return res.data.data.map(normalizeProduct);
    }
    throw new Error('Product search request failed');
  },

  // 4. Image search (garment similarity)
  async searchByImage(imageFile, textQuery, similarityThreshold = 70, signal) {
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    formData.append('textQuery', textQuery);
    formData.append('threshold', similarityThreshold);
    const res = await apiClient.post('/image/search', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal
    });
    if (res.data && res.data.success) {
      return res.data.data.map(normalizeProduct);
    }
    throw new Error('Image search request failed');
  },

  // 5. Explorer with sorting/pagination
  async getExplorerProducts(params = {}, signal) {
    const { search = '', category = 'All', sortField = 'styleName', sortOrder = 'asc' } = params;
    const res = await apiClient.get('/products', {
      params: { q: search, category, limit: 100 },
      signal
    });
    if (res.data && res.data.success) {
      let items = res.data.data.map(normalizeProduct);
      // Sort items in frontend as expected by the page design
      items.sort((a, b) => {
        let fieldA = a[sortField];
        let fieldB = b[sortField];

        if (typeof fieldA === 'string') {
          fieldA = fieldA.toLowerCase();
          fieldB = fieldB.toLowerCase();
        }

        if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      return items;
    }
    throw new Error('Explorer products request failed');
  }
};

export default apiClient;
