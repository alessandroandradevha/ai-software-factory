import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

const getSupabaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
  }
  return url;
};

const getSupabaseKey = (): string => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return key;
};

export const initSupabase = (): SupabaseClient => {
  try {
    if (!supabaseInstance) {
      supabaseInstance = createClient(
        getSupabaseUrl(),
        getSupabaseKey()
      );
    }
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    throw error;
  }
};

export const getSupabaseClient = (): SupabaseClient | null => {
  return supabaseInstance;
};