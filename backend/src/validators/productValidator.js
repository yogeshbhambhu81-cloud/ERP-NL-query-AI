import { query, param, body } from 'express-validator';

export const validateGetProducts = [
  query('category').optional().trim(),
  query('fabric').optional().trim(),
  query('supplier').optional().trim(),
  query('buyer').optional().trim(),
  query('color').optional().trim(),
  query('season').optional().trim(),
  query('gsmRange').optional().trim(),
  query('q').optional().trim(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
];

export const validateProductId = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Product ID parameter is required'),
];

export const validateProductCreate = [
  body('styleNumber').trim().notEmpty().withMessage('Style Number is required'),
  body('styleName').trim().notEmpty().withMessage('Style Name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('fabric').trim().notEmpty().withMessage('Fabric is required'),
  body('gsm').isInt({ min: 1 }).withMessage('GSM must be a positive integer'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('print').trim().notEmpty().withMessage('Print is required'),
  body('costPrice').isFloat({ min: 0 }).withMessage('Cost Price must be a positive number'),
  body('sellingPrice').isFloat({ min: 0 }).withMessage('Selling Price must be a positive number'),
  body('stockQuantity').isInt({ min: 0 }).withMessage('Stock Quantity must be a positive integer'),
];
