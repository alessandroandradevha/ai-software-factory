import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date')
    }
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

export function formatTime(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date')
    }
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting time:', error)
    return 'Invalid time'
  }
}

export function truncateText(text: string, length: number): string {
  try {
    if (!text || length <= 0) {
      return ''
    }
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
  } catch (error) {
    console.error('Error truncating text:', error)
    return text
  }
}

export function generateId(): string {
  try {
    const randomPart = Math.random().toString(36).substring(2, 11)
    const timestamp = Date.now().toString(36)
    return `${timestamp}-${randomPart}`
  } catch (error) {
    console.error('Error generating ID:', error)
    return `id-${Date.now()}`
  }
}

export interface MigrationStep {
  id: string
  name: string
  description: string
  instructions: string[]
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
}

export function validateMigrationSteps(steps: unknown): steps is MigrationStep[] {
  try {
    if (!Array.isArray(steps)) {
      return false
    }
    return steps.every((step): step is MigrationStep => {
      return (
        typeof step === 'object' &&
        step !== null &&
        typeof step.id === 'string' &&
        typeof step.name === 'string' &&
        typeof step.description === 'string' &&
        Array.isArray(step.instructions) &&
        step.instructions.every((instr: unknown) => typeof instr === 'string') &&
        ['pending', 'in-progress', 'completed', 'failed'].includes(step.status)
      )
    })
  } catch (error) {
    console.error('Error validating migration steps:', error)
    return false
  }
}

export const DEFAULT_MIGRATION_STEPS: MigrationStep[] = [
  {
    id: 'verify-migration',
    name: 'Verify Migration',
    description: 'Verify all migration requirements and dependencies',
    instructions: [
      'Check database connectivity',
      'Verify data integrity',
      'Validate environment variables',
      'Test API connections',
      'Review migration logs'
    ],
    status: 'pending'
  }
]

export function getEnvironmentVariable(key: string, fallback?: string): string {
  const value = process.env[key] || fallback
  if (!value && !fallback) {
    console.warn(`Environment variable ${key} not found`)
  }
  return value || ''
}

export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch (error) {
    console.error('Error parsing JSON:', error)
    return fallback
  }
}

export function safeJsonStringify<T>(data: T, fallback: string = '{}'): string {
  try {
    return JSON.stringify(data)
  } catch (error) {
    console.error('Error stringifying JSON:', error)
    return fallback
  }
}