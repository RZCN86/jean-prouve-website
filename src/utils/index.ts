// Utility functions for Jean Prouvé website

/**
 * Format a year range for display
 */
export function formatYearRange(startYear: number, endYear?: number): string {
  if (!endYear || startYear === endYear) {
    return startYear.toString();
  }
  return `${startYear}-${endYear}`;
}

/**
 * Generate a slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

/**
 * Check if a string is a valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format a date for display based on locale
 */
export function formatDate(date: Date, locale: string = 'zh'): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Debounce function for search inputs
 */
export function debounce(func: Function, wait: number): Function {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Calculate reading time for text content
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Get responsive image sizes for different breakpoints
 */
export function getResponsiveImageSizes(): string {
  return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
}

// Export biography data utilities
export * from './biographyData';

// Export content update utilities
export * from './contentUpdates';