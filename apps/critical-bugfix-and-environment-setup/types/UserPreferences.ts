export type UserPreferences = {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    shareAnalytics: boolean;
    shareProfile: boolean;
    allowMarketing: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reducedMotion: boolean;
  };
  onboardingCompleted: boolean;
  timezone: string;
  dateFormat: string;
  defaultView: string;
  createdAt: string;
  updatedAt: string;
};

function createDefaultUserPreferences(): UserPreferences {
  return {
    theme: 'system',
    language: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      shareAnalytics: true,
      shareProfile: false,
      allowMarketing: false,
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
    },
    onboardingCompleted: false,
    timezone: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || 'UTC',
    dateFormat: process.env.NEXT_PUBLIC_DATE_FORMAT || 'YYYY-MM-DD',
    defaultView: 'dashboard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = createDefaultUserPreferences();

function isNotificationsObject(obj: unknown): obj is UserPreferences['notifications'] {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  const notif = obj as Record<string, unknown>;
  return (
    typeof notif.email === 'boolean' &&
    typeof notif.push === 'boolean' &&
    typeof notif.sms === 'boolean'
  );
}

function isPrivacyObject(obj: unknown): obj is UserPreferences['privacy'] {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  const priv = obj as Record<string, unknown>;
  return (
    typeof priv.shareAnalytics === 'boolean' &&
    typeof priv.shareProfile === 'boolean' &&
    typeof priv.allowMarketing === 'boolean'
  );
}

function isAccessibilityObject(obj: unknown): obj is UserPreferences['accessibility'] {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  const acc = obj as Record<string, unknown>;
  return (
    typeof acc.fontSize === 'string' &&
    ['small', 'medium', 'large'].includes(acc.fontSize as string) &&
    typeof acc.highContrast === 'boolean' &&
    typeof acc.reducedMotion === 'boolean'
  );
}

export function validateUserPreferences(preferences: unknown): preferences is UserPreferences {
  if (!preferences || typeof preferences !== 'object') {
    return false;
  }

  const prefs = preferences as Record<string, unknown>;

  return (
    typeof prefs.theme === 'string' &&
    ['light', 'dark', 'system'].includes(prefs.theme as string) &&
    typeof prefs.language === 'string' &&
    isNotificationsObject(prefs.notifications) &&
    isPrivacyObject(prefs.privacy) &&
    isAccessibilityObject(prefs.accessibility) &&
    typeof prefs.onboardingCompleted === 'boolean' &&
    typeof prefs.timezone === 'string' &&
    typeof prefs.dateFormat === 'string' &&
    typeof prefs.defaultView === 'string' &&
    typeof prefs.createdAt === 'string' &&
    typeof prefs.updatedAt === 'string'
  );
}