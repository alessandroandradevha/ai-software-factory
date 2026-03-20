import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  onboardingCompleted: boolean;
  currentStep: number;
  completedSteps: string[];
  setOnboardingCompleted: (completed: boolean) => void;
  setCurrentStep: (step: number) => void;
  markStepAsCompleted: (stepId: string) => void;
  resetOnboarding: () => void;
}

export interface UserPreferences {
  onboardingCompleted: boolean;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme?: 'light' | 'dark';
  language?: string;
  createdAt?: number;
  updatedAt?: number;
  [key: string]: any;
}

const DEFAULT_USER_PREFERENCES: UserPreferences = {
  onboardingCompleted: false,
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  theme: 'light',
  language: 'en',
};

const validateUserPreferences = (prefs: unknown): prefs is UserPreferences => {
  if (typeof prefs !== 'object' || prefs === null) {
    return false;
  }

  const preferences = prefs as Record<string, unknown>;

  if (typeof preferences.onboardingCompleted !== 'boolean') {
    return false;
  }

  if (
    preferences.notifications !== undefined &&
    typeof preferences.notifications === 'object' &&
    preferences.notifications !== null
  ) {
    const notifs = preferences.notifications as Record<string, unknown>;
    if (
      typeof notifs.email !== 'boolean' ||
      typeof notifs.push !== 'boolean' ||
      typeof notifs.sms !== 'boolean'
    ) {
      return false;
    }
  }

  if (
    preferences.theme !== undefined &&
    (preferences.theme !== 'light' && preferences.theme !== 'dark')
  ) {
    return false;
  }

  if (preferences.language !== undefined && typeof preferences.language !== 'string') {
    return false;
  }

  return true;
};

const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      onboardingCompleted: false,
      currentStep: 0,
      completedSteps: [],
      setOnboardingCompleted: (completed: boolean) =>
        set({ onboardingCompleted: completed }),
      setCurrentStep: (step: number) => set({ currentStep: step }),
      markStepAsCompleted: (stepId: string) =>
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, stepId])],
        })),
      resetOnboarding: () =>
        set({
          onboardingCompleted: false,
          currentStep: 0,
          completedSteps: [],
        }),
    }),
    {
      name: 'onboarding-storage',
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.onboardingCompleted = state.onboardingCompleted ?? false;
          state.currentStep = state.currentStep ?? 0;
          state.completedSteps = state.completedSteps ?? [];
        }
      },
    }
  )
);

const createUserPreferences = (): UserPreferences => {
  return {
    ...DEFAULT_USER_PREFERENCES,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

const migrateUserPreferences = (stored: unknown): UserPreferences => {
  if (!validateUserPreferences(stored)) {
    return createUserPreferences();
  }

  return {
    ...stored,
    updatedAt: stored.updatedAt ?? Date.now(),
  };
};

export { useOnboardingStore, createUserPreferences, migrateUserPreferences, validateUserPreferences };
export type { OnboardingState, UserPreferences };