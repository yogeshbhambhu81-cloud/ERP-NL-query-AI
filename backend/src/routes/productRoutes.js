import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { uploadCSV } from '../middlewares/upload.js';
import { validateGetProducts, validateProductCreate, validateProductId } from '../validators/productValidator.js';
import { validateRequest } from '../middlewares/validator.js';

const router = Router();

// GET  /api/products           — Paginated product listing with filters
router.get('/', validateGetProducts, validateRequest, productController.getProducts);

// GET  /api/products/search    — Typesense full-text search
router.get('/search', productController.searchProducts);

// GET  /api/products/:id       — Single product detail
router.get('/:id', productController.getProductById);

// POST /api/products           — Create a single product
router.post('/', validateProductCreate, validateRequest, productController.createProduct);

// PATCH /api/products/:id      — Update a product
router.patch('/:id', productController.updateProduct);

// DELETE /api/products/:id     — Delete a product
router.delete('/:id', productController.deleteProduct);

// POST /api/products/import    — CSV Bulk Import
router.post('/import', uploadCSV.single('file'), productController.importProductsCSV);

export default router;
