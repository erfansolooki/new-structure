import { STORAGE_KEYS } from '@/helpers/constants/constant';

/**
 * Storage service for managing localStorage operations
 * Provides type-safe methods with automatic JSON serialization/deserialization
 */
class LocalStorageService {
  private storage: Storage;
  private isAvailable: boolean;

  constructor() {
    this.storage = window.localStorage;
    this.isAvailable = this.checkAvailability();
  }

  /**
   * Check if localStorage is available
   */
  private checkAvailability(): boolean {
    try {
      const testKey = '__storage_test__';
      this.storage.setItem(testKey, 'test');
      this.storage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('localStorage is not available:', error);
      return false;
    }
  }

  /**
   * Get item from localStorage
   * @param key - Storage key
   * @param defaultValue - Default value if key doesn't exist
   * @returns Parsed value or default value
   */
  get<T>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable) {
      return defaultValue ?? null;
    }

    try {
      const item = this.storage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error getting item from localStorage (${key}):`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Set item in localStorage
   * @param key - Storage key
   * @param value - Value to store (will be JSON stringified)
   * @returns Success status
   */
  set<T>(key: string, value: T): boolean {
    if (!this.isAvailable) {
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      this.storage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error setting item in localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   * @param key - Storage key
   */
  remove(key: string): void {
    if (!this.isAvailable) {
      return;
    }

    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage (${key}):`, error);
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    if (!this.isAvailable) {
      return;
    }

    try {
      this.storage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Check if key exists in localStorage
   * @param key - Storage key
   * @returns True if key exists
   */
  has(key: string): boolean {
    if (!this.isAvailable) {
      return false;
    }

    return this.storage.getItem(key) !== null;
  }

  /**
   * Get all keys in localStorage
   * @returns Array of all storage keys
   */
  keys(): string[] {
    if (!this.isAvailable) {
      return [];
    }

    try {
      return Object.keys(this.storage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  }

  /**
   * Get the number of items in localStorage
   * @returns Number of items
   */
  length(): number {
    if (!this.isAvailable) {
      return 0;
    }

    return this.storage.length;
  }

  /**
   * Get item at specific index
   * @param index - Index number
   * @returns Key at index or null
   */
  key(index: number): string | null {
    if (!this.isAvailable) {
      return null;
    }

    return this.storage.key(index);
  }

  /**
   * Get multiple items at once
   * @param keys - Array of storage keys
   * @returns Object with key-value pairs
   */
  getMultiple<T = any>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {};

    keys.forEach((key) => {
      result[key] = this.get<T>(key);
    });

    return result;
  }

  /**
   * Set multiple items at once
   * @param items - Object with key-value pairs
   * @returns Success status
   */
  setMultiple(items: Record<string, any>): boolean {
    try {
      Object.entries(items).forEach(([key, value]) => {
        this.set(key, value);
      });
      return true;
    } catch (error) {
      console.error('Error setting multiple items:', error);
      return false;
    }
  }

  /**
   * Remove multiple items at once
   * @param keys - Array of storage keys
   */
  removeMultiple(keys: string[]): void {
    keys.forEach((key) => {
      this.remove(key);
    });
  }

  /**
   * Get storage size in bytes (approximate)
   * @returns Size in bytes
   */
  getSize(): number {
    if (!this.isAvailable) {
      return 0;
    }

    let size = 0;
    try {
      for (const key in this.storage) {
        if (this.storage.hasOwnProperty(key)) {
          size += key.length + (this.storage.getItem(key)?.length || 0);
        }
      }
    } catch (error) {
      console.error('Error calculating storage size:', error);
    }
    return size;
  }

  /**
   * Get storage size in human-readable format
   * @returns Formatted size string
   */
  getSizeFormatted(): string {
    const bytes = this.getSize();
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    if (bytes === 0) return '0 Bytes';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = (bytes / Math.pow(1024, i)).toFixed(2);

    return `${size} ${sizes[i]}`;
  }

  /**
   * Export all localStorage data
   * @returns Object with all key-value pairs
   */
  export(): Record<string, any> {
    if (!this.isAvailable) {
      return {};
    }

    const data: Record<string, any> = {};

    try {
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key) {
          data[key] = this.get(key);
        }
      }
    } catch (error) {
      console.error('Error exporting localStorage:', error);
    }

    return data;
  }

  /**
   * Import data into localStorage
   * @param data - Object with key-value pairs
   * @param clearExisting - Clear existing data before import
   */
  import(data: Record<string, any>, clearExisting: boolean = false): void {
    if (!this.isAvailable) {
      return;
    }

    try {
      if (clearExisting) {
        this.clear();
      }

      Object.entries(data).forEach(([key, value]) => {
        this.set(key, value);
      });
    } catch (error) {
      console.error('Error importing data to localStorage:', error);
    }
  }

  /**
   * Check if localStorage is available
   * @returns Availability status
   */
  isStorageAvailable(): boolean {
    return this.isAvailable;
  }
}

