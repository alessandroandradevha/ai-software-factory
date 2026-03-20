'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
  onboardingCompleted: boolean;
}

export interface AppState {
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  completeOnboarding: () => void;
  resetStore: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  notifications: true,
  language: 'en',
  onboardingCompleted: false,
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      isLoading: false,
      error: null,

      updatePreferences: (newPreferences: Partial<UserPreferences>) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences,
          },
        })),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      completeOnboarding: () =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            onboardingCompleted: true,
          },
        })),

      resetStore: () =>
        set({
          preferences: defaultPreferences,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'app-store',
    }
  )
);

export const getStorageKey = (): string => 'app-store';

export const usePreferences = (): UserPreferences => {
  const preferences = useStore((state) => state.preferences);
  return preferences;
};

export const useAppError = (): string | null => {
  return useStore((state) => state.error);
};

export const useAppLoading = (): boolean => {
  return useStore((state) => state.isLoading);
};

export const updatePreferences = (preferences: Partial<UserPreferences>): void => {
  useStore.setState((state) => ({
    preferences: {
      ...state.preferences,
      ...preferences,
    },
  }));
};

export const setAppError = (error: string | null): void => {
  useStore.setState({ error });
};

export const setAppLoading = (loading: boolean): void => {
  useStore.setState({ isLoading: loading });
};

export const completeOnboarding = (): void => {
  useStore.setState((state) => ({
    preferences: {
      ...state.preferences,
      onboardingCompleted: true,
    },
  }));
};

export const resetAppStore = (): void => {
  useStore.setState({
    preferences: defaultPreferences,
    isLoading: false,
    error: null,
  });
};