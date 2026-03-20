import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserPreferences {
  onboardingCompleted: boolean;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  dataAnalytics: boolean;
  language: string;
  timezone: string;
  compactMode: boolean;
  defaultView: 'dashboard' | 'calendar' | 'analytics';
}

interface NotificationsPreferences {
  email: boolean;
  push: boolean;
}

interface PrivacyPreferences {
  dataAnalytics: boolean;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  notifications: NotificationsPreferences;
  privacy: PrivacyPreferences;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  updateOnboardingStatus: (completed: boolean) => void;
  updateTheme: (theme: 'light' | 'dark' | 'system') => void;
  updateEmailNotifications: (enabled: boolean) => void;
  updatePushNotifications: (enabled: boolean) => void;
  updateDataAnalytics: (enabled: boolean) => void;
  updateLanguage: (language: string) => void;
  updateTimezone: (timezone: string) => void;
  toggleCompactMode: (enabled: boolean) => void;
  updateDefaultView: (view: 'dashboard' | 'calendar' | 'analytics') => void;
  resetPreferences: () => void;
  fetchUserPreferences: () => Promise<UserPreferences>;
}

interface UserPreferencesState extends UserPreferencesContextType {}

const defaultPreferences: UserPreferences = {
  onboardingCompleted: false,
  theme: 'system',
  emailNotifications: true,
  pushNotifications: false,
  dataAnalytics: true,
  language: 'en',
  timezone: 'UTC',
  compactMode: false,
  defaultView: 'dashboard',
};

const defaultNotifications: NotificationsPreferences = {
  email: true,
  push: false,
};

const defaultPrivacy: PrivacyPreferences = {
  dataAnalytics: true,
};

const getApiKey = (): string => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not set');
  }
  return apiKey;
};

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      notifications: defaultNotifications,
      privacy: defaultPrivacy,

      setPreferences: (newPreferences: Partial<UserPreferences>) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences,
          },
        }));
      },

      updateOnboardingStatus: (completed: boolean) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            onboardingCompleted: completed,
          },
        }));
      },

      updateTheme: (theme: 'light' | 'dark' | 'system') => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            theme,
          },
        }));
      },

      updateEmailNotifications: (enabled: boolean) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            emailNotifications: enabled,
          },
          notifications: {
            ...state.notifications,
            email: enabled,
          },
        }));
      },

      updatePushNotifications: (enabled: boolean) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            pushNotifications: enabled,
          },
          notifications: {
            ...state.notifications,
            push: enabled,
          },
        }));
      },

      updateDataAnalytics: (enabled: boolean) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            dataAnalytics: enabled,
          },
          privacy: {
            ...state.privacy,
            dataAnalytics: enabled,
          },
        }));
      },

      updateLanguage: (language: string) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            language,
          },
        }));
      },

      updateTimezone: (timezone: string) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            timezone,
          },
        }));
      },

      toggleCompactMode: (enabled: boolean) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            compactMode: enabled,
          },
        }));
      },

      updateDefaultView: (view: 'dashboard' | 'calendar' | 'analytics') => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            defaultView: view,
          },
        }));
      },

      resetPreferences: () => {
        set(() => ({
          preferences: defaultPreferences,
          notifications: defaultNotifications,
          privacy: defaultPrivacy,
        }));
      },

      fetchUserPreferences: async (): Promise<UserPreferences> => {
        try {
          const apiKey = getApiKey();
          
          if (!apiKey) {
            console.warn('API key not available, returning default preferences');
            return defaultPreferences;
          }

          const response = await fetch('/api/user-preferences', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch user preferences: ${response.statusText}`);
          }

          const data: UserPreferences = await response.json();
          
          set(() => ({
            preferences: data,
          }));

          return data;
        } catch (error) {
          console.error('Error fetching user preferences:', error);
          return defaultPreferences;
        }
      },
    }),
    {
      name: 'user-preferences-store',
      partialize: (state) => ({
        preferences: state.preferences,
        notifications: state.notifications,
        privacy: state.privacy,
      }),
    }
  )
);