export interface UserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailUpdates: boolean;
  language: string;
  timezone: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferencesState {
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
}

export interface UpdateUserPreferencesInput {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  emailUpdates?: boolean;
  language?: string;
  timezone?: string;
  onboardingCompleted?: boolean;
}

export type UserPreferencesContextType = {
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  updatePreferences: (updates: UpdateUserPreferencesInput) => Promise<void>;
  fetchPreferences: () => Promise<void>;
};

export interface UserPreferencesError extends Error {
  code?: string;
  statusCode?: number;
}

export class UserPreferencesException extends Error implements UserPreferencesError {
  code?: string;
  statusCode?: number;

  constructor(message: string, code?: string, statusCode?: number) {
    super(message);
    this.name = 'UserPreferencesException';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const isUserPreferencesError = (error: unknown): error is UserPreferencesError => {
  return error instanceof Error && 'code' in error;
};

# .env.example
NEXT_PUBLIC_APP_NAME=MyApp
NEXT_PUBLIC_APP_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api