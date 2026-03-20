import React, { useEffect, useState } from 'react';
import { useSupabase } from '@/lib/supabase';

interface DashboardProps {}

export default function Dashboard({}: DashboardProps) {
  const { user, client } = useSupabase();
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !client) throw new Error('User not authenticated');
        const { data: result, error: err } = await client.from('user_data').select('*').eq('user_id', user.id);
        if (err) throw err;
        setData(result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, client]);

  if (loading) return <div className="p-4">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return <div className="p-6"><h1 className="text-2xl font-bold">Dashboard</h1><p className="mt-4">Total items: {data.length}</p></div>;
}