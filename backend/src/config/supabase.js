import { createClient } from '@supabase/supabase-js';
import { createRequire } from 'module';
import { env } from './env.js';

// Node.js 20 fix: inject WebSocket global so Supabase Realtime can initialize
const require = createRequire(import.meta.url);
const WebSocket = require('ws');
if (!globalThis.WebSocket) globalThis.WebSocket = WebSocket;

if (!env.supabaseUrl || !env.supabaseAnonKey) {
  throw new Error('[Database] Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: { persistSession: false },
});

console.log('[Database] Supabase client initialized successfully.');
