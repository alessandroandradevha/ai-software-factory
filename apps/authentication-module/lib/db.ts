import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseSecret = process.env.SUPABASE_SECRET;

if (!supabaseUrl || !supabaseKey || !supabaseSecret) {
  throw new Error('Supabase credentials are not set');
}

const supabase = createClient(supabaseUrl, supabaseKey, supabaseSecret);

export const register = async (data: { name: string }) => {
  try {
    const { data: user, error } = await supabase.from('users').insert([data]);
    if (error) {
      throw error;
    }
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const login = async (data: { name: string }) => {
  try {
    const { data: user, error } = await supabase.from('users').select('*').eq('name', data.name);
    if (error) {
      throw error;
    }
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};