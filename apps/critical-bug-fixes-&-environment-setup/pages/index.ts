import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { setOnboarding, setUser } from '@/store/slices/userSlice';
import { supabase } from '@/lib/supabaseClient';
import OnboardingFlow from '@/components/OnboardingFlow';
import Dashboard from '@/components/Dashboard';
import Navigation from '@/components/Navigation';

interface UserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InitializeUserError {
  message: string;
  code?: string;
}

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isOnboarding } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeUser = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw new Error(`Session error: ${sessionError.message}`);
        }

        if (!session) {
          await router.push('/auth/login');
          setIsLoading(false);
          return;
        }

        const userId = session.user.id;
        const userEmail = session.user.email;

        if (!userId || !userEmail) {
          throw new Error('Invalid user session data');
        }

        try {
          dispatch(setUser({
            id: userId,
            email: userEmail,
            name: session.user.user_metadata?.full_name || userEmail.split('@')[0],
            avatar: session.user.user_metadata?.avatar_url || null,
          }));
        } catch (dispatchError) {
          console.error('Failed to dispatch setUser:', dispatchError);
          throw new Error('Failed to set user state');
        }

        const { data: preferences, error: prefError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('userId', userId)
          .single();

        if (prefError && prefError.code !== 'PGRST116') {
          throw new Error(`Preferences fetch error: ${prefError.message}`);
        }

        let isOnboardingRequired = true;

        if (preferences) {
          isOnboardingRequired = !preferences.onboardingCompleted;
        } else {
          const { error: insertError } = await supabase
            .from('user_preferences')
            .insert({
              userId,
              theme: 'light',
              notifications: true,
              onboardingCompleted: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });

          if (insertError) {
            console.error('Failed to create user preferences:', insertError);
          }
        }

        try {
          dispatch(setOnboarding(isOnboardingRequired));
        } catch (dispatchError) {
          console.error('Failed to dispatch setOnboarding:', dispatchError);
          throw new Error('Failed to set onboarding state');
        }

        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('User initialization error:', err);
        setIsLoading(false);
      }
    };

    if (router.isReady) {
      initializeUser();
    }
  }, [router.isReady, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />
      {isOnboarding ? (
        <OnboardingFlow userId={user.id} />
      ) : (
        <Dashboard user={user} />
      )}
    </div>
  );
}