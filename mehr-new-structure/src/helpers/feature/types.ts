// Define the state interface
export interface IStoreState {
  // Example state properties
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  loading: boolean;
  error: string | null;

  // Add your custom state here
  items: any[];
  selectedItem: any | null;
}

// Define the actions interface
interface IStoreActions {
  // User actions
  setUser: (user: IStoreState['user']) => void;
  clearUser: () => void;

  // Theme actions
  setTheme: (theme: IStoreState['theme']) => void;
  toggleTheme: () => void;

  // Loading and error actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Item actions
  setItems: (items: any[]) => void;
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<any>) => void;
  setSelectedItem: (item: any | null) => void;

  // Reset action
  reset: () => void;
}

export type IStore = IStoreState & IStoreActions;
