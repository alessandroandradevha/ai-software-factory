import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API Key is required'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase Auth Domain is required'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase Project ID is required'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase Storage Bucket is required'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase Messaging Sender ID is required'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase App ID is required'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'Stripe Publishable Key is required'),
  STRIPE_SECRET_KEY: z.string().min(1, 'Stripe Secret Key is required'),
  NEXT_PUBLIC_GROQ_API_KEY: z.string().min(1, 'Groq API Key is required'),
  GROQ_API_BASE_URL: z.string().url().optional().default('https://api.groq.com/openai/v1'),
});

export type EnvConfig = z.infer<typeof envSchema>;

const parseEnv = (): EnvConfig => {
  const env = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_GROQ_API_KEY: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    GROQ_API_BASE_URL: process.env.GROQ_API_BASE_URL,
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(errors)
      .map(([key, msgs]) => `${key}: ${msgs?.join(', ')}`)
      .join('\n');
    throw new Error(`Environment validation failed:\n${errorMessages}`);
  }

  return result.data;
};

let parsedEnv: EnvConfig | null = null;

export const getEnv = (): EnvConfig => {
  if (!parsedEnv) {
    parsedEnv = parseEnv();
  }
  return parsedEnv;
};

export const envTemplate = `
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# Groq Configuration
NEXT_PUBLIC_GROQ_API_KEY=
GROQ_API_BASE_URL=https://api.groq.com/openai/v1
`;

export default getEnv;