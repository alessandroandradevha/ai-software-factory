import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import SupportWidget from '../components/SupportWidget';
import BugReportForm from '../components/BugReportForm';
import FeatureRequestForm from '../components/FeatureRequestForm';
import RoadmapView from '../components/RoadmapView';
import CommunityVoting from '../components/CommunityVoting';

interface Feature {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: 'planned' | 'in_progress' | 'completed' | 'backlog';
  createdAt: string;
  userVoted?: boolean;
}

interface BugReport {
  id: string;
  title: string;
  description: string;
  appState: string;
  errorLog: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

interface UserVotesData {
  [key: string]: boolean;
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
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

function HomePageContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'bugs' | 'features' | 'roadmap'>('overview');
  const [features, setFeatures] = useState<Feature[]>([]);
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [showSupportWidget, setShowSupportWidget] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([fetchFeatures(), fetchBugReports(), loadUserVotes()]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const fetchFeatures = async (): Promise<void> => {
    try {
      const response = await fetch(`${apiBaseUrl}/features`);
      if (!response.ok) {
        throw new Error(`Failed to fetch features: ${response.statusText}`);
      }
      const data: Feature[] = await response.json();
      setFeatures(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch features';
      setError(errorMessage);
      console.error('Fetch features error:', err);
    }
  };

  const fetchBugReports = async (): Promise<void> => {
    try {
      const response = await fetch(`${apiBaseUrl}/bugs`);
      if (!response.ok) {
        throw new Error(`Failed to fetch bug reports: ${response.statusText}`);
      }
      const data: BugReport[] = await response.json();
      setBugReports(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bug reports';
      setError(errorMessage);
      console.error('Fetch bug reports error:', err);
    }
  };

  const loadUserVotes = async (): Promise<void> => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setUserVotes(new Set());
        return;
      }

      const response = await fetch(`${apiBaseUrl}/user-votes?userId=${encodeURIComponent(userId)}`);
      if (!response.ok) {
        throw new Error(`Failed to load user votes: ${response.statusText}`);
      }
      const data: UserVotesData = await response.json();
      setUserVotes(new Set(Object.keys(data).filter(key => data[key] === true)));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user votes';
      console.error('Load user votes error:', err);
      setUserVotes(new Set());
    }
  };

  const handleVoteFeature = async (featureId: string): Promise<void> => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Please log in to vote');
        return;
      }

      const isVoted = userVotes.has(featureId);
      const response = await fetch(`${apiBaseUrl}/features/${featureId}/vote`, {
        method: isVoted ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to vote on feature: ${response.statusText}`);
      }

      const newVotes = new Set(userVotes);
      if (isVoted) {
        newVotes.delete(featureId);
      } else {
        newVotes.add(featureId);
      }
      setUserVotes(newVotes);

      const updatedFeatures = features.map(f =>
        f.id === featureId
          ? { ...f, votes: f.votes + (isVoted ? -1 : 1), userVoted: !isVoted }
          : f
      );
      setFeatures(updatedFeatures);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to vote on feature';
      setError(errorMessage);
      console.error('Vote feature error:', err);
    }
  };

  const handleBugSubmit = async (bugData: Omit<BugReport, 'id' | 'createdAt' | 'status'>): Promise<void> => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`${apiBaseUrl}/bugs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        