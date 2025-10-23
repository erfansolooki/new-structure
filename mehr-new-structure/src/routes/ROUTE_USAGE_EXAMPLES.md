# Route System Usage Examples

This document provides comprehensive examples of how to use the nested route system with permission middleware.

## Table of Contents

1. [Basic Route Setup](#basic-route-setup)
2. [Permission-based Routes](#permission-based-routes)
3. [Role-based Routes](#role-based-routes)
4. [Lazy Loading](#lazy-loading)
5. [Layout Components](#layout-components)
6. [Navigation Integration](#navigation-integration)
7. [Error Handling](#error-handling)
8. [Advanced Examples](#advanced-examples)

## Basic Route Setup

### 1. Simple Route Configuration

```tsx
import { routesConfig } from './routes/routesObject';

// Use in your App component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routesConfig.map((route) => (
          <Route key={route.path} path={route.path} element={route.element}>
            {route.children?.map((child) => (
              <Route key={child.path} path={child.path} element={child.element} />
            ))}
          </Route>
        ))}
      </Routes>
    </BrowserRouter>
  );
}
```

### 2. Route with Permission Middleware

```tsx
import { PermissionMiddleware, PERMISSIONS } from './routes/middleWare';

const ProtectedPage = () => (
  <PermissionMiddleware
    requiredPermissions={[PERMISSIONS.USER_READ]}
    fallbackComponent={<div>Access Denied</div>}
  >
    <div>This page requires USER_READ permission</div>
  </PermissionMiddleware>
);
```

## Permission-based Routes

### 1. Single Permission Check

```tsx
const UserManagementPage = () => (
  <PermissionMiddleware
    requiredPermissions={[PERMISSIONS.USER_READ]}
    fallbackComponent={<div>You need user read permission</div>}
  >
    <UserManagementComponent />
  </PermissionMiddleware>
);
```

### 2. Multiple Permission Requirements

```tsx
const AdminUserPage = () => (
  <PermissionMiddleware
    requiredPermissions={[PERMISSIONS.USER_READ, PERMISSIONS.USER_UPDATE]}
    requireAll={true}
    fallbackComponent={<div>You need both READ and UPDATE permissions</div>}
  >
    <AdminUserComponent />
  </PermissionMiddleware>
);
```

### 3. Any Permission Check

```tsx
const FlexiblePage = () => (
  <PermissionMiddleware
    requiredPermissions={[PERMISSIONS.USER_READ, PERMISSIONS.USER_CREATE]}
    requireAll={false}
    fallbackComponent={<div>You need either READ or CREATE permission</div>}
  >
    <FlexibleComponent />
  </PermissionMiddleware>
);
```

## Role-based Routes

### 1. Single Role Check

```tsx
const AdminPage = () => (
  <PermissionMiddleware
    requiredRoles={[ROLES.ADMIN]}
    fallbackComponent={<div>Admin access required</div>}
  >
    <AdminComponent />
  </PermissionMiddleware>
);
```

### 2. Multiple Role Requirements

```tsx
const ManagerOrAdminPage = () => (
  <PermissionMiddleware
    requiredRoles={[ROLES.ADMIN, ROLES.MANAGER]}
    requireAll={false}
    fallbackComponent={<div>Manager or Admin access required</div>}
  >
    <ManagerOrAdminComponent />
  </PermissionMiddleware>
);
```

### 3. Combined Permission and Role Check

```tsx
const ComplexPage = () => (
  <PermissionMiddleware
    requiredPermissions={[PERMISSIONS.USER_READ]}
    requiredRoles={[ROLES.ADMIN]}
    requireAll={false}
    fallbackComponent={<div>You need USER_READ permission OR Admin role</div>}
  >
    <ComplexComponent />
  </PermissionMiddleware>
);
```

## Lazy Loading

### 1. Basic Lazy Loading

```tsx
import { lazy } from 'react';

const LazyComponent = lazy(() => import('./components/LazyComponent'));

const RouteWithLazyComponent = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
  </Suspense>
);
```

### 2. Lazy Loading with Permissions

```tsx
const LazyProtectedComponent = lazy(() => import('./components/ProtectedComponent'));

const ProtectedRoute = () => (
  <PermissionMiddleware
    requiredPermissions={[PERMISSIONS.USER_READ]}
    fallbackComponent={<div>Access Denied</div>}
  >
    <Suspense fallback={<div>Loading protected content...</div>}>
      <LazyProtectedComponent />
    </Suspense>
  </PermissionMiddleware>
);
```

## Layout Components

### 1. Main Layout with Navigation

```tsx
import Navigation from './layout/components/Navigation';

const MainLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Navigation />
    <main style={{ flex: 1, marginLeft: '250px', padding: '2rem' }}>{children}</main>
  </div>
);
```

### 2. Auth Layout

```tsx
const AuthLayout = ({ children }) => (
  <div
    style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
      }}
    >
      {children}
    </div>
  </div>
);
```

### 3. Admin Layout

```tsx
const AdminLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '1rem' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <AdminNavigation />
      <div
        style={{
          background: 'white',
          borderRadius: '8px',
          padding: '2rem',
          marginTop: '1rem',
        }}
      >
        {children}
      </div>
    </div>
  </div>
);
```

## Navigation Integration

### 1. Permission-based Navigation

```tsx
import { useHasPermission, useHasRole } from './routes/middleWare';

const Navigation = () => {
  const hasUserAccess = useHasPermission(PERMISSIONS.USER_READ);
  const isAdmin = useHasRole(ROLES.ADMIN);

  return (
    <nav>
      <ul>
        {hasUserAccess && (
          <li>
            <Link to="/users">Users</Link>
          </li>
        )}
        {isAdmin && (
          <li>
            <Link to="/admin">Admin Panel</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
```

### 2. Dynamic Navigation Items

```tsx
const DynamicNavigation = () => {
  const user = useStore((state) => state.user);
  const hasPermission = useHasPermission(PERMISSIONS.USER_READ);

  const navigationItems = [
    {
      label: 'Home',
      path: '/home',
      visible: true,
    },
    {
      label: 'Users',
      path: '/users',
      visible: hasPermission,
    },
    {
      label: 'Admin',
      path: '/admin',
      visible: user?.roles?.some((role) => role.name === 'admin'),
    },
  ].filter((item) => item.visible);

  return (
    <nav>
      {navigationItems.map((item) => (
        <Link key={item.path} to={item.path}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
```

## Error Handling

### 1. Route-level Error Handling

```tsx
import { PermissionErrorBoundary } from './routes/middleWare';

const AppWithErrorHandling = () => (
  <PermissionErrorBoundary fallback={<div>Permission error occurred</div>}>
    <BrowserRouter>
      <Routes>
        <Route
          path="/protected"
          element={
            <PermissionMiddleware
              requiredPermissions={[PERMISSIONS.USER_READ]}
              onError={(error) => console.error('Permission error:', error)}
            >
              <ProtectedComponent />
            </PermissionMiddleware>
          }
        />
      </Routes>
    </BrowserRouter>
  </PermissionErrorBoundary>
);
```

### 2. Global Error Handling

```tsx
const GlobalErrorHandler = ({ children }) => (
  <PermissionErrorBoundary
    fallback={({ error, resetError }) => (
      <div>
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
        <button onClick={resetError}>Try again</button>
      </div>
    )}
  >
    {children}
  </PermissionErrorBoundary>
);
```

## Advanced Examples

### 1. Nested Routes with Different Permissions

```tsx
const NestedRouteExample = () => (
  <Routes>
    <Route path="/admin" element={<AdminLayout />}>
      <Route
        path="dashboard"
        element={
          <PermissionMiddleware
            requiredPermissions={[PERMISSIONS.DASHBOARD_READ]}
            requiredRoles={[ROLES.ADMIN]}
          >
            <AdminDashboard />
          </PermissionMiddleware>
        }
      />
      <Route
        path="users"
        element={
          <PermissionMiddleware
            requiredPermissions={[PERMISSIONS.USER_READ]}
            requiredRoles={[ROLES.ADMIN]}
          >
            <AdminUsers />
          </PermissionMiddleware>
        }
      />
      <Route
        path="system"
        element={
          <PermissionMiddleware requiredRoles={[ROLES.SUPER_ADMIN]}>
            <SystemSettings />
          </PermissionMiddleware>
        }
      />
    </Route>
  </Routes>
);
```

### 2. Conditional Route Rendering

```tsx
const ConditionalRoutes = () => {
  const user = useStore((state) => state.user);
  const isAdmin = user?.roles?.some((role) => role.name === 'admin');

  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      {isAdmin && <Route path="/admin" element={<AdminPage />} />}
    </Routes>
  );
};
```

### 3. Route Guards with Redirects

```tsx
import { RouteGuard } from './routes/RouteGuard';

const ProtectedRoute = ({ children }) => (
  <RouteGuard
    requiredPermissions={[PERMISSIONS.USER_READ]}
    requiredRoles={[ROLES.ADMIN]}
    redirectTo="/unauthorized"
    fallbackComponent={<div>Access Denied</div>}
  >
    {children}
  </RouteGuard>
);
```

### 4. Dynamic Route Generation

```tsx
const generateRoutes = (userPermissions, userRoles) => {
  const baseRoutes = [
    { path: '/home', component: HomePage, permissions: [] },
    { path: '/dashboard', component: DashboardPage, permissions: [PERMISSIONS.DASHBOARD_READ] },
    {
      path: '/users',
      component: UsersPage,
      permissions: [PERMISSIONS.USER_READ],
      roles: [ROLES.ADMIN],
    },
  ];

  return baseRoutes.filter((route) => {
    // Check permissions
    if (route.permissions.length > 0) {
      const hasPermission = route.permissions.some((permission) =>
        userPermissions.includes(permission)
      );
      if (!hasPermission) return false;
    }

    // Check roles
    if (route.roles && route.roles.length > 0) {
      const hasRole = route.roles.some((role) => userRoles.includes(role));
      if (!hasRole) return false;
    }

    return true;
  });
};
```

### 5. Route-based Permission Checking

```tsx
import { canAccessRoute, getAccessibleRoutes } from './routes/routesObject';

const NavigationWithRouteChecking = () => {
  const user = useStore((state) => state.user);
  const userPermissions = user?.permissions?.map((p) => p.name) || [];
  const userRoles = user?.roles?.map((r) => r.name) || [];

  const accessibleRoutes = getAccessibleRoutes(userPermissions, userRoles);

  return (
    <nav>
      {accessibleRoutes.map((route) => (
        <Link key={route.path} to={route.path}>
          {route.label}
        </Link>
      ))}
    </nav>
  );
};
```

## Best Practices

1. **Always use lazy loading** for better performance
2. **Implement proper error boundaries** for route-level errors
3. **Use permission middleware** consistently across all protected routes
4. **Cache permission checks** to avoid repeated calculations
5. **Implement fallback components** for better UX
6. **Use route guards** for additional security
7. **Test permission logic** thoroughly with different user roles
8. **Never rely solely on frontend** permission checks for security

## Troubleshooting

### Common Issues

1. **Routes not loading**: Check if components are properly lazy loaded
2. **Permission denied**: Verify user permissions and roles in store
3. **Navigation not updating**: Ensure store is properly connected
4. **Layout issues**: Check if layout components are properly structured
5. **Error boundaries not catching**: Verify error boundary placement

### Debug Tips

1. Use React DevTools to inspect component state
2. Add console logs to permission checks
3. Check browser network tab for failed requests
4. Verify route paths match exactly
5. Test with different user roles and permissions
