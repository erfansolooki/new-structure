/* eslint-disable @typescript-eslint/no-unused-vars */
// ================================================================================================================
// Session Storage Usage Examples
// ================================================================================================================

import sessionStorageService, {
  formDataSession,
  wizardStepSession,
  scrollPositionSession,
  selectedItemsSession,
  filtersSession,
  draftSession,
  redirectUrlSession,
} from '@/service/storage/sessionStorage';
import { useEffect } from 'react';

// Multi-step form
const FormStep1 = () => {
  const saveAndNext = (data: any) => {
    formDataSession.set(data);
    wizardStepSession.increment();
  };
};

// Preserve scroll on navigation
const ScrollManager = () => {
  useEffect(() => {
    scrollPositionSession.restore();

    return () => {
      scrollPositionSession.save();
    };
  }, []);

  return null;
};

// Selected items management
const handleSelect = (itemId: string) => {
  selectedItemsSession.toggle(itemId);
};

// Temporary data with expiration (5 minutes)
const tempToken = 'example-token';
sessionStorageService.setWithExpiration('tempToken', tempToken, 5 * 60 * 1000);
const retrievedToken = sessionStorageService.getWithExpiration('tempToken');

// Save filter state across navigation
filtersSession.set({
  status: 'active',
  category: 'electronics',
});

// Draft auto-save
const autosaveDraft = (content: any) => {
  draftSession.set(content);
};

// Redirect after login example
const loginRedirectExample = (navigate: (path: string) => void) => {
  redirectUrlSession.set(window.location.pathname);
  // After login:
  const redirect = redirectUrlSession.get() || '/dashboard';
  navigate(redirect);
  redirectUrlSession.remove();
};

// ================================================================================================================
// Local Storage Usage Examples
// ================================================================================================================
import localStorageService, {
  authTokenStorage,
  userDataStorage,
  clearAuthData,
  recentSearchesStorage,
} from '@/service/storage/localStortage';

// Basic usage
localStorageService.set('myKey', { name: 'John', age: 30 });
const data = localStorageService.get('myKey');

// Using typed helpers
authTokenStorage.set('my-jwt-token');
const token = authTokenStorage.get();

// User data
interface User {
  id: string;
  name: string;
  email: string;
}
userDataStorage.set<User>({ id: '1', name: 'John', email: 'john@example.com' });
const user = userDataStorage.get<User>();

// Recent searches with auto-limiting
recentSearchesStorage.add('React hooks', 10); // Keeps only last 10 searches

// Clear all auth data on logout
clearAuthData();

// Storage info
console.log(localStorageService.getSizeFormatted()); // "2.5 KB"
console.log(localStorageService.length()); // 5

// Export/Import
const backup = localStorageService.export();
localStorageService.import(backup, true); // true = clear existing first
