import { clsx, type ClassValue } from 'clsx';

// Class name utility for conditional styling
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format date utilities
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(d);
}

// Text utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function formatWordCount(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}k`;
  return `${(count / 1000000).toFixed(1)}M`;
}

export function formatReadingTime(wordCount: number): string {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Status utilities
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'approved':
    case 'published':
      return 'text-success-600 bg-success-50 border-success-200';
    case 'in-progress':
    case 'review':
      return 'text-warning-600 bg-warning-50 border-warning-200';
    case 'draft':
    case 'pending':
      return 'text-primary-600 bg-primary-50 border-primary-200';
    case 'error':
      return 'text-error-600 bg-error-50 border-error-200';
    default:
      return 'text-primary-600 bg-primary-50 border-primary-200';
  }
}

export function getStatusIcon(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'approved':
    case 'published':
      return '✓';
    case 'in-progress':
    case 'review':
      return '⏳';
    case 'draft':
    case 'pending':
      return '📝';
    case 'error':
      return '❌';
    default:
      return '📄';
  }
}

// Genre utilities
export function getGenreColor(genre: string): string {
  const colors: Record<string, string> = {
    mystery: 'bg-purple-100 text-purple-800 border-purple-200',
    fantasy: 'bg-blue-100 text-blue-800 border-blue-200',
    'sci-fi': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    horror: 'bg-red-100 text-red-800 border-red-200',
    romance: 'bg-pink-100 text-pink-800 border-pink-200',
    adventure: 'bg-green-100 text-green-800 border-green-200',
    drama: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    thriller: 'bg-orange-100 text-orange-800 border-orange-200',
    historical: 'bg-amber-100 text-amber-800 border-amber-200',
    literary: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  };
  
  return colors[genre] || 'bg-primary-100 text-primary-800 border-primary-200';
}

export function getGenreIcon(genre: string): string {
  const icons: Record<string, string> = {
    mystery: '🔍',
    fantasy: '🧙‍♂️',
    'sci-fi': '🚀',
    horror: '👻',
    romance: '💕',
    adventure: '🗺️',
    drama: '🎭',
    thriller: '⚡',
    historical: '📜',
    literary: '📚',
  };
  
  return icons[genre] || '📖';
}

// Character utilities
export function getRoleColor(role: string): string {
  switch (role.toLowerCase()) {
    case 'protagonist':
      return 'text-success-600 bg-success-50 border-success-200';
    case 'antagonist':
      return 'text-error-600 bg-error-50 border-error-200';
    case 'supporting':
      return 'text-accent-600 bg-accent-50 border-accent-200';
    case 'minor':
      return 'text-primary-600 bg-primary-50 border-primary-200';
    default:
      return 'text-primary-600 bg-primary-50 border-primary-200';
  }
}

// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateStoryTitle(title: string): string | null {
  if (!title.trim()) return 'Title is required';
  if (title.length < 3) return 'Title must be at least 3 characters';
  if (title.length > 100) return 'Title must be less than 100 characters';
  return null;
}

export function validateStoryPremise(premise: string): string | null {
  if (!premise.trim()) return 'Premise is required';
  if (premise.length < 10) return 'Premise must be at least 10 characters';
  if (premise.length > 500) return 'Premise must be less than 500 characters';
  return null;
}

// Local storage utilities
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// URL utilities
export function createStoryUrl(storyId: string): string {
  return `/stories/${storyId}`;
}

export function createChapterUrl(storyId: string, chapterId: string): string {
  return `/stories/${storyId}/chapters/${chapterId}`;
}

// Error handling utilities
export function getErrorMessage(error: any): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

// Loading utilities
export function createLoadingArray(length: number): number[] {
  return Array.from({ length }, (_, i) => i);
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
