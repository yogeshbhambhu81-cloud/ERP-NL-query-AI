import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';
import { validateAIQuery, validateAISQL } from '../validators/aiValidator.js';
import { validateRequest } from '../middlewares/validator.js';

const router = Router();

// POST /api/ai/query   — Natural Language → SQL → Results → AI Explanation
router.post('/query', validateAIQuery, validateRequest, aiController.handleNLQuery);

// POST /api/ai/sql     — Direct SQL Execution (read-only, safety guarded)
router.post('/sql', validateAISQL, validateRequest, aiController.handleDirectSQL);

export default router;
