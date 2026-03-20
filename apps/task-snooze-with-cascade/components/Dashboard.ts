'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Clock, X, ChevronDown } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  scheduledTime: Date;
  duration: number;
  dependsOn?: string[];
  isSnoozed: boolean;
  snoozedUntil?: Date;
  createdAt: Date;
}

interface SnoozeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSnooze: (minutes: number) => void;
  taskTitle: string;
}

const SnoozeModal: React.FC<SnoozeModalProps> = ({
  isOpen,
  onClose,
  onSnooze,
  taskTitle,
}) => {
  const [customMinutes, setCustomMinutes] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const quickOptions = [
    { label: '5 min', minutes: 5 },
    { label: '10 min', minutes: 10 },
    { label: '15 min', minutes: 15 },
    { label: '30 min', minutes: 30 },
    { label: '1 hour', minutes: 60 },
  ];

  const handleCustomSubmit = () => {
    const minutes = parseInt(customMinutes, 10);
    if (minutes > 0) {
      onSnooze(minutes);
      setCustomMinutes('');
      setShowCustom(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Snooze Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-600 mb-6 break-words">"{taskTitle}"</p>

        {!showCustom ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickOptions.map((option) => (
                <button
                  key={option.minutes}
                  onClick={() => onSnooze(option.minutes)}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCustom(true)}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Clock size={18} />
              Custom Time
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minutes
              </label>
              <input
                type="number"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="Enter minutes"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCustomSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Snooze
              </button>
              <button
                onClick={() => {
                  setShowCustom(false);
                  setCustomMinutes('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  onSnoozeClick: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onSnoozeClick }) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeUntilSnoozeEnds = (snoozedUntil: Date) => {
    const now = new Date();
    const diff = new Date(snoozedUntil).getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          )}
        </div>

        {task.isSnoozed && (
          <span className="ml-2 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1 whitespace-nowrap">
            <Clock size={14} />
            Snoozed
          </span>
        )}
      </div>

      {task.isSnoozed && task.snoozedUntil && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          Resumes in {getTimeUntilSnoozeEnds(task.snoozedUntil)}
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-gray-600">
          <span>⏱️ {task.duration} min</span>
          <span>🕐 {formatTime(task.scheduledTime)}</span>
        </div>

        <button
          onClick={() => onSnoozeClick(task)}
          disabled={task.isSnoozed}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm rounded-lg transition-colors"
        >
          {task.isSnoozed ? 'Snoozed' : 'Snooze'}
        </button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [tasks, setT