/**
 * Defensive Programming Utilities
 * Provides safe functions to prevent undefined/null crashes
 */

// Safe array operations
export const safeArray = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value;
  }
  console.warn('safeArray: Expected array, got:', typeof value, value);
  return [];
};

export const safeMap = <T, R>(
  array: unknown, 
  callback: (item: T, index: number) => R,
  fallback: R[] = []
): R[] => {
  try {
    const safeArr = safeArray<T>(array);
    return safeArr.map(callback);
  } catch (error) {
    console.error('safeMap error:', error);
    return fallback;
  }
};

export const safeFilter = <T>(
  array: unknown,
  predicate: (item: T, index: number) => boolean,
  fallback: T[] = []
): T[] => {
  try {
    const safeArr = safeArray<T>(array);
    return safeArr.filter(predicate);
  } catch (error) {
    console.error('safeFilter error:', error);
    return fallback;
  }
};

// Safe object property access
export const safeGet = <T>(obj: unknown, key: string, defaultValue: T): T => {
  if (obj && typeof obj === 'object' && key in obj) {
    const value = (obj as Record<string, unknown>)[key];
    return value !== undefined && value !== null ? (value as T) : defaultValue;
  }
  return defaultValue;
};

export const safeString = (value: unknown, defaultValue = ''): string => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return defaultValue;
  return String(value);
};

export const safeNumber = (value: unknown, defaultValue = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return !isNaN(parsed) ? parsed : defaultValue;
  }
  return defaultValue;
};

export const safeBoolean = (value: unknown, defaultValue = false): boolean => {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return defaultValue;
};

// Safe object validation
export const isValidObject = (obj: unknown): obj is Record<string, unknown> => {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
};

export const hasProperty = (obj: unknown, property: string): boolean => {
  return isValidObject(obj) && property in obj;
};

// Safe array length and access
export const safeLength = (value: unknown): number => {
  if (Array.isArray(value)) return value.length;
  if (typeof value === 'string') return value.length;
  if (isValidObject(value)) return Object.keys(value).length;
  return 0;
};

export const safeArrayAccess = <T>(array: unknown, index: number, defaultValue: T): T => {
  const safeArr = safeArray<T>(array);
  if (index >= 0 && index < safeArr.length) {
    return safeArr[index];
  }
  return defaultValue;
};

// Safe function execution
export const safeExecute = <T>(
  fn: () => T,
  fallback: T,
  errorMessage = 'Safe execution failed'
): T => {
  try {
    return fn();
  } catch (error) {
    console.error(errorMessage, error);
    return fallback;
  }
};

// Safe async function execution
export const safeExecuteAsync = async <T>(
  fn: () => Promise<T>,
  fallback: T,
  errorMessage = 'Safe async execution failed'
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    console.error(errorMessage, error);
    return fallback;
  }
};

// Safe localStorage operations
export const safeLocalStorage = {
  getItem: (key: string, defaultValue: string | null = null): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key) || defaultValue;
      }
    } catch (error) {
      console.error('safeLocalStorage.getItem error:', error);
    }
    return defaultValue;
  },

  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
        return true;
      }
    } catch (error) {
      console.error('safeLocalStorage.setItem error:', error);
    }
    return false;
  },

  removeItem: (key: string): boolean => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
        return true;
      }
    } catch (error) {
      console.error('safeLocalStorage.removeItem error:', error);
    }
    return false;
  }
};

// Safe JSON operations
export const safeJsonParse = <T>(
  jsonString: string | null | undefined,
  defaultValue: T
): T => {
  if (!jsonString || typeof jsonString !== 'string') {
    return defaultValue;
  }
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('safeJsonParse error:', error);
    return defaultValue;
  }
};

export const safeJsonStringify = (
  value: unknown,
  defaultValue = '{}'
): string => {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('safeJsonStringify error:', error);
    return defaultValue;
  }
};

// Type guards with better error handling
export const isNonEmptyArray = <T>(value: unknown): value is T[] => {
  return Array.isArray(value) && value.length > 0;
};

export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

// Validation helpers
export const validateRequired = <T>(
  value: T | null | undefined,
  fieldName: string
): T => {
  if (value === null || value === undefined) {
    throw new Error(`Required field "${fieldName}" is missing`);
  }
  return value;
};

export const validateArray = <T>(
  value: unknown,
  fieldName: string
): T[] => {
  if (!Array.isArray(value)) {
    console.warn(`Field "${fieldName}" should be an array, got:`, typeof value);
    return [];
  }
  return value;
}; 