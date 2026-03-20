import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch (error) {
    console.error("Currency formatting error:", error);
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatDate(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(dateObj);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
}

export function formatTime(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(dateObj);
  } catch (error) {
    console.error("Time formatting error:", error);
    return "Invalid time";
  }
}

export function truncateText(text: string, length: number = 100): string {
  if (!text || typeof text !== "string") {
    return "";
  }
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function capitalizeFirstLetter(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function generateSlug(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, ms));
  });
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function dispatchWithErrorHandling<T>(
  dispatch: (action: T) => void,
  action: T,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    dispatch(action);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Dispatch error:", err);
    onError?.(err);
  }
}

export function createLoadingState<T extends Record<string, any>>(
  initial: T
): { state: T; setLoading: (key: keyof T, value: boolean) => void; reset: () => void } {
  let state = { ...initial };

  return {
    state,
    setLoading: (key: keyof T, value: boolean) => {
      state = { ...state, [key]: value };
    },
    reset: () => {
      state = { ...initial };
    },
  };
}

export function validateEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function safeJsonParse<T = unknown>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error("JSON parse error:", error);
    return fallback;
  }
}

export function safeJsonStringify<T = unknown>(value: T, fallback: string = "{}"): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error("JSON stringify error:", error);
    return fallback;
  }
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}