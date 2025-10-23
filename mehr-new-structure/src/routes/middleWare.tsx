import React, { useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useStore } from '../helpers/feature/store';
import type { Permission, User, Role } from '../lib/api/models';

// Permission middleware types
export interface PermissionMiddlewareProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requiredGuardNames?: string[];
  fallbackComponent?: ReactNode;
  onPermissionDenied?: () => void;
  onError?: (error: Error) => void;
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user needs ANY permission
  showErrorBoundary?: boolean; // Whether to show error boundary for permission errors
}

export interface PermissionCheckResult {
  hasPermission: boolean;
  missingPermissions: string[];
  missingRoles: string[];
  userPermissions: string[];
  userRoles: string[];
  error?: Error;
}

// Error classes for permission-related errors
export class PermissionError extends Error {
  public missingPermissions: string[];
  public missingRoles: string[];

  constructor(message: string, missingPermissions: string[] = [], missingRoles: string[] = []) {
    super(message);
    this.name = 'PermissionError';
    this.missingPermissions = missingPermissions;
    this.missingRoles = missingRoles;
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'User is not authenticated') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Permission cache for optimization
interface PermissionCache {
  [key: string]: boolean;
}

// Permission checking utilities
export class PermissionChecker {
  private user: User | null;
  private permissions: Permission[];
  private roles: Role[];
  private permissionCache: PermissionCache = {};
  private roleCache: PermissionCache = {};
  private guardCache: PermissionCache = {};

  constructor(user: User | null) {
    this.user = user;
    this.permissions = user?.permissions || [];
    this.roles = user?.roles || [];
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.permissionCache = {};
    this.roleCache = {};
    this.guardCache = {};
  }

  /**
   * Get cached permission result or compute and cache it
   */
  private getCachedPermission(permissionName: string): boolean {
    if (this.permissionCache[permissionName] === undefined) {
      this.permissionCache[permissionName] = this.permissions.some(
        (permission) => permission.name === permissionName
      );
    }
    return this.permissionCache[permissionName];
  }

  /**
   * Get cached role result or compute and cache it
   */
  private getCachedRole(roleName: string): boolean {
    if (this.roleCache[roleName] === undefined) {
      this.roleCache[roleName] = this.roles.some((role) => role.name === roleName);
    }
    return this.roleCache[roleName];
  }

  /**
   * Get cached guard result or compute and cache it
   */
  private getCachedGuard(guardName: string): boolean {
    if (this.guardCache[guardName] === undefined) {
      this.guardCache[guardName] = this.permissions.some(
        (permission) => permission.guardName === guardName
      );
    }
    return this.guardCache[guardName];
  }

  /**
   * Check if user has specific permission by name
   */
  hasPermission(permissionName: string): boolean {
    return this.getCachedPermission(permissionName);
  }

  /**
   * Check if user has specific permission by guard name
   */
  hasPermissionByGuard(guardName: string): boolean {
    return this.getCachedGuard(guardName);
  }

