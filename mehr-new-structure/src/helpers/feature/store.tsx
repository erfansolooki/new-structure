import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { StateCreator } from 'zustand';
import type { IStore, IStoreState } from './types';

// Combine state and actions

// Initial state
const initialState: IStoreState = {
  user: null,
  isAuthenticated: false,
  theme: 'light',
  loading: false,
  error: null,
  items: [],
  selectedItem: null,
};

// Create the store
const storeCreator: StateCreator<IStore> = (set) => ({
  // Initial state
  ...initialState,

  // User actions
  setUser: (user: IStoreState['user']) => set({ user, isAuthenticated: !!user }),

  clearUser: () => set({ user: null, isAuthenticated: false }),

  // Theme actions
  setTheme: (theme: IStoreState['theme']) => set({ theme }),

  toggleTheme: () =>
    set((state: IStoreState) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),

  // Loading and error actions
  setLoading: (loading: boolean) => set({ loading }),

  setError: (error: string | null) => set({ error }),

  // Item actions
  setItems: (items: any[]) => set({ items }),

  addItem: (item: any) =>
    set((state: IStoreState) => ({
      items: [...state.items, item],
    })),

  removeItem: (id: string) =>
    set((state: IStoreState) => ({
      items: state.items.filter((item: any) => item.id !== id),
    })),

  updateItem: (id: string, updates: Partial<any>) =>
    set((state: IStoreState) => ({
      items: state.items.map((item: any) => (item.id === id ? { ...item, ...updates } : item)),
    })),

  setSelectedItem: (item: any | null) => set({ selectedItem: item }),

  // Reset action
  reset: () => set(initialState),
});

export const useStore = create<IStore>()(
  devtools(
    persist(storeCreator, {
      name: 'app-storage', // Name for localStorage key
      partialize: (state: IStore) => ({
        // Only persist these fields
        theme: state.theme,
        user: state.user,
      }),
    }),
    {
      name: 'AppStore', // Name for Redux DevTools
    }
  )
);

// Selectors for optimized re-renders
export const selectUser = (state: IStore) => state.user;
export const selectIsAuthenticated = (state: IStore) => state.isAuthenticated;
export const selectTheme = (state: IStore) => state.theme;
export const selectLoading = (state: IStore) => state.loading;
export const selectError = (state: IStore) => state.error;
export const selectItems = (state: IStore) => state.items;
export const selectSelectedItem = (state: IStore) => state.selectedItem;

// Custom hooks for specific use cases
export const useUser = () => useStore(selectUser);
export const useTheme = () => useStore(selectTheme);
export const useIsAuthenticated = () => useStore(selectIsAuthenticated);
export const useItems = () => useStore(selectItems);
