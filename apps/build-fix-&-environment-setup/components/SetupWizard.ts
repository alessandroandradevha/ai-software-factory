import React, { useState } from 'react';
import { useSupabase } from '@/lib/supabase';

interface SetupWizardProps {
  onComplete: () => void;
}

export default function SetupWizard({ onComplete }: SetupWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { client, user } = useSupabase();

  const handleNext = async () => {
    try {
      setLoading(true);
      setError(null);
      if (step < 3) {
        setStep(step + 1);
      } else if (user && client) {
        await client.from('user_setup').insert([{ user_id: user.id, completed: true }]);
        onComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Setup Wizard</h1>
      {error && <div className="p-3 mb-4 bg-red-100 text-red-800 rounded">Error: {error}</div>}
      <div className="mb-6"><p className="text-lg">Step {step} of 3</p></div>
      <button onClick={handleNext} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {loading ? 'Processing...' : step === 3 ? 'Complete Setup' : 'Next'}
      </button>
    </div>
  );
}