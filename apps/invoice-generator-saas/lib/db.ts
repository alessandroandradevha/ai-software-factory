import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY, SUPABASE_SECRET } from '../env';

try {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    process.env.SUPABASE_SECRET
  );
  export { supabase };
} catch (error) {
  console.error('Error initializing Supabase:', error);
  throw error;
}