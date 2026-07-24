import dotenv from 'dotenv';
import path from 'path';

// Load .env file from backend root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const requiredEnv = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
];

// Validate critical parameters (throw error if missing or invalid)
for (const key of requiredEnv) {
  if (!process.env[key] || process.env[key].startsWith('your-')) {
    throw new Error(`[CRITICAL] Missing or invalid environment variable: ${key}. Supabase must be configured for the application to run.`);
  }
}

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  openrouterApiKey: process.env.OPENROUTER_API_KEY,
  openrouterModel: process.env.OPENROUTER_MODEL || 'openrouter/free',
  typesenseApiKey: process.env.TYPESENSE_API_KEY,
  typesenseHost: process.env.TYPESENSE_HOST || 'localhost',
  typesensePort: process.env.TYPESENSE_PORT || '8108',
  typesenseProtocol: process.env.TYPESENSE_PROTOCOL || 'http',
};
