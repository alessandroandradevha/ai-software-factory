import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useUserPreferencesStore } from '@/store/userPreferencesStore';
import { createClient } from '@/lib/supabase';

interface DashboardStats {
  totalTransactions: number;
  monthlyRevenue: number;
  activeUsers: number;
  pendingRequests: number;
}

interface DashboardWidget {
  id: string;
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
}

interface FetchError extends Error {
  status?: number;
}

interface InitializationState {
  isInitializing: boolean;
  hasInitialized: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { userPreferences, isOnboarding, initializePreferences, updatePreferences } = useUserPreferencesStore();
  const supabase = createClient();

  const [stats, setStats] = useState<DashboardStats>({
    totalTransactions: 0,
    monthlyRevenue: 0,
    activeUsers: 0,
    pendingRequests: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initState, setInitState] = useState<InitializationState>({
    isInitializing: false,
    hasInitialized: false,
  });

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!isAuthenticated) {
          router.push('/auth/login');
          return;
        }

        if (!userPreferences && !initState.isInitializing) {
          setInitState(prev => ({ ...prev, isInitializing: true }));
          
          try {
            await initializePreferences();
            setInitState(prev => ({ ...prev, hasInitialized: true, isInitializing: false }));
          } catch (prefError) {
            const errorMessage = prefError instanceof Error 
              ? prefError.message 
              : 'Failed to initialize user preferences';
            console.error('Failed to initialize preferences:', prefError);
            setError(errorMessage);
            setInitState(prev => ({ ...prev, isInitializing: false }));
            return;
          }
        }

        const stats = await fetchDashboardStats();
        setStats(stats);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'An unexpected error occurred while initializing dashboard';
        console.error('Dashboard initialization error:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [isAuthenticated, userPreferences, initState.isInitializing]);

  const fetchDashboardStats = async (): Promise<DashboardStats> => {
    try {
      if (!user?.id) {
        throw new Error('User ID is not available');
      }

      const { data, error: supabaseError } = await supabase
        .from('dashboard_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (supabaseError) {
        throw new FetchError(`Failed to fetch dashboard stats: ${supabaseError.message}`);
      }

      if (!data) {
        return {
          totalTransactions: 0,
          monthlyRevenue: 0,
          activeUsers: 0,
          pendingRequests: 0,
        };
      }

      return {
        totalTransactions: data.total_transactions || 0,
        monthlyRevenue: data.monthly_revenue || 0,
        activeUsers: data.active_users || 0,
        pendingRequests: data.pending_requests || 0,
      };
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to fetch dashboard statistics';
      console.error('Error fetching dashboard stats:', err);
      throw new FetchError(errorMessage);
    }
  };

  const handlePreferenceUpdate = async (key: string, value: unknown): Promise<void> => {
    try {
      setError(null);
      await updatePreferences({ [key]: value });
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to update preferences';
      console.error('Error updating preferences:', err);
      setError(errorMessage);
    }
  };

  const widgets: DashboardWidget[] = [
    {
      id: 'transactions',
      title: 'Total Transactions',
      value: stats.totalTransactions,
      icon: <span>📊</span>,
      trend: 12,
    },
    {
      id: 'revenue',
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: <span>💰</span>,
      trend: 8,
    },
    {
      id: 'users',
      title: 'Active Users',
      value: stats.activeUsers,
      icon: <span>👥</span>,
      trend: 5,
    },
    {
      id: 'pending',
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: <span>⏳</span>,
      trend: -3,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.email || 'User'}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">Error</p>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {isOnboarding && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">Please complete your profile setup to access all features.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.map(widget => (
          <div 
            key={widget.id} 
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{widget.icon}</div>
              {widget.trend !== undefined && (
                <span className={`text-sm font-semibold ${widget.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {widget.trend >= 0 ? '+' : ''}{widget.trend}%
                </span>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{widget.title}</h3>
            <p className="text-2xl font-bold">{