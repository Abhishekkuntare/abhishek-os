import { createClient } from '@supabase/supabase-js';

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
// Supabase is opt-in because the portfolio can run entirely from local storage.
// This prevents requests to projects that do not have the expected tables.
const supabaseEnabled = env.VITE_ENABLE_SUPABASE === 'true';

export const isSupabaseConfigured =
  supabaseEnabled && Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
