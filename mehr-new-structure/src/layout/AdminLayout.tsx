import React, { Suspense } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../helpers/feature/store';
import { useHasRole, useHasPermission } from '../routes/middleWare';
import { ROLES, PERMISSIONS } from '../routes/middleWare';

// Loading component
const LoadingSpinner: React.FC = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      flexDirection: 'column',
      gap: '1rem',
    }}
  >
    <div
      style={{
        width: '32px',
        height: '32px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
    <p>Loading admin panel...</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Admin Navigation Component
const AdminNavigation: React.FC = () => {
  const navigate = useNavigate();
  const isSuperAdmin = useHasRole(ROLES.SUPER_ADMIN);
  const hasAnalyticsAccess = useHasPermission(PERMISSIONS.REPORT_READ);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: '📊',
      required: true,
    },
    {
      label: 'Analytics',
      path: '/admin/analytics',
      icon: '📈',
      required: hasAnalyticsAccess,
    },
    {
      label: 'System Settings',
      path: '/admin/system',
      icon: '⚙️',
      required: isSuperAdmin,
    },
  ].filter((item) => item.required);

  return (
    <nav
      style={{
        background: '#1f2937',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
      }}
    >
      <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>Admin Panel</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '1rem' }}>
        {navigationItems.map((item) => (
          <li key={item.path}>
            <button
              onClick={() => navigate(item.path)}
              style={{
                background: 'transparent',
                border: '1px solid #374151',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#374151';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Admin Layout Component
const AdminLayout: React.FC = () => {
  const isAuthenticated = useStore((state: any) => state.isAuthenticated);
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f9fafb',
        padding: '1rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <AdminNavigation />
        <div
          style={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            minHeight: '600px',
          }}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

