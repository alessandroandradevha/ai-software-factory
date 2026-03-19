import { useState, useEffect } from 'react';
import { supabase } from '../lib/db';
import type { AuthState } from '../lib/db';

interface DashboardProps {
}
const Dashboard = () => {
  const [authState, setAuthState] = useState<AuthState | null>(null);

  useEffect(() => {
    const { data: { subscription }, error } = supabase
      .from('auth_state')
      .on('INSERT', (payload) => {
        setAuthState(payload.new);
      })
      .subscribe();

    if (error) {
      console.error('Error subscribing to auth state:', error);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <div>
      {authState ? (
        <p>Authenticated as {authState.user.email}</p>
      ) : (
        <p>Not authenticated</p>
      )}
    </div>
  );
};

export default Dashboard;