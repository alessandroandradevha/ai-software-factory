import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Dashboard from '@/components/Dashboard';
import { useSupabaseClient } from '@/hooks/useSupabaseClient';
import type { Task } from '@/types';

const Home: NextPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }

        const { data, error: fetchError } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        setTasks(data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
        setError(message);
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [supabase]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Dashboard tasks={tasks} loading={loading} error={error} />
    </main>
  );
};

export default Home;