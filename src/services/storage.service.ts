/**
 * Storage Service
 * Resilient, type-safe wrapper around Browser Storage with JSON safety and validation
 */

export class StorageService {
  public static get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item === null || item === undefined || item === '') {
        return fallback;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[StorageService] Failed to read key "${key}":`, error);
      return fallback;
    }
  }

  public static set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`[StorageService] Failed to write key "${key}":`, error);
      return false;
    }
  }

  public static remove(key: string): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[StorageService] Failed to remove key "${key}":`, error);
      return false;
    }
  }

  public static clear(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.clear();
      } catch (error) {
        console.error('[StorageService] Error clearing localStorage:', error);
      }
    }
  }
}
