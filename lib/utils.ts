import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utility functions for the application
 */

/**
 * Recursively converts MongoDB documents and objects to plain JavaScript objects
 * that can be safely passed to client components.
 * 
 * @param obj Any object that might contain MongoDB specific properties
 * @returns A plain JavaScript object safe for client components
 */
export function sanitizeForClient<T extends unknown>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForClient) as unknown as T;
  }
  
  // Handle objects
  if (typeof obj === 'object') {
    // Convert Date objects to ISO strings
    if (obj instanceof Date) {
      return obj.toISOString() as unknown as T;
    }
    
    // Handle plain objects and MongoDB documents
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Skip MongoDB internal fields like _id if they're complex objects with buffer
      if (key === '_id' && typeof value === 'object' && value !== null && 'buffer' in value) {
        result[key] = String(value);
        continue;
      }
      
      // Skip functions, symbols and other non-serializable types
      if (typeof value === 'function' || typeof value === 'symbol') {
        continue;
      }
      
      // Recursively sanitize nested objects
      result[key] = sanitizeForClient(value);
    }
    
    return result as unknown as T;
  }
  
  // Return primitive values unchanged
  return obj;
}

/**
 * Format a date to a localized string
 * 
 * @param date Date to format
 * @param locale Locale to use for formatting
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, locale: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