  /**
   * Check if user has specific role
   */
  hasRole(roleName: string): boolean {
    return this.getCachedRole(roleName);
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(roles: string[]): boolean {
    return roles.every((role) => this.hasRole(role));
  }

  /**
   * Check if user has any of the specified guard names
   */
  hasAnyGuard(guardNames: string[]): boolean {
    return guardNames.some((guard) => this.hasPermissionByGuard(guard));
  }

  /**
   * Check if user has all of the specified guard names
   */
  hasAllGuards(guardNames: string[]): boolean {
    return guardNames.every((guard) => this.hasPermissionByGuard(guard));
  }

  /**
   * Comprehensive permission check with error handling
   */
  checkPermissions(options: {
    requiredPermissions?: string[];
    requiredRoles?: string[];
    requiredGuardNames?: string[];
    requireAll?: boolean;
  }): PermissionCheckResult {
    try {
      const {
        requiredPermissions = [],
        requiredRoles = [],
        requiredGuardNames = [],
        requireAll = false,
      } = options;

      // Check if user is authenticated
      if (!this.isAuthenticated()) {
        throw new AuthenticationError('User is not authenticated');
      }

      const userPermissions = this.permissions.map((p) => p.name);
      const userRoles = this.roles.map((r) => r.name);

      let hasPermission = true;
      const missingPermissions: string[] = [];
      const missingRoles: string[] = [];

      // Check permissions
      if (requiredPermissions.length > 0) {
        const hasRequiredPermissions = requireAll
          ? this.hasAllPermissions(requiredPermissions)
          : this.hasAnyPermission(requiredPermissions);

        if (!hasRequiredPermissions) {
          hasPermission = false;
          missingPermissions.push(...requiredPermissions.filter((p) => !this.hasPermission(p)));
        }
      }

      // Check roles
      if (requiredRoles.length > 0) {
        const hasRequiredRoles = requireAll
          ? this.hasAllRoles(requiredRoles)
          : this.hasAnyRole(requiredRoles);

        if (!hasRequiredRoles) {
          hasPermission = false;
          missingRoles.push(...requiredRoles.filter((r) => !this.hasRole(r)));
        }
      }

      // Check guard names
      if (requiredGuardNames.length > 0) {
        const hasRequiredGuards = requireAll
          ? this.hasAllGuards(requiredGuardNames)
          : this.hasAnyGuard(requiredGuardNames);

        if (!hasRequiredGuards) {
          hasPermission = false;
          // Add guard names to missing permissions for simplicity
          missingPermissions.push(
            ...requiredGuardNames.filter((g) => !this.hasPermissionByGuard(g))
          );
        }
      }

      return {
        hasPermission,
        missingPermissions,
        missingRoles,
        userPermissions,
        userRoles,
      };
    } catch (error) {
      return {
        hasPermission: false,
        missingPermissions: [],
        missingRoles: [],
        userPermissions: [],
        userRoles: [],
        error: error instanceof Error ? error : new Error('Unknown permission check error'),
      };
    }
  }

  /**
   * Get all user permissions
   */
  getUserPermissions(): Permission[] {
    return this.permissions;
  }

  /**
   * Get all user roles
   */
  getUserRoles(): Role[] {
    return this.roles;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.user;
  }
}

// Permission middleware component
export const PermissionMiddleware: React.FC<PermissionMiddlewareProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  requiredGuardNames = [],
  fallbackComponent = <div>Access Denied</div>,
  onPermissionDenied,
  onError,
  requireAll = false,
  showErrorBoundary = true,
}) => {
  const user = useStore((state: any) => state.user);
  const isAuthenticated = useStore((state: any) => state.isAuthenticated);

  // Memoize permission checker to avoid recreating on every render
  const permissionChecker = useMemo(() => new PermissionChecker(user), [user]);

  // Memoize permission check result
  const checkResult = useMemo(() => {
    if (!isAuthenticated || !user) {
      return {
        hasPermission: false,
        missingPermissions: [],
        missingRoles: [],
        userPermissions: [],
        userRoles: [],
      };
    }

    return permissionChecker.checkPermissions({
      requiredPermissions,
      requiredRoles,
      requiredGuardNames,
      requireAll,
    });
  }, [
    permissionChecker,
    requiredPermissions,
    requiredRoles,
    requiredGuardNames,
    requireAll,
    isAuthenticated,
    user,
  ]);

  // Memoize permission denied callback
  const handlePermissionDenied = useCallback(() => {
    if (onPermissionDenied) {
      onPermissionDenied();
    }
  }, [onPermissionDenied]);

  // Memoize error handler
  const handleError = useCallback(
    (error: Error) => {
      if (onError) {
        onError(error);
      }
      console.error('Permission middleware error:', error);
    },
    [onError]
  );

  // Handle errors from permission check
  if (checkResult.error) {
    handleError(checkResult.error);
    if (showErrorBoundary) {
      return <div>Error: {checkResult.error.message}</div>;
    }
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <>{fallbackComponent}</>;
  }

  // If permission is denied, show fallback or call callback
  if (!checkResult.hasPermission) {
    handlePermissionDenied();
    return <>{fallbackComponent}</>;
  }

  // If all checks pass, render children
  return <>{children}</>;
};

