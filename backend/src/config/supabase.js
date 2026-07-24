import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

if (!env.supabaseUrl || !env.supabaseAnonKey) {
  throw new Error('[Database] Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: { persistSession: false }
});

console.log('[Database] Supabase client initialized successfully.');
