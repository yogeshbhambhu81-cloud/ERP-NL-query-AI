import { Router } from 'express';
import { imageController } from '../controllers/imageController.js';
import { uploadImage } from '../middlewares/upload.js';

const router = Router();

// POST /api/image/search   — Visual similarity search (image + optional text query)
router.post('/search', uploadImage.single('image'), imageController.handleImageSearch);

// POST /api/image/upload   — Upload product image to Supabase Storage
router.post('/upload', uploadImage.single('image'), imageController.handleImageUpload);

export default router;
