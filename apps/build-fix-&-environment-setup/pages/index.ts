import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import SetupWizard from '@/components/SetupWizard';
import { useSupabase } from '@/lib/supabase';

export default function Home() {
  const [setupComplete, setSetupComplete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabase();

  useEffect(() => {
    const checkSetup = async () => {
      try {
        if (!user) {
          setSetupComplete(false);
          return;
        }
        setSetupComplete(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Setup check failed');
      } finally {
        setLoading(false);
      }
    };

    checkSetup();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return setupComplete ? <Dashboard /> : <SetupWizard onComplete={() => setSetupComplete(true)} />;
}