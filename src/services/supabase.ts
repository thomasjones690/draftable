import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// These values should be set in environment variables in a production environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and key must be set in environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseKey);
}; 