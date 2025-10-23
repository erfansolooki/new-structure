# Permission Middleware

A comprehensive React middleware system for handling user permissions and role-based access control in your application.

## Features

- ✅ **Permission-based Access Control** - Check user permissions by name, guard, or category
- ✅ **Role-based Access Control** - Control access based on user roles
- ✅ **Flexible Permission Logic** - Support for "any" or "all" permission requirements
- ✅ **Performance Optimized** - Built-in caching and memoization for optimal performance
- ✅ **Error Handling** - Comprehensive error handling with custom error boundaries
- ✅ **React Hooks** - Easy-to-use hooks for permission checking in components
- ✅ **Higher-Order Components** - HOC support for wrapping components with permissions
- ✅ **TypeScript Support** - Full TypeScript support with type safety

## Installation

The middleware is already included in your project. Import it from the routes directory:

```typescript
import { PermissionMiddleware, useHasPermission } from '../routes/middleWare';
```

## Basic Usage

### 1. Permission Middleware Component

Wrap your components with permission requirements:

```tsx
import { PermissionMiddleware, PERMISSIONS } from '../routes/middleWare';

function MyComponent() {
  return (
    <PermissionMiddleware
      requiredPermissions={[PERMISSIONS.USER_READ]}
      fallbackComponent={<div>Access Denied</div>}
    >
      <div>This content requires USER_READ permission</div>
    </PermissionMiddleware>
  );
}
```

### 2. Using Hooks

Check permissions directly in your components:

```tsx
import { useHasPermission, useHasRole } from '../routes/middleWare';

function MyComponent() {
  const canReadUsers = useHasPermission('user.read');
  const isAdmin = useHasRole('admin');

  return (
    <div>
      {canReadUsers && <div>User content</div>}
      {isAdmin && <div>Admin content</div>}
    </div>
  );
}
```

### 3. Role-based Access

```tsx
import { PermissionMiddleware, ROLES } from '../routes/middleWare';

function AdminPanel() {
  return (
    <PermissionMiddleware
      requiredRoles={[ROLES.ADMIN, ROLES.MANAGER]}
      fallbackComponent={<div>Admin access required</div>}
    >
      <div>Admin panel content</div>
    </PermissionMiddleware>
  );
}
```

## API Reference

### PermissionMiddleware Props

| Prop                  | Type                     | Default                    | Description                                                                  |
| --------------------- | ------------------------ | -------------------------- | ---------------------------------------------------------------------------- |
| `children`            | `ReactNode`              | -                          | Content to render if permissions are granted                                 |
| `requiredPermissions` | `string[]`               | `[]`                       | Array of permission names required                                           |
| `requiredRoles`       | `string[]`               | `[]`                       | Array of role names required                                                 |
| `requiredGuardNames`  | `string[]`               | `[]`                       | Array of guard names required                                                |
| `fallbackComponent`   | `ReactNode`              | `<div>Access Denied</div>` | Component to render if access is denied                                      |
| `onPermissionDenied`  | `() => void`             | -                          | Callback when permission is denied                                           |
| `onError`             | `(error: Error) => void` | -                          | Callback when an error occurs                                                |
| `requireAll`          | `boolean`                | `false`                    | If true, user must have ALL permissions. If false, user needs ANY permission |
| `showErrorBoundary`   | `boolean`                | `true`                     | Whether to show error boundary for permission errors                         |

### Hooks

#### `useHasPermission(permissionName: string): boolean`

Check if user has a specific permission.

#### `useHasRole(roleName: string): boolean`

Check if user has a specific role.

#### `useHasAnyPermission(permissions: string[]): boolean`

Check if user has any of the specified permissions.

#### `useHasAllPermissions(permissions: string[]): boolean`

Check if user has all of the specified permissions.

#### `useHasAnyRole(roles: string[]): boolean`

Check if user has any of the specified roles.

#### `useHasAllRoles(roles: string[]): boolean`

Check if user has all of the specified roles.

#### `usePermissionCheck(options): PermissionCheckResult`

Comprehensive permission check with detailed results.

### Higher-Order Components

#### `withPermission(Component, permissionOptions)`

Wrap a component with permission requirements:

```tsx
const AdminOnlyComponent = withPermission(MyComponent, {
  requiredRoles: [ROLES.ADMIN],
  fallbackComponent: <div>Admin access required</div>,
});
```

## Permission Constants

### Predefined Permissions