// Create singleton instance
const localStorageService = new LocalStorageService();

// ============================================
// TYPED HELPERS FOR COMMON STORAGE OPERATIONS
// ============================================

/**
 * Auth token operations
 */
export const authTokenStorage = {
  get: () => localStorageService.get<string>(STORAGE_KEYS.AUTH_TOKEN),
  set: (token: string) => localStorageService.set(STORAGE_KEYS.AUTH_TOKEN, token),
  remove: () => localStorageService.remove(STORAGE_KEYS.AUTH_TOKEN),
  has: () => localStorageService.has(STORAGE_KEYS.AUTH_TOKEN),
};

/**
 * Refresh token operations
 */
export const refreshTokenStorage = {
  get: () => localStorageService.get<string>(STORAGE_KEYS.REFRESH_TOKEN),
  set: (token: string) => localStorageService.set(STORAGE_KEYS.REFRESH_TOKEN, token),
  remove: () => localStorageService.remove(STORAGE_KEYS.REFRESH_TOKEN),
  has: () => localStorageService.has(STORAGE_KEYS.REFRESH_TOKEN),
};

/**
 * User data operations
 */
export const userDataStorage = {
  get: <T = any>() => localStorageService.get<T>(STORAGE_KEYS.USER_DATA),
  set: <T = any>(data: T) => localStorageService.set(STORAGE_KEYS.USER_DATA, data),
  remove: () => localStorageService.remove(STORAGE_KEYS.USER_DATA),
  has: () => localStorageService.has(STORAGE_KEYS.USER_DATA),
};

/**
 * Theme operations
 */
export const themeStorage = {
  get: () => localStorageService.get<'light' | 'dark'>(STORAGE_KEYS.THEME),
  set: (theme: 'light' | 'dark') => localStorageService.set(STORAGE_KEYS.THEME, theme),
  remove: () => localStorageService.remove(STORAGE_KEYS.THEME),
  has: () => localStorageService.has(STORAGE_KEYS.THEME),
};

/**
 * Language operations
 */
export const languageStorage = {
  get: () => localStorageService.get<string>(STORAGE_KEYS.LANGUAGE),
  set: (language: string) => localStorageService.set(STORAGE_KEYS.LANGUAGE, language),
  remove: () => localStorageService.remove(STORAGE_KEYS.LANGUAGE),
  has: () => localStorageService.has(STORAGE_KEYS.LANGUAGE),
};

/**
 * Preferences operations
 */
export const preferencesStorage = {
  get: <T = any>() => localStorageService.get<T>(STORAGE_KEYS.PREFERENCES),
  set: <T = any>(preferences: T) => localStorageService.set(STORAGE_KEYS.PREFERENCES, preferences),
  remove: () => localStorageService.remove(STORAGE_KEYS.PREFERENCES),
  has: () => localStorageService.has(STORAGE_KEYS.PREFERENCES),
};

/**
 * Recent searches operations
 */
export const recentSearchesStorage = {
  get: () => localStorageService.get<string[]>(STORAGE_KEYS.RECENT_SEARCHES, []),
  set: (searches: string[]) => localStorageService.set(STORAGE_KEYS.RECENT_SEARCHES, searches),
  add: (search: string, maxItems: number = 10) => {
    const searches = recentSearchesStorage.get() || [];
    const filtered = searches.filter((s) => s !== search);
    const updated = [search, ...filtered].slice(0, maxItems);
    return recentSearchesStorage.set(updated);
  },
  remove: () => localStorageService.remove(STORAGE_KEYS.RECENT_SEARCHES),
  has: () => localStorageService.has(STORAGE_KEYS.RECENT_SEARCHES),
  clear: () => localStorageService.remove(STORAGE_KEYS.RECENT_SEARCHES),
};

/**
 * Clear all authentication-related data
 */
export const clearAuthData = (): void => {
  authTokenStorage.remove();
  refreshTokenStorage.remove();
  userDataStorage.remove();
};

// Export the service instance as default
export default localStorageService;

// Export the class for testing purposes
export { LocalStorageService };
