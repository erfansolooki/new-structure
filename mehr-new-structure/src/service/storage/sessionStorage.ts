/**
 * Storage service for managing sessionStorage operations
 * Session storage persists only for the duration of the page session
 * Data is cleared when the tab/window is closed
 */
class SessionStorageService {
  private storage: Storage;
  private isAvailable: boolean;

  constructor() {
    this.storage = window.sessionStorage;
    this.isAvailable = this.checkAvailability();
  }

  /**
   * Check if sessionStorage is available
   */
  private checkAvailability(): boolean {
    try {
      const testKey = '__session_storage_test__';
      this.storage.setItem(testKey, 'test');
      this.storage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('sessionStorage is not available:', error);
      return false;
    }
  }

  /**
   * Get item from sessionStorage
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
      console.error(`Error getting item from sessionStorage (${key}):`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Set item in sessionStorage
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
      console.error(`Error setting item in sessionStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Remove item from sessionStorage
   * @param key - Storage key
   */
  remove(key: string): void {
    if (!this.isAvailable) {
      return;
    }

    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from sessionStorage (${key}):`, error);
    }
  }

  /**
   * Clear all items from sessionStorage
   */
  clear(): void {
    if (!this.isAvailable) {
      return;
    }

    try {
      this.storage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }

  /**
   * Check if key exists in sessionStorage
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
   * Get all keys in sessionStorage
   * @returns Array of all storage keys
   */
  keys(): string[] {
    if (!this.isAvailable) {
      return [];
    }

    try {
      return Object.keys(this.storage);
    } catch (error) {
      console.error('Error getting sessionStorage keys:', error);
      return [];
    }
  }

  /**
   * Get the number of items in sessionStorage
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
   * Export all sessionStorage data
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
      console.error('Error exporting sessionStorage:', error);
    }

    return data;
  }

  /**
   * Import data into sessionStorage
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
      console.error('Error importing data to sessionStorage:', error);
    }
  }

  /**
   * Check if sessionStorage is available
   * @returns Availability status
   */
  isStorageAvailable(): boolean {
    return this.isAvailable;
  }

  /**
   * Set item with expiration time (in milliseconds)
   * @param key - Storage key
   * @param value - Value to store
   * @param expirationMs - Expiration time in milliseconds
   * @returns Success status
   */
  setWithExpiration<T>(key: string, value: T, expirationMs: number): boolean {
    const expirationTime = Date.now() + expirationMs;
    const item = {
      value,
      expiration: expirationTime,
    };
    return this.set(key, item);
  }

  /**
   * Get item with expiration check
   * @param key - Storage key
   * @param defaultValue - Default value if key doesn't exist or is expired
   * @returns Value or default value
   */
  getWithExpiration<T>(key: string, defaultValue?: T): T | null {
    const item = this.get<{ value: T; expiration: number }>(key);

    if (!item) {
      return defaultValue ?? null;
    }

    // Check if expired
    if (Date.now() > item.expiration) {
      this.remove(key);
      return defaultValue ?? null;
    }

    return item.value;
  }
}

// Create singleton instance
const sessionStorageService = new SessionStorageService();

// ============================================
// COMMON SESSION STORAGE KEYS
// ============================================
export const SESSION_KEYS = {
  FORM_DATA: 'session_form_data',
  WIZARD_STEP: 'session_wizard_step',
  TEMP_DATA: 'session_temp_data',
  FILTERS: 'session_filters',
  SORT_ORDER: 'session_sort_order',
  PAGINATION: 'session_pagination',
  SEARCH_QUERY: 'session_search_query',
  SELECTED_ITEMS: 'session_selected_items',
  SCROLL_POSITION: 'session_scroll_position',
  TAB_STATE: 'session_tab_state',
  MODAL_STATE: 'session_modal_state',
  DRAFT: 'session_draft',
  TEMP_AUTH: 'session_temp_auth',
  REDIRECT_URL: 'session_redirect_url',
} as const;

// ============================================
// TYPED HELPERS FOR COMMON SESSION OPERATIONS
// ============================================

/**
 * Form data operations (useful for multi-step forms)
 */
export const formDataSession = {
  get: <T = any>() => sessionStorageService.get<T>(SESSION_KEYS.FORM_DATA),
  set: <T = any>(data: T) => sessionStorageService.set(SESSION_KEYS.FORM_DATA, data),
  remove: () => sessionStorageService.remove(SESSION_KEYS.FORM_DATA),
  has: () => sessionStorageService.has(SESSION_KEYS.FORM_DATA),
};

/**
 * Wizard step tracking
 */
export const wizardStepSession = {
  get: () => sessionStorageService.get<number>(SESSION_KEYS.WIZARD_STEP, 0),
  set: (step: number) => sessionStorageService.set(SESSION_KEYS.WIZARD_STEP, step),
  increment: () => {
    const current = wizardStepSession.get() || 0;
    return wizardStepSession.set(current + 1);
  },
  decrement: () => {
    const current = wizardStepSession.get() || 0;
    return wizardStepSession.set(Math.max(0, current - 1));
  },
  reset: () => wizardStepSession.set(0),
  remove: () => sessionStorageService.remove(SESSION_KEYS.WIZARD_STEP),
};

/**
 * Temporary data storage
 */
export const tempDataSession = {
  get: <T = any>() => sessionStorageService.get<T>(SESSION_KEYS.TEMP_DATA),
  set: <T = any>(data: T) => sessionStorageService.set(SESSION_KEYS.TEMP_DATA, data),
  remove: () => sessionStorageService.remove(SESSION_KEYS.TEMP_DATA),
  has: () => sessionStorageService.has(SESSION_KEYS.TEMP_DATA),
};

/**
 * Filters state
 */
export const filtersSession = {
  get: <T = any>() => sessionStorageService.get<T>(SESSION_KEYS.FILTERS),
  set: <T = any>(filters: T) => sessionStorageService.set(SESSION_KEYS.FILTERS, filters),
  remove: () => sessionStorageService.remove(SESSION_KEYS.FILTERS),
  has: () => sessionStorageService.has(SESSION_KEYS.FILTERS),
};

/**
 * Sort order state
 */
export const sortOrderSession = {
  get: () =>
    sessionStorageService.get<{ field: string; order: 'asc' | 'desc' }>(SESSION_KEYS.SORT_ORDER),
  set: (field: string, order: 'asc' | 'desc') =>
    sessionStorageService.set(SESSION_KEYS.SORT_ORDER, { field, order }),
  remove: () => sessionStorageService.remove(SESSION_KEYS.SORT_ORDER),
  has: () => sessionStorageService.has(SESSION_KEYS.SORT_ORDER),
};

/**
 * Pagination state
 */
export const paginationSession = {
  get: () => sessionStorageService.get<{ page: number; pageSize: number }>(SESSION_KEYS.PAGINATION),
  set: (page: number, pageSize: number) =>
    sessionStorageService.set(SESSION_KEYS.PAGINATION, { page, pageSize }),
  remove: () => sessionStorageService.remove(SESSION_KEYS.PAGINATION),
  has: () => sessionStorageService.has(SESSION_KEYS.PAGINATION),
};

/**
 * Search query state
 */
export const searchQuerySession = {
  get: () => sessionStorageService.get<string>(SESSION_KEYS.SEARCH_QUERY),
  set: (query: string) => sessionStorageService.set(SESSION_KEYS.SEARCH_QUERY, query),
  remove: () => sessionStorageService.remove(SESSION_KEYS.SEARCH_QUERY),
  has: () => sessionStorageService.has(SESSION_KEYS.SEARCH_QUERY),
};

/**
 * Selected items state
 */
export const selectedItemsSession = {
  get: <T = string>() => sessionStorageService.get<T[]>(SESSION_KEYS.SELECTED_ITEMS, []),
  set: <T = string>(items: T[]) => sessionStorageService.set(SESSION_KEYS.SELECTED_ITEMS, items),
  add: <T = string>(item: T) => {
    const items = selectedItemsSession.get<T>() || [];
    return selectedItemsSession.set([...items, item]);
  },
  remove: <T = string>(item: T) => {
    const items = selectedItemsSession.get<T>() || [];
    return selectedItemsSession.set(items.filter((i) => i !== item));
  },
  toggle: <T = string>(item: T) => {
    const items = selectedItemsSession.get<T>() || [];
    const exists = items.includes(item);
    if (exists) {
      return selectedItemsSession.remove(item);
    } else {
      return selectedItemsSession.add(item);
    }
  },
  clear: () => sessionStorageService.remove(SESSION_KEYS.SELECTED_ITEMS),
  has: () => sessionStorageService.has(SESSION_KEYS.SELECTED_ITEMS),
};

/**
 * Scroll position state
 */
export const scrollPositionSession = {
  get: () => sessionStorageService.get<{ x: number; y: number }>(SESSION_KEYS.SCROLL_POSITION),
  set: (x: number, y: number) => sessionStorageService.set(SESSION_KEYS.SCROLL_POSITION, { x, y }),
  save: () => {
    return scrollPositionSession.set(window.scrollX, window.scrollY);
  },
  restore: () => {
    const position = scrollPositionSession.get();
    if (position) {
      window.scrollTo(position.x, position.y);
    }
  },
  remove: () => sessionStorageService.remove(SESSION_KEYS.SCROLL_POSITION),
};

/**
 * Tab state
 */
export const tabStateSession = {
  get: () => sessionStorageService.get<string>(SESSION_KEYS.TAB_STATE),
  set: (tabId: string) => sessionStorageService.set(SESSION_KEYS.TAB_STATE, tabId),
  remove: () => sessionStorageService.remove(SESSION_KEYS.TAB_STATE),
  has: () => sessionStorageService.has(SESSION_KEYS.TAB_STATE),
};

/**
 * Draft storage (for unsaved changes)
 */
export const draftSession = {
  get: <T = any>() => sessionStorageService.get<T>(SESSION_KEYS.DRAFT),
  set: <T = any>(draft: T) => sessionStorageService.set(SESSION_KEYS.DRAFT, draft),
  remove: () => sessionStorageService.remove(SESSION_KEYS.DRAFT),
  has: () => sessionStorageService.has(SESSION_KEYS.DRAFT),
};

/**
 * Redirect URL storage (useful after login)
 */
export const redirectUrlSession = {
  get: () => sessionStorageService.get<string>(SESSION_KEYS.REDIRECT_URL),
  set: (url: string) => sessionStorageService.set(SESSION_KEYS.REDIRECT_URL, url),
  remove: () => sessionStorageService.remove(SESSION_KEYS.REDIRECT_URL),
  has: () => sessionStorageService.has(SESSION_KEYS.REDIRECT_URL),
};

/**
 * Clear all session data
 */
export const clearSessionData = (): void => {
  sessionStorageService.clear();
};

// Export the service instance as default
export default sessionStorageService;

// Export the class for testing purposes
export { SessionStorageService };
