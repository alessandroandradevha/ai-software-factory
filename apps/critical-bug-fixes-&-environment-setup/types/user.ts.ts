export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailNotifications: boolean;
  timezone: string;
  language: string;
  onboardingCompleted: boolean;
  privacyLevel: 'public' | 'private' | 'friends';
  twoFactorEnabled: boolean;
  marketingConsent: boolean;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface UserAuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface OnboardingState {
  steps: OnboardingStep[];
  currentStep: number;
  isCompleted: boolean;
}

export const defaultUserPreferences: UserPreferences = {
  theme: 'system',
  notifications: true,
  emailNotifications: true,
  timezone: 'UTC',
  language: 'en',
  onboardingCompleted: false,
  privacyLevel: 'private',
  twoFactorEnabled: false,
  marketingConsent: false,
};

export const defaultUser: User = {
  id: '',
  email: '',
  displayName: '',
  photoURL: '',
  preferences: defaultUserPreferences,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const defaultOnboardingState: OnboardingState = {
  steps: [
    {
      id: 'profile-setup',
      title: 'Profile Setup',
      description: 'Set up your profile information',
      completed: false,
      order: 1,
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Configure your preferences',
      completed: false,
      order: 2,
    },
    {
      id: 'verification',
      title: 'Email Verification',
      description: 'Verify your email address',
      completed: false,
      order: 3,
    },
  ],
  currentStep: 0,
  isCompleted: false,
};

export default User;