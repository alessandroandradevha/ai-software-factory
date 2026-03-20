import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import ImportModal from './ImportModal';
import MigrationDetection from './MigrationDetection';
import ImportGuide from './ImportGuide';
import AdvantagesCarousel from './AdvantagesCarousel';
import { supabase } from '@/lib/supabaseClient';

interface UserData {
  id: string;
  email: string;
  has_migrated: boolean;
  migration_status: string;
}

interface MigrationStep {
  id: string;
  title: string;
  instructions: string[];
  completed: boolean;
}

interface DashboardState {
  user: UserData | null;
  showImportModal: boolean;
  showMigrationDetection: boolean;
  migrationDetected: boolean;
  isLoading: boolean;
  error: string | null;
  migrationSteps: MigrationStep[];
}

interface Advantage {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const ADVANTAGES: Advantage[] = [
  {
    id: 1,
    title: 'Advanced Analytics',
    description: 'Get detailed insights into your data with powerful analytics tools',
    icon: 'chart',
  },
  {
    id: 2,
    title: 'Real-time Collaboration',
    description: 'Work together seamlessly with real-time updates and notifications',
    icon: 'users',
  },
  {
    id: 3,
    title: 'Secure Integration',
    description: 'Enterprise-grade security with encrypted data transmission',
    icon: 'lock',
  },
  {
    id: 4,
    title: 'Automated Workflows',
    description: 'Save time with intelligent automation and smart scheduling',
    icon: 'zap',
  },
];

class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <p className="text-red-700 text-sm">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const validateMigrationSteps = (steps: unknown): steps is MigrationStep[] => {
  if (!Array.isArray(steps)) return false;
  return steps.every(
    (step) =>
      typeof step === 'object' &&
      step !== null &&
      typeof step.id === 'string' &&
      typeof step.title === 'string' &&
      Array.isArray(step.instructions) &&
      step.instructions.every((instr) => typeof instr === 'string') &&
      typeof step.completed === 'boolean'
  );
};

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>({
    user: null,
    showImportModal: false,
    showMigrationDetection: false,
    migrationDetected: false,
    isLoading: true,
    error: null,
    migrationSteps: [],
  });

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw new Error(`Session error: ${sessionError.message}`);
        }

        if (!session) {
          router.push('/auth/login');
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, has_migrated, migration_status')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          throw new Error(`User fetch error: ${userError.message}`);
        }

        const { data: stepsData, error: stepsError } = await supabase
          .from('migration_steps')
          .select('id, title, instructions, completed')
          .order('id', { ascending: true });

        if (stepsError) {
          throw new Error(`Steps fetch error: ${stepsError.message}`);
        }

        if (!validateMigrationSteps(stepsData)) {
          throw new Error('Invalid migration steps data structure');
        }

        setState((prevState) => ({
          ...prevState,
          user: userData as UserData,
          migrationSteps: stepsData,
          migrationDetected: userData.has_migrated === false,
          isLoading: false,
        }));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('Dashboard initialization error:', errorMessage);
        setState((prevState) => ({
          ...prevState,
          error: errorMessage,
          isLoading: false,
        }));
      }
    };

    initializeDashboard();
  }, [router]);

  const handleOpenImportModal = () => {
    try {
      setState((prevState) => ({
        ...prevState,
        showImportModal: true,
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to open import modal';
      setState((prevState) => ({
        ...prevState,
        error: errorMessage,
      }));
    }
  };

  const handleCloseImportModal = () => {
    try {
      setState((prevState) => ({
        ...prevState,
        showImportModal: false,
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to close import modal';
      setState((prevState) => ({
        ...prevState,
        error: errorMessage,
      }));
    }
  };

  const handleMigrationDetected = () => {
    try {
      setState((prevState) => ({
        ...prevState,
        migrationDetected: true,
        showMigrationDetection: true,
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to handle migration';
      setState((prevState) => ({
        ...prevState,
        error: errorMessage,
      }));
    }
  };

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-red-600 text-