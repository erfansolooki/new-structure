import React from 'react';
import {
  PermissionMiddleware,
  withPermission,
  useHasPermission,
  useHasRole,
  useHasAnyPermission,
  usePermissionCheck,
  PermissionErrorBoundary,
  PERMISSIONS,
  ROLES,
  GUARDS,
} from './middleWare';

// Example 1: Basic Permission Middleware Usage
export const BasicPermissionExample: React.FC = () => {
  return (
    <PermissionMiddleware
      requiredPermissions={[PERMISSIONS.USER_READ]}
      fallbackComponent={<div>You don't have permission to view this content</div>}
    >
      <div>This content is only visible to users with USER_READ permission</div>
    </PermissionMiddleware>
  );
};

// Example 2: Role-based Access Control
export const RoleBasedExample: React.FC = () => {
  return (
    <PermissionMiddleware
      requiredRoles={[ROLES.ADMIN, ROLES.MANAGER]}
      fallbackComponent={<div>Admin or Manager access required</div>}
    >
      <div>Admin/Manager only content</div>
    </PermissionMiddleware>
  );
};

// Example 3: Multiple Permission Requirements (ALL required)
export const MultiplePermissionsExample: React.FC = () => {
  return (
    <PermissionMiddleware
      requiredPermissions={[PERMISSIONS.USER_CREATE, PERMISSIONS.USER_UPDATE]}
      requireAll={true}
      fallbackComponent={<div>You need both CREATE and UPDATE permissions</div>}
    >
      <div>Content requiring both CREATE and UPDATE permissions</div>
    </PermissionMiddleware>
  );
};

// Example 4: Guard-based Access Control
export const GuardBasedExample: React.FC = () => {
  return (
    <PermissionMiddleware
      requiredGuardNames={[GUARDS.WEB]}
      fallbackComponent={<div>Web access required</div>}
    >
      <div>Web-only content</div>
    </PermissionMiddleware>
  );
};

// Example 5: Using Hooks for Conditional Rendering
export const HookBasedExample: React.FC = () => {
  const hasUserRead = useHasPermission(PERMISSIONS.USER_READ);
  const hasAdminRole = useHasRole(ROLES.ADMIN);
  const hasAnyPermission = useHasAnyPermission([PERMISSIONS.USER_CREATE, PERMISSIONS.USER_UPDATE]);

  return (
    <div>
      {hasUserRead && <div>User read permission content</div>}
      {hasAdminRole && <div>Admin only content</div>}
      {hasAnyPermission && <div>User management content</div>}
    </div>
  );
};

// Example 6: Complex Permission Check
export const ComplexPermissionExample: React.FC = () => {
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
};

// Example 7: Higher-Order Component Usage
const AdminOnlyComponent: React.FC = () => {
  return <div>This component is only for admins</div>;
};

export const AdminOnlyComponentWithPermission = withPermission(AdminOnlyComponent, {
  requiredRoles: [ROLES.ADMIN],
  fallbackComponent: <div>Admin access required</div>,
});

// Example 8: Error Handling
export const ErrorHandlingExample: React.FC = () => {
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
};

// Example 9: Custom Fallback Component
const CustomFallback: React.FC = () => (
  <div style={{ padding: '20px', border: '1px solid red', borderRadius: '4px' }}>
    <h3>Access Denied</h3>
    <p>You don't have the required permissions to access this content.</p>
    <button onClick={() => (window.location.href = '/login')}>Go to Login</button>
  </div>
);

export const CustomFallbackExample: React.FC = () => {
  return (
    <PermissionMiddleware
      requiredPermissions={[PERMISSIONS.USER_READ]}
      fallbackComponent={<CustomFallback />}
    >
      <div>Content with custom fallback</div>
    </PermissionMiddleware>
  );
};

// Example 10: Dynamic Permission Checking
export const DynamicPermissionExample: React.FC<{ permission: string }> = ({ permission }) => {
  const hasPermission = useHasPermission(permission);

  return (
    <div>
      {hasPermission ? (
        <div>You have the {permission} permission</div>
      ) : (
        <div>You don't have the {permission} permission</div>
      )}
    </div>
  );
};

// Example 11: Permission-based Button Rendering
export const PermissionBasedButton: React.FC = () => {
  const canCreate = useHasPermission(PERMISSIONS.USER_CREATE);
  const canUpdate = useHasPermission(PERMISSIONS.USER_UPDATE);
  const canDelete = useHasPermission(PERMISSIONS.USER_DELETE);

  return (
    <div>
      {canCreate && <button>Create User</button>}
      {canUpdate && <button>Update User</button>}
      {canDelete && <button>Delete User</button>}
    </div>
  );
};

// Example 12: Navigation Menu with Permissions
export const NavigationMenu: React.FC = () => {
  const hasDashboardAccess = useHasPermission(PERMISSIONS.DASHBOARD_READ);
  const hasUserManagement = useHasAnyPermission([PERMISSIONS.USER_CREATE, PERMISSIONS.USER_READ]);
  const hasReportAccess = useHasPermission(PERMISSIONS.REPORT_READ);
  const isAdmin = useHasRole(ROLES.ADMIN);

  return (
    <nav>
      <ul>
        {hasDashboardAccess && (
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
        )}
        {hasUserManagement && (
          <li>
            <a href="/users">Users</a>
          </li>
        )}
        {hasReportAccess && (
          <li>
            <a href="/reports">Reports</a>
          </li>
        )}
        {isAdmin && (
          <li>
            <a href="/admin">Admin Panel</a>
          </li>
        )}
      </ul>
    </nav>
  );
};
