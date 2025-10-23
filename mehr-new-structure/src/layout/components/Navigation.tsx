import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../helpers/feature/store';
import { useHasPermission, useHasRole, useHasAnyPermission } from '../../routes/middleWare';
import { PERMISSIONS, ROLES } from '../../routes/middleWare';
import { ROUTE_PATHS } from '../../routes/routesObject';

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  permissions?: string[];
  roles?: string[];
  requireAll?: boolean;
  children?: NavigationItem[];
}

const Navigation: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useStore((state: any) => state.isAuthenticated);
  const user = useStore((state: any) => state.user);

  // Permission hooks
  const hasDashboardAccess = useHasPermission(PERMISSIONS.DASHBOARD_READ);
  const hasUserManagement = useHasAnyPermission([PERMISSIONS.USER_CREATE, PERMISSIONS.USER_READ]);
  const hasRoleManagement = useHasPermission(PERMISSIONS.ROLE_READ);
  const hasPermissionManagement = useHasPermission(PERMISSIONS.PERMISSION_READ);
  const hasReportAccess = useHasPermission(PERMISSIONS.REPORT_READ);
  const hasSettingsAccess = useHasPermission(PERMISSIONS.SETTINGS_READ);
  const isAdmin = useHasRole(ROLES.ADMIN);
  const isSuperAdmin = useHasRole(ROLES.SUPER_ADMIN);

  const navigationItems: NavigationItem[] = [
    {
      label: 'Home',
      path: ROUTE_PATHS.HOME,
      icon: '🏠',
      permissions: [PERMISSIONS.DASHBOARD_READ],
    },
    {
      label: 'Dashboard',
      path: ROUTE_PATHS.DASHBOARD,
      icon: '📊',
      permissions: [PERMISSIONS.DASHBOARD_READ],
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    {
      label: 'Users',
      path: ROUTE_PATHS.USERS,
      icon: '👥',
      permissions: [PERMISSIONS.USER_READ],
      roles: [ROLES.ADMIN],
    },
    {
      label: 'Roles',
      path: ROUTE_PATHS.ROLES,
      icon: '🔐',
      permissions: [PERMISSIONS.ROLE_READ],
      roles: [ROLES.SUPER_ADMIN],
    },
    {
      label: 'Permissions',
      path: ROUTE_PATHS.PERMISSIONS,
      icon: '🛡️',
      permissions: [PERMISSIONS.PERMISSION_READ],
      roles: [ROLES.SUPER_ADMIN],
    },
    {
      label: 'Reports',
      path: ROUTE_PATHS.REPORTS,
      icon: '📈',
      permissions: [PERMISSIONS.REPORT_READ],
      roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    {
      label: 'Settings',
      path: ROUTE_PATHS.SETTINGS,
      icon: '⚙️',
      permissions: [PERMISSIONS.SETTINGS_READ],
    },
    {
      label: 'Admin',
      path: ROUTE_PATHS.ADMIN,
      icon: '👑',
      roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      children: [
        {
          label: 'Admin Dashboard',
          path: ROUTE_PATHS.ADMIN_DASHBOARD,
          icon: '📊',
          permissions: [PERMISSIONS.DASHBOARD_READ],
          roles: [ROLES.ADMIN],
        },
        {
          label: 'Analytics',
          path: ROUTE_PATHS.ADMIN_ANALYTICS,
          icon: '📈',
          permissions: [PERMISSIONS.REPORT_READ],
          roles: [ROLES.ADMIN],
        },
        {
          label: 'System Settings',
          path: ROUTE_PATHS.ADMIN_SYSTEM,
          icon: '⚙️',
          roles: [ROLES.SUPER_ADMIN],
        },
      ],
    },
  ];

  const canAccessItem = (item: NavigationItem): boolean => {
    // Check permissions
    if (item.permissions && item.permissions.length > 0) {
      const hasPermission = item.requireAll
        ? item.permissions.every((permission) => {
            switch (permission) {
              case PERMISSIONS.DASHBOARD_READ:
                return hasDashboardAccess;
              case PERMISSIONS.USER_READ:
              case PERMISSIONS.USER_CREATE:
                return hasUserManagement;
              case PERMISSIONS.ROLE_READ:
                return hasRoleManagement;
              case PERMISSIONS.PERMISSION_READ:
                return hasPermissionManagement;
              case PERMISSIONS.REPORT_READ:
                return hasReportAccess;
              case PERMISSIONS.SETTINGS_READ:
                return hasSettingsAccess;
              default:
                return false;
            }
          })
        : item.permissions.some((permission) => {
            switch (permission) {
              case PERMISSIONS.DASHBOARD_READ:
                return hasDashboardAccess;
              case PERMISSIONS.USER_READ:
              case PERMISSIONS.USER_CREATE:
                return hasUserManagement;
              case PERMISSIONS.ROLE_READ:
                return hasRoleManagement;
              case PERMISSIONS.PERMISSION_READ:
                return hasPermissionManagement;
              case PERMISSIONS.REPORT_READ:
                return hasReportAccess;
              case PERMISSIONS.SETTINGS_READ:
                return hasSettingsAccess;
              default:
                return false;
            }
          });

      if (!hasPermission) return false;
    }

    // Check roles
    if (item.roles && item.roles.length > 0) {
      const hasRole = item.requireAll
        ? item.roles.every((role) => {
            switch (role) {
              case ROLES.ADMIN:
                return isAdmin;
              case ROLES.SUPER_ADMIN:
                return isSuperAdmin;
              default:
                return false;
            }
          })
        : item.roles.some((role) => {
            switch (role) {
              case ROLES.ADMIN:
                return isAdmin;
              case ROLES.SUPER_ADMIN:
                return isSuperAdmin;
              default:
                return false;
            }
          });

      if (!hasRole) return false;
    }

    return true;
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    if (!canAccessItem(item)) return null;

    const isActive = location.pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <li key={item.path} style={{ marginBottom: level > 0 ? '0.25rem' : '0.5rem' }}>
        <Link
          to={item.path}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: level > 0 ? '0.5rem 1rem' : '0.75rem 1rem',
            borderRadius: '6px',
            textDecoration: 'none',
            color: isActive ? '#3b82f6' : '#374151',
            background: isActive ? '#eff6ff' : 'transparent',
            fontWeight: isActive ? '600' : '500',
            fontSize: level > 0 ? '0.875rem' : '1rem',
            transition: 'all 0.2s',
            marginLeft: level > 0 ? '1rem' : '0',
            borderLeft: level > 0 ? '2px solid #e5e7eb' : 'none',
          }}
          onMouseOver={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.color = '#1f2937';
            }
          }}
          onMouseOut={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#374151';
            }
          }}
        >
          <span style={{ fontSize: level > 0 ? '0.875rem' : '1rem' }}>{item.icon}</span>
          {item.label}
        </Link>
        {hasChildren && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {item.children?.map((child) => renderNavigationItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav
      style={{
        background: 'white',
        borderRight: '1px solid #e5e7eb',
        padding: '1rem',
        minHeight: '100vh',
        width: '250px',
        position: 'fixed',
        left: 0,
        top: 0,
        overflowY: 'auto',
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Navigation
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Welcome, {user?.name || 'User'}</p>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {navigationItems.map((item) => renderNavigationItem(item))}
      </ul>

      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={() => {
            // Handle logout
            const clearUser = useStore.getState().clearUser;
            clearUser();
            window.location.href = '/login';
          }}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#b91c1c';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#dc2626';
          }}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;

