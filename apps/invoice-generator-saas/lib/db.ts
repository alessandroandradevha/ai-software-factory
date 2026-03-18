import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY, SUPABASE_SECRET } from '../env';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, SUPABASE_SECRET);