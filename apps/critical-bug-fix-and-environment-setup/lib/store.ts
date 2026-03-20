'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailUpdates: boolean;
  onboardingCompleted: boolean;
  selectedCategories: string[];
  language: string;
  timezone: string;
}

export interface AppState {
  userPreferences: UserPreferences;
  isLoading: boolean;
  setUserPreferences: (preferences: Partial<UserPreferences>) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setLoading: (loading: boolean) => void;
  resetPreferences: () => void;
  getIsOnboarding: () => boolean;
}

const defaultUserPreferences: UserPreferences = {
  theme: 'system',
  notifications: true,
  emailUpdates: false,
  onboardingCompleted: false,
  selectedCategories: [],
  language: 'en',
  timezone: 'UTC',
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      userPreferences: defaultUserPreferences,
      isLoading: false,

      setUserPreferences: (preferences: Partial<UserPreferences>) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            ...preferences,
          },
        })),

      setOnboardingCompleted: (completed: boolean) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            onboardingCompleted: completed,
          },
        })),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      resetPreferences: () =>
        set({
          userPreferences: defaultUserPreferences,
          isLoading: false,
        }),

      getIsOnboarding: () => {
        const state = get();
        return !state.userPreferences.onboardingCompleted;
      },
    }),
    {
      name: 'app-store',
      version: 1,
    }
  )
);

export interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'production' | 'staging';
  maxRetries: number;
  timeout: number;
}

export function getAppConfig(): AppConfig {
  const environment = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'staging';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const maxRetries = parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES || '3', 10);
  const timeout = parseInt(process.env.NEXT_PUBLIC_TIMEOUT || '30000', 10);

  return {
    apiBaseUrl,
    environment,
    maxRetries,
    timeout,
  };
}

export function getServerConfig(): { groqApiKey: string } {
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    throw new Error('GROQ_API_KEY environment variable is not set');
  }

  return {
    groqApiKey,
  };
}