// Higher-order component for permission checking
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  permissionOptions: Omit<PermissionMiddlewareProps, 'children'>
) => {
  return (props: P) => (
    <PermissionMiddleware {...permissionOptions}>
      <Component {...props} />
    </PermissionMiddleware>
  );
};

// Permission hooks for easy usage
export const usePermissionChecker = () => {
  const user = useStore((state: any) => state.user);
  return useMemo(() => new PermissionChecker(user), [user]);
};

export const useHasPermission = (permissionName: string): boolean => {
  const user = useStore((state: any) => state.user);
  const checker = useMemo(() => new PermissionChecker(user), [user]);
  return useMemo(() => checker.hasPermission(permissionName), [checker, permissionName]);
};

export const useHasRole = (roleName: string): boolean => {
  const user = useStore((state: any) => state.user);
  const checker = useMemo(() => new PermissionChecker(user), [user]);
  return useMemo(() => checker.hasRole(roleName), [checker, roleName]);
};

export const useHasAnyPermission = (permissions: string[]): boolean => {
  const user = useStore((state: any) => state.user);
  const checker = useMemo(() => new PermissionChecker(user), [user]);
  return useMemo(() => checker.hasAnyPermission(permissions), [checker, permissions]);
};

export const useHasAllPermissions = (permissions: string[]): boolean => {
  const user = useStore((state: any) => state.user);
  const checker = useMemo(() => new PermissionChecker(user), [user]);
  return useMemo(() => checker.hasAllPermissions(permissions), [checker, permissions]);
};

export const useHasAnyRole = (roles: string[]): boolean => {
  const user = useStore((state: any) => state.user);
  const checker = useMemo(() => new PermissionChecker(user), [user]);
  return useMemo(() => checker.hasAnyRole(roles), [checker, roles]);
};

export const useHasAllRoles = (roles: string[]): boolean => {
  const user = useStore((state: any) => state.user);
  const checker = useMemo(() => new PermissionChecker(user), [user]);
  return useMemo(() => checker.hasAllRoles(roles), [checker, roles]);
};

export const usePermissionCheck = (options: {
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requiredGuardNames?: string[];
  requireAll?: boolean;
}): PermissionCheckResult => {
  const user = useStore((state: any) => state.user);
  const checker = useMemo(() => new PermissionChecker(user), [user]);
  return useMemo(() => checker.checkPermissions(options), [checker, options]);
};

// Utility functions for permission checking outside of components
export const createPermissionChecker = (user: User | null) => {
  return new PermissionChecker(user);
};

// Error boundary component for permission errors
export class PermissionErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Permission error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong with permissions.</div>;
    }

    return this.props.children;
  }
}

// Utility function to check permissions synchronously
export const checkUserPermissions = (
  user: User | null,
  options: {
    requiredPermissions?: string[];
    requiredRoles?: string[];
    requiredGuardNames?: string[];
    requireAll?: boolean;
  }
): PermissionCheckResult => {
  const checker = new PermissionChecker(user);
  return checker.checkPermissions(options);
};

// Utility function to validate permission structure
export const validatePermissionStructure = (permission: Permission): boolean => {
  return !!(
    permission &&
    permission.name &&
    permission.title &&
    permission.guardName &&
    permission.categoryName
  );
};

// Utility function to get permission by name
export const getPermissionByName = (
  permissions: Permission[],
  name: string
): Permission | undefined => {
  return permissions.find((permission) => permission.name === name);
};

// Utility function to get permissions by category
export const getPermissionsByCategory = (
  permissions: Permission[],
  categoryName: string
): Permission[] => {
  return permissions.filter((permission) => permission.categoryName === categoryName);
};

// Permission constants for common operations
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

// Role constants
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  GUEST: 'guest',
} as const;

// Guard name constants
export const GUARDS = {
  WEB: 'web',
  API: 'api',
  SANCTUM: 'sanctum',
} as const;

export default PermissionMiddleware;
