import { validationResult } from 'express-validator';
import CustomError from '../utils/CustomError.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return next(new CustomError('Validation Failed', 400, errorMessages));
  }
  next();
};

export default validateRequest;
