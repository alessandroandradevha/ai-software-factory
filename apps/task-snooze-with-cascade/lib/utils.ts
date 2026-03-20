import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateSnoozeTime(minutes: number): Date {
  const now = new Date();
  const snoozeTime = new Date(now.getTime() + minutes * 60000);
  return snoozeTime;
}

export function getTimeUntilSnoozeEnd(snoozeUntil: Date): string {
  const now = new Date();
  const diff = snoozeUntil.getTime() - now.getTime();

  if (diff <= 0) {
    return "Ready to show";
  }

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h remaining`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m remaining`;
  }
  return `${minutes}m remaining`;
}

export function formatSnoozeTimeDisplay(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (date.getTime() - now.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 0) {
    return "Overdue";
  }

  if (diffInMinutes === 0) {
    return "Now";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  const hours = Math.floor(diffInMinutes / 60);
  const mins = diffInMinutes % 60;

  if (hours < 24) {
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return remainingHours === 0 ? `${days}d` : `${days}d ${remainingHours}h`;
}

export function calculateCascadingTaskShift(
  dependentTasks: Array<{ id: string; dueDate: Date }>,
  newSnoozeTime: Date,
  originalDueDate: Date
): Array<{ id: string; newDueDate: Date }> {
  const timeDifference =
    newSnoozeTime.getTime() - originalDueDate.getTime();

  return dependentTasks.map((task) => ({
    id: task.id,
    newDueDate: new Date(task.dueDate.getTime() + timeDifference),
  }));
}

export function getSnoozeBadgeVariant(
  snoozeUntil: Date | null
): "default" | "secondary" | "destructive" | "outline" {
  if (!snoozeUntil) {
    return "default";
  }

  const now = new Date();
  const diffInMinutes = Math.floor(
    (snoozeUntil.getTime() - now.getTime()) / (1000 * 60)
  );

  if (diffInMinutes > 60) {
    return "secondary";
  }

  if (diffInMinutes <= 0) {
    return "destructive";
  }

  return "outline";
}

export function isTaskSnoozed(snoozeUntil: Date | null): boolean {
  if (!snoozeUntil) {
    return false;
  }

  const now = new Date();
  return snoozeUntil.getTime() > now.getTime();
}

export function getSnoozeMessage(minutesFromNow: number): string {
  if (minutesFromNow === 5) {
    return "Snoozed for 5 minutes";
  }
  if (minutesFromNow === 10) {
    return "Snoozed for 10 minutes";
  }
  if (minutesFromNow === 15) {
    return "Snoozed for 15 minutes";
  }
  if (minutesFromNow === 30) {
    return "Snoozed for 30 minutes";
  }
  if (minutesFromNow === 60) {
    return "Snoozed for 1 hour";
  }

  if (minutesFromNow < 60) {
    return `Snoozed for ${minutesFromNow} minutes`;
  }

  const hours = Math.floor(minutesFromNow / 60);
  const minutes = minutesFromNow % 60;

  if (minutes === 0) {
    return `Snoozed for ${hours} hour${hours > 1 ? "s" : ""}`;
  }

  return `Snoozed for ${hours}h ${minutes}m`;
}

export function validateCustomSnoozeTime(minutes: number): {
  valid: boolean;
  error?: string;
} {
  if (isNaN(minutes) || minutes < 1) {
    return { valid: false, error: "Snooze time must be at least 1 minute" };
  }

  if (minutes > 10080) {
    return {
      valid: false,
      error: "Snooze time cannot exceed 7 days (10080 minutes)",
    };
  }

  return { valid: true };
}

export const SNOOZE_PRESETS = [
  { label: "5 min", minutes: 5 },
  { label: "10 min", minutes: 10 },
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "1 hour", minutes: 60 },
] as const;

export type SnoozePreset = (typeof SNOOZE_PRESETS)[number];

export function getTaskPriority(dueDate: Date): "high" | "medium" | "low" {
  const now = new Date();
  const diffInHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 2) {
    return "high";
  }
  if (diffInHours < 24) {
    return "medium";
  }
  return "low";
}

export function shouldShowSnoozedIndicator(
  snoozeUntil: Date | null,
  createdAt: Date
): boolean {
  if (!snoozeUntil) {
    return false;
  }

  return isTaskSnoozed(snoozeUntil);
}