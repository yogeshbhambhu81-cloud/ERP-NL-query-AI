import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import CustomError from '../utils/CustomError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure tmp upload directory exists
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filters
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|webp/;
  const allowedCsvTypes = /csv/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (file.fieldname === 'image') {
    const isExtAllowed = allowedImageTypes.test(extname);
    const isMimeAllowed = mimetype.startsWith('image/');
    if (isExtAllowed && isMimeAllowed) {
      return cb(null, true);
    }
    return cb(new CustomError('Invalid upload: Only PNG, JPEG, and WEBP image formats are supported.', 400), false);
  }

  if (file.fieldname === 'csv') {
    const isExtAllowed = allowedCsvTypes.test(extname);
    const isMimeAllowed = mimetype === 'text/csv' || mimetype === 'application/vnd.ms-excel';
    if (isExtAllowed && isMimeAllowed) {
      return cb(null, true);
    }
    return cb(new CustomError('Invalid upload: Only CSV files are supported.', 400), false);
  }

  cb(new CustomError(`Unexpected field: ${file.fieldname}`, 400), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Named convenience exports for route files
export const uploadCSV = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    if (ext === '.csv' || mime === 'text/csv' || mime === 'application/vnd.ms-excel') {
      return cb(null, true);
    }
    return cb(new CustomError('Only CSV files are allowed.', 400), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 }  // 10MB for CSV files
});

export const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    if (allowed.includes(ext) && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    return cb(new CustomError('Only JPEG, PNG, and WEBP images are allowed.', 400), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }   // 5MB for images
});

export default upload;
