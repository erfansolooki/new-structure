import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStore } from './helpers/feature/store';
import { routesConfig } from './routes/routesObject';
import { PermissionErrorBoundary } from './routes/middleWare';
import Navigation from './layout/components/Navigation';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading component
const LoadingSpinner: React.FC = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem',
    }}
  >
    <div
      style={{
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
    <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>Loading application...</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Error boundary fallback
const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem',
      padding: '2rem',
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: '4rem' }}>⚠️</div>
    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
      Something went wrong
    </h1>
    <p style={{ color: '#6b7280', maxWidth: '500px' }}>
      An error occurred while loading the application. Please refresh the page or contact support if
      the problem persists.
    </p>
    <button
      onClick={() => window.location.reload()}
      style={{
        background: '#3b82f6',
        color: 'white',
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '1rem',
      }}
    >
      Refresh Page
    </button>
    {process.env.NODE_ENV === 'development' && (
      <details style={{ marginTop: '1rem', textAlign: 'left' }}>
        <summary style={{ cursor: 'pointer', color: '#6b7280' }}>Error Details</summary>
        <pre
          style={{
            background: '#f3f4f6',
            padding: '1rem',
            borderRadius: '6px',
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            overflow: 'auto',
            maxWidth: '500px',
          }}
        >
          {error.message}
          {error.stack}
        </pre>
      </details>
    )}
  </div>
);

// Main layout wrapper
const MainLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useStore((state: any) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Navigation />
      <main
        style={{
          flex: 1,
          marginLeft: '250px',
          padding: '2rem',
          background: '#f9fafb',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
};

// Route renderer component
const RouteRenderer: React.FC<{ routes: any[] }> = ({ routes }) => {
  return (
    <>
      {routes.map((route) => {
        if (route.children) {
          return (
            <Route key={route.path} path={route.path} element={route.element}>
              <RouteRenderer routes={route.children} />
            </Route>
          );
        }
        return <Route key={route.path} path={route.path} element={route.element} />;
      })}
    </>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PermissionErrorBoundary fallback={<ErrorFallback error={new Error('Permission error')} />}>
          <Suspense fallback={<LoadingSpinner />}>
            <MainLayoutWrapper>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Navigate to="/login" replace />} />
                <Route path="/register" element={<Navigate to="/register" replace />} />
                <Route
                  path="/forgot-password"
                  element={<Navigate to="/forgot-password" replace />}
                />
                <Route path="/reset-password" element={<Navigate to="/reset-password" replace />} />

                {/* Error routes */}
                <Route path="/401" element={<Navigate to="/401" replace />} />
                <Route path="/404" element={<Navigate to="/404" replace />} />
                <Route path="/500" element={<Navigate to="/500" replace />} />

                {/* Protected routes */}
                <Route path="/home" element={<Navigate to="/home" replace />} />
                <Route path="/dashboard" element={<Navigate to="/dashboard" replace />} />
                <Route path="/users" element={<Navigate to="/users" replace />} />
                <Route path="/roles" element={<Navigate to="/roles" replace />} />
                <Route path="/permissions" element={<Navigate to="/permissions" replace />} />
                <Route path="/reports" element={<Navigate to="/reports" replace />} />
                <Route path="/settings" element={<Navigate to="/settings" replace />} />
                <Route path="/admin" element={<Navigate to="/admin" replace />} />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </MainLayoutWrapper>
          </Suspense>
        </PermissionErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
