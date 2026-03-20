'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface MigrationStep {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  platform: string;
}

interface Advantage {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface MigrationState {
  currentStep: number;
  completedSteps: string[];
  error: string | null;
  loading: boolean;
}

const validateMigrationStep = (step: unknown): step is MigrationStep => {
  if (!step || typeof step !== 'object') return false;
  const s = step as Record<string, unknown>;
  return (
    typeof s.id === 'string' &&
    typeof s.title === 'string' &&
    typeof s.description === 'string' &&
    Array.isArray(s.instructions) &&
    s.instructions.every((item: unknown) => typeof item === 'string') &&
    typeof s.platform === 'string'
  );
};

const migrationSteps: MigrationStep[] = [
  {
    id: 'structured-export',
    title: 'Export from Structured',
    description: 'Export your data from your current Structured instance',
    instructions: [
      'Log in to your Structured account',
      'Navigate to Settings > Data Export',
      'Select all data you want to migrate',
      'Click "Export as JSON"',
      'Save the file to your computer'
    ],
    platform: 'structured'
  },
  {
    id: 'prepare-data',
    title: 'Prepare Your Data',
    description: 'Format your data for Senseday import',
    instructions: [
      'Open the exported JSON file',
      'Verify all data is present',
      'Check for any formatting issues',
      'Save backup copy of original file'
    ],
    platform: 'structured'
  },
  {
    id: 'import-senseday',
    title: 'Import to Senseday',
    description: 'Import your data into Senseday',
    instructions: [
      'Log in to your Senseday account',
      'Navigate to Settings > Data Import',
      'Select the prepared JSON file',
      'Review the import preview',
      'Click "Import Data" to complete migration'
    ],
    platform: 'senseday'
  },
  {
    id: 'verify-migration',
    title: 'Verify Migration',
    description: 'Verify all your data has been successfully migrated',
    instructions: [
      'Check all imported data in Senseday',
      'Verify data integrity and completeness',
      'Compare with original export file',
      'Test all features with migrated data',
      'Update any settings or preferences in Senseday'
    ],
    platform: 'senseday'
  }
];

const advantages: Advantage[] = [
  {
    id: 1,
    title: 'Seamless Integration',
    description: 'Smooth data transfer without losing any information',
    icon: 'Package'
  },
  {
    id: 2,
    title: 'Secure Transfer',
    description: 'Your data is encrypted and transferred securely',
    icon: 'Lock'
  },
  {
    id: 3,
    title: 'Expert Support',
    description: 'Get help from our migration specialists',
    icon: 'HeadsetIcon'
  }
];

export default function MigrationGuide() {
  const [state, setState] = useState<MigrationState>({
    currentStep: 0,
    completedSteps: [],
    error: null,
    loading: false
  });

  const [validatedSteps, setValidatedSteps] = useState<MigrationStep[]>([]);

  useEffect(() => {
    try {
      const filtered = migrationSteps.filter(validateMigrationStep);
      if (filtered.length === 0) {
        throw new Error('No valid migration steps found');
      }
      setValidatedSteps(filtered);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load migration steps';
      setState(prev => ({
        ...prev,
        error: errorMessage
      }));
    }
  }, []);

  const handleStepComplete = (stepId: string): void => {
    try {
      setState(prev => {
        const updated = {
          ...prev,
          completedSteps: [...prev.completedSteps, stepId],
          error: null
        };
        if (prev.currentStep < validatedSteps.length - 1) {
          updated.currentStep = prev.currentStep + 1;
        }
        return updated;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete step';
      setState(prev => ({
        ...prev,
        error: errorMessage
      }));
    }
  };

  const handleStepChange = (stepIndex: number): void => {
    try {
      if (stepIndex >= 0 && stepIndex < validatedSteps.length) {
        setState(prev => ({
          ...prev,
          currentStep: stepIndex,
          error: null
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change step';
      setState(prev => ({
        ...prev,
        error: errorMessage
      }));
    }
  };

  if (validatedSteps.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-lg font-semibold text-gray-900">
            {state.error || 'Loading migration guide...'}
          </p>
        </div>
      </div>
    );
  }

  const currentStep = validatedSteps[state.currentStep];
  const isStepCompleted = (stepId: string): boolean => state.completedSteps.includes(stepId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">{state.error}</div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Migrate to Senseday
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Follow these steps to migrate your data from Structured
            </p>

            <div className="space-y-6">
              {validatedSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity