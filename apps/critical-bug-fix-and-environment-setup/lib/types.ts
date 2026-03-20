// types/index.ts

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showActivity: boolean;
    allowMessages: boolean;
  };
  language: string;
  timezone: string;
  autoSave: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastSignIn: Date;
  emailVerified: boolean;
  preferences: UserPreferences;
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    stripeCustomerId?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (displayName: string, photoURL?: string) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export interface StoreState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
  enableAnalytics: boolean;
  stripePublishableKey: string;
  maxUploadSizeBytes: number;
}

// config/app.ts

function getAppConfig(): AppConfig {
  const environment = (process.env.NODE_ENV || 'development') as AppConfig['environment'];
  
  const config: AppConfig = {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
    environment,
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY || '',
    maxUploadSizeBytes: parseInt(process.env.REACT_APP_MAX_UPLOAD_SIZE || '5242880', 10),
  };

  if (!config.stripePublishableKey) {
    console.warn('Stripe public key is not configured');
  }

  return config;
}

export default getAppConfig;

// config/envValidator.ts

import type { AppConfig } from './app';

class EnvironmentValidator {
  static validateConfig(config: AppConfig): void {
    if (!config.apiBaseUrl) {
      throw new Error('API base URL is not configured');
    }

    if (!config.stripePublishableKey && config.environment === 'production') {
      throw new Error('Stripe public key is required in production');
    }

    if (config.maxUploadSizeBytes <= 0) {
      throw new Error('Invalid max upload size');
    }
  }

  static validateRequiredEnvVars(): void {
    const requiredVars = [
      'REACT_APP_API_BASE_URL',
      'REACT_APP_STRIPE_PUBLIC_KEY',
    ];

    const missing = requiredVars.filter(v => !process.env[v]);

    if (missing.length > 0) {
      console.warn(`Missing environment variables: ${missing.join(', ')}`);
    }
  }
}

export default EnvironmentValidator;

// .env.example

REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key_here
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_MAX_UPLOAD_SIZE=5242880
NODE_ENV=development