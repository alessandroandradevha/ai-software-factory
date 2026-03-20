import React, { useState, useCallback, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { Clock, ChevronDown, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  snoozedUntil?: string;
  status: 'pending' | 'snoozed' | 'completed';
  parentTaskId?: string;
  dependentTaskIds: string[];
  createdAt: string;
}

interface SnoozeModalProps {
  isOpen: boolean;
  taskId: string;
  taskTitle: string;
  onClose: () => void;
  onSnooze: (duration: number, customTime?: Date) => Promise<void>;
}

const SnoozeModal: React.FC<SnoozeModalProps> = ({
  isOpen,
  taskId,
  taskTitle,
  onClose,
  onSnooze,
}) => {
  const [customTime, setCustomTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [customMode, setCustomMode] = useState(false);

  const quickOptions = [
    { label: '5 min', minutes: 5 },
    { label: '10 min', minutes: 10 },
    { label: '15 min', minutes: 15 },
    { label: '30 min', minutes: 30 },
    { label: '1 hour', minutes: 60 },
  ];

  const handleQuickSnooze = async (minutes: number) => {
    setIsLoading(true);
    try {
      await onSnooze(minutes);
      onClose();
    } catch (error) {
      console.error('Snooze error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSnooze = async () => {
    if (!customTime) return;
    setIsLoading(true);
    try {
      const customDate = new Date(customTime);
      await onSnooze(0, customDate);
      onClose();
    } catch (error) {
      console.error('Custom snooze error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Snooze Task</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          <span className="font-medium">{taskTitle}</span>
        </p>

        {!customMode ? (
          <div className="space-y-3 mb-6">
            {quickOptions.map((option) => (
              <button
                key={option.minutes}
                onClick={() => handleQuickSnooze(option.minutes)}
                disabled={isLoading}
                className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors disabled:opacity-50"
              >
                {option.label}
              </button>
            ))}
            
            <button
              onClick={() => setCustomMode(true)}
              className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <span>Custom time</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="mb-6 space-y-3">
            <input
              type="datetime-local"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCustomSnooze}
                disabled={isLoading || !customTime}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Snooze
              </button>
              <button
                onClick={() => {
                  setCustomMode(false);
                  setCustomTime('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {!customMode && (
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TaskStatusBadge: React.FC<{ status: string; snoozedUntil?: string }> = ({
  status,
  snoozedUntil,
}) => {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <CheckCircle2 className="w-4 h-4" />
        Completed
      </span>
    );
  }

  if (status === 'snoozed' && snoozedUntil) {
    const snoozedTime = new Date(snoozedUntil);
    const now = new Date();
    const hoursRemaining = Math.max(
      0,
      Math.ceil((snoozedTime.getTime() - now.getTime()) / (1000 * 60 * 60))
    );

    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-4 h-4" />
        Snoozed {hoursRemaining > 0 ? `(${hoursRemaining}h)` : '(resuming soon)'}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
      <AlertCircle className="w-4 h-4" />
      Pending
    </span>
  );
};

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);