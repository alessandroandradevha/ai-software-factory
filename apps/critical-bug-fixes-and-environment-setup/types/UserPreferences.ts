export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
  language: string;
  timezone: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferencesState extends UserPreferences {
  isLoading: boolean;
  error: string | null;
}

export interface UserPreferencesActions {
  setUserPreferences: (preferences: Partial<UserPreferences>) => void;
  completeOnboarding: () => void;
  updateTheme: (theme: 'light' | 'dark' | 'system') => void;
  updateNotifications: (settings: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    weeklyDigest?: boolean;
    marketingEmails?: boolean;
  }) => void;
  updateLanguage: (language: string) => void;
  updateTimezone: (timezone: string) => void;
  resetPreferences: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface UserPreferencesStore extends UserPreferencesState, UserPreferencesActions {}

export default UserPreferences;