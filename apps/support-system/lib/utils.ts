import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return formatDate(d);
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface ErrorDetails {
  userAgent: string;
  url: string;
  timestamp: string;
  viewport: { width: number; height: number };
}

export function captureErrorDetails(): ErrorDetails {
  try {
    const viewport =
      typeof window !== "undefined"
        ? { width: window.innerWidth, height: window.innerHeight }
        : { width: 0, height: 0 };

    return {
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      timestamp: new Date().toISOString(),
      viewport,
    };
  } catch (error) {
    console.error("Failed to capture error details:", error);
    return {
      userAgent: "unknown",
      url: "unknown",
      timestamp: new Date().toISOString(),
      viewport: { width: 0, height: 0 },
    };
  }
}

interface UserVote {
  id: string;
  userId: string;
  featureId: string;
  voteType: "upvote" | "downvote";
  createdAt: string;
}

export async function loadUserVotes(userId: string): Promise<UserVote[]> {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/votes?userId=${encodeURIComponent(userId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load user votes: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error loading user votes:", error);
    return [];
  }
}

interface VotePayload {
  userId: string;
  featureId: string;
  voteType: "upvote" | "downvote";
}

export async function handleVoteFeature(payload: VotePayload): Promise<UserVote | null> {
  try {
    if (!payload.userId || !payload.featureId || !payload.voteType) {
      throw new Error("Missing required vote fields");
    }

    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit vote: ${response.statusText}`);
    }

    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error("Error submitting vote:", error);
    return null;
  }
}

interface BugSubmission {
  title: string;
  description: string;
  userId: string;
  severity?: "low" | "medium" | "high";
}

export async function handleBugSubmit(payload: BugSubmission): Promise<{ id: string } | null> {
  try {
    if (!payload.title || !payload.description || !payload.userId) {
      throw new Error("Missing required bug report fields");
    }

    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/bugs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit bug report: ${response.statusText}`);
    }

    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error("Error submitting bug report:", error);
    return null;
  }
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || "An unexpected error occurred"}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

import React from "react";