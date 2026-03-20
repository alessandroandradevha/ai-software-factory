'use client';

import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, MessageSquare, Zap } from 'lucide-react';
import SupportWidget from './SupportWidget';

interface DashboardStats {
  totalBugReports: number;
  totalFeatureRequests: number;
  communityVotes: number;
  resolvedIssues: number;
}

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  votes: number;
  userVoted: boolean;
}

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  votes: number;
  userVoted: boolean;
  createdBy: string;
  createdAt: string;
}

interface BugReport {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'acknowledged' | 'in-progress' | 'resolved';
  createdAt: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

async function loadUserVotes(): Promise<{ [key: string]: boolean }> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/user/votes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to load user votes: ${response.statusText}`);
    }

    const data = await response.json();
    return data.votes || {};
  } catch (err) {
    console.error('Error loading user votes:', err);
    return {};
  }
}

async function loadDashboardStats(): Promise<DashboardStats> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to load stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Error loading dashboard stats:', err);
    return {
      totalBugReports: 0,
      totalFeatureRequests: 0,
      communityVotes: 0,
      resolvedIssues: 0,
    };
  }
}

async function loadRoadmapItems(): Promise<RoadmapItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/roadmap`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to load roadmap: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Error loading roadmap items:', err);
    return [];
  }
}

async function loadFeatureRequests(): Promise<FeatureRequest[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/features`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to load features: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Error loading feature requests:', err);
    return [];
  }
}

async function loadBugReports(): Promise<BugReport[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/bugs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to load bug reports: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Error loading bug reports:', err);
    return [];
  }
}

async function handleVoteFeature(featureId: string): Promise<void> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/features/${featureId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to vote on feature: ${response.statusText}`);
    }
  } catch (err) {
    console.error('Error voting on feature:', err);
    throw err;
  }
}

async function handleBugSubmit(bugData: Omit<BugReport, 'id' | 'createdAt'>): Promise<void> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/bugs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bugData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to submit bug report: ${response.statusText}`);
    }
  } catch (err) {
    console.error('