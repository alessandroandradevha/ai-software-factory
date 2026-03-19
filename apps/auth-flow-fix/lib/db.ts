import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AuthState } from './types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseSecret = process.env.SUPABASE_SECRET;

if (!supabaseUrl || !supabaseKey || !supabaseSecret) {
  throw new Error('Supabase credentials are not set');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, supabaseSecret);

export type { AuthState };