```typescript
export const PERMISSIONS = {
  // User management
  USER_CREATE: 'user.create',
  USER_READ: 'user.read',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',

  // Role management
  ROLE_CREATE: 'role.create',
  ROLE_READ: 'role.read',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',

  // Permission management
  PERMISSION_CREATE: 'permission.create',
  PERMISSION_READ: 'permission.read',
  PERMISSION_UPDATE: 'permission.update',
  PERMISSION_DELETE: 'permission.delete',

  // Dashboard
  DASHBOARD_READ: 'dashboard.read',

  // Reports
  REPORT_READ: 'report.read',
  REPORT_EXPORT: 'report.export',

  // Settings
  SETTINGS_READ: 'settings.read',
  SETTINGS_UPDATE: 'settings.update',
} as const;
```

### Predefined Roles

```typescript
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  GUEST: 'guest',
} as const;
```

### Predefined Guards

```typescript
export const GUARDS = {
  WEB: 'web',
  API: 'api',
  SANCTUM: 'sanctum',
} as const;
```

## Advanced Usage

### Complex Permission Logic

```tsx
function ComplexComponent() {
  const permissionCheck = usePermissionCheck({
    requiredPermissions: [PERMISSIONS.USER_READ],
    requiredRoles: [ROLES.ADMIN],
    requireAll: false, // User needs either permission OR role
  });

  if (!permissionCheck.hasPermission) {
    return (
      <div>
        <h3>Access Denied</h3>
        <p>Missing permissions: {permissionCheck.missingPermissions.join(', ')}</p>
        <p>Missing roles: {permissionCheck.missingRoles.join(', ')}</p>
      </div>
    );
  }

  return <div>Complex permission content</div>;
}
```

### Error Handling

```tsx
import { PermissionErrorBoundary } from '../routes/middleWare';

function AppWithErrorHandling() {
  return (
    <PermissionErrorBoundary fallback={<div>Permission error occurred</div>}>
      <PermissionMiddleware
        requiredPermissions={[PERMISSIONS.USER_READ]}
        onError={(error) => console.error('Permission error:', error)}
        onPermissionDenied={() => console.log('Permission denied')}
      >
        <div>Content with error handling</div>
      </PermissionMiddleware>
    </PermissionErrorBoundary>
  );
}
```

### Custom Fallback Components

```tsx
const CustomFallback = () => (
  <div style={{ padding: '20px', border: '1px solid red', borderRadius: '4px' }}>
    <h3>Access Denied</h3>
    <p>You don't have the required permissions to access this content.</p>
    <button onClick={() => (window.location.href = '/login')}>Go to Login</button>
  </div>
);

function ComponentWithCustomFallback() {
  return (
    <PermissionMiddleware
      requiredPermissions={[PERMISSIONS.USER_READ]}
      fallbackComponent={<CustomFallback />}
    >
      <div>Content with custom fallback</div>
    </PermissionMiddleware>
  );
}
```

## Performance Optimization

The middleware includes several performance optimizations:

- **Caching**: Permission checks are cached to avoid repeated calculations
- **Memoization**: React hooks use memoization to prevent unnecessary re-renders
- **Lazy Evaluation**: Permission checks are only performed when needed

## Error Handling

The middleware provides comprehensive error handling:

- **PermissionError**: Thrown when permission checks fail
- **AuthenticationError**: Thrown when user is not authenticated
- **Error Boundaries**: React error boundaries for catching permission errors
- **Custom Error Handlers**: Callbacks for handling specific error scenarios

## TypeScript Support

The middleware is fully typed with TypeScript support:

```typescript
interface PermissionMiddlewareProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requiredGuardNames?: string[];
  fallbackComponent?: ReactNode;
  onPermissionDenied?: () => void;
  onError?: (error: Error) => void;
  requireAll?: boolean;
  showErrorBoundary?: boolean;
}
```

## Best Practices

1. **Use Constants**: Always use the predefined permission and role constants
2. **Error Handling**: Implement proper error handling for permission failures
3. **Performance**: Use memoization for expensive permission checks
4. **Security**: Never rely solely on frontend permission checks for security
5. **Testing**: Test permission logic thoroughly with different user roles

## Examples

See `middleWare.example.tsx` for comprehensive usage examples including:

- Basic permission checking
- Role-based access control
- Complex permission logic
- Error handling
- Custom fallback components
- Navigation menus with permissions
- Dynamic permission checking

## Contributing

When adding new features to the middleware:

1. Update the TypeScript interfaces
2. Add comprehensive error handling
3. Include performance optimizations
4. Update the documentation
5. Add usage examples
6. Test with different permission scenarios
