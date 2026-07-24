import express from 'express';
import cors from 'cors';
import helmet from 'helmet';//prevent xss attack
import morgan from 'morgan'; //log every request
import compression from 'compression';//compress data
import rateLimit from 'express-rate-limit';// apply rate limiting only 20 request per minute
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── Security Middlewares ────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ─── Compression ──────────────────────────────────────────────────────────────
app.use(compression());

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 200,                    // 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,         // 1 minute
  max: 20,                     // 20 AI requests per minute (OpenRouter cost control)
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'AI query rate limit reached. Please wait 1 minute.' }
});

app.use('/api/', apiLimiter);
app.use('/api/ai/', aiLimiter);

// ─── Request Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Logging ──────────────────────────────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Static Uploads ───────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', router);

// ─── Root Endpoint ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'WFX AI-Native ERP Platform',
    version: '1.0.0',
    description: 'Production-grade ERP backend with AI-powered NL query, image search, and real-time analytics',
    documentation: '/api/health',
    endpoints: {
      health: 'GET /api/health',
      dashboard: 'GET /api/dashboard | /kpis | /trends | /recent-orders | /top-suppliers | /categories | /activity',
      ai: 'POST /api/ai/query | /ai/sql',
      products: 'GET /api/products | /search | /:id  ·  POST /api/products | /import  ·  PATCH /:id  ·  DELETE /:id',
      imageSearch: 'POST /api/image/search',
      imageUpload: 'POST /api/image/upload',
      suppliers: 'GET /api/suppliers',
      buyers: 'GET /api/buyers',
      orders: 'GET /api/orders',
      invoices: 'GET /api/invoices'
    }
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found on this server.`
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
