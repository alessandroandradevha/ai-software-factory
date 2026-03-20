import { useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { initSupabase } from '@/lib/db';

export const useSupabaseClient = (): SupabaseClient | null => {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const supabaseClient = initSupabase();
      setClient(supabaseClient);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error initializing Supabase');
      setError(error);
      console.error('Supabase initialization error:', error);
    }
  }, []);

  if (error) {
    console.error('useSupabaseClient error:', error.message);
  }

  return client;
};