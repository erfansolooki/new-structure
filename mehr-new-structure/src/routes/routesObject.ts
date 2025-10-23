import { lazy } from 'react';
import { PERMISSIONS, ROLES } from './middleWare';

// Route types and interfaces
export interface RouteConfig {
  path: string;
  element?: React.LazyExoticComponent<React.ComponentType<any>> | React.ReactNode;
  children?: RouteConfig[];
  permissions?: string[];
  roles?: string[];
  guards?: string[];
  requireAll?: boolean;
  layout?: React.ComponentType<any>;
  isProtected?: boolean;
  isPublic?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
  onPermissionDenied?: () => void;
  onError?: (error: Error) => void;
}

export interface LayoutRouteConfig extends RouteConfig {
  layout: React.ComponentType<any>;
  children: RouteConfig[];
}

// Route configuration object
export const routesConfig: RouteConfig[] = [
  // Public routes (no authentication required)
  {
    path: '/',
    children: [
      {
        path: 'login',
        element: lazy(() => import('../pages/auth/Login')),
      },
      {
        path: 'register',
        element: lazy(() => import('../pages/auth/Register')),
      },
    ],
  },

  // Protected routes (authentication required)
  {
    path: '/',
    children: [
      // Home page - basic user access
      {
        path: 'home',
        element: lazy(() => import('../pages/home/view')),
      },

      // Dashboard - admin/manager access
      {
        path: 'dashboard',
        element: lazy(() => import('../pages/dashboard/view')),
      },

      // User management - admin only
      {
        path: 'users',
        element: lazy(() => import('../pages/users/view')),
      },

      // Settings - user access
      {
        path: 'settings',
        element: lazy(() => import('../pages/settings/view')),
      },
    ],
  },

  // Error pages
  {
    path: '/401',
    element: lazy(() => import('../pages/Unauthorized')),
  },
  {
    path: '/404',
    element: lazy(() => import('../pages/NotFound')),
  },

  // Catch all route
  {
    path: '*',
    element: lazy(() => import('../pages/NotFound')),
  },
];

// Route helper functions
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  const findRoute = (routes: RouteConfig[], targetPath: string): RouteConfig | undefined => {
    for (const route of routes) {
      if (route.path === targetPath) {
        return route;
      }
      if (route.children) {
        const found = findRoute(route.children, targetPath);
        if (found) return found;
      }
    }
    return undefined;
  };

  return findRoute(routesConfig, path);
};

export const getProtectedRoutes = (): RouteConfig[] =>
  routesConfig.filter((route) => route.isProtected && !route.isPublic);

export const getPublicRoutes = (): RouteConfig[] => routesConfig.filter((route) => route.isPublic);

export const getRoutesByPermission = (permission: string): RouteConfig[] => {
  const findRoutesByPermission = (
    routes: RouteConfig[],
    targetPermission: string
  ): RouteConfig[] => {
    const matchingRoutes: RouteConfig[] = [];

    for (const route of routes) {
      if (route.permissions?.includes(targetPermission)) {
        matchingRoutes.push(route);
      }
      if (route.children) {
        matchingRoutes.push(...findRoutesByPermission(route.children, targetPermission));
      }
    }

    return matchingRoutes;
  };

  return findRoutesByPermission(routesConfig, permission);
};

export const getRoutesByRole = (role: string): RouteConfig[] => {
  const findRoutesByRole = (routes: RouteConfig[], targetRole: string): RouteConfig[] => {
    const matchingRoutes: RouteConfig[] = [];

    for (const route of routes) {
      if (route.roles?.includes(targetRole)) {
        matchingRoutes.push(route);
      }
      if (route.children) {
        matchingRoutes.push(...findRoutesByRole(route.children, targetRole));
      }
    }

    return matchingRoutes;
  };

  return findRoutesByRole(routesConfig, role);
};

// Navigation helpers
export const canAccessRoute = (
  path: string,
  userPermissions: string[],
  userRoles: string[]
): boolean => {
  const route = getRouteByPath(path);
  if (!route) return false;

  // Check if route is public
  if (route.isPublic) return true;

  // Check permissions
  if (route.permissions && route.permissions.length > 0) {
    const hasPermission = route.requireAll
      ? route.permissions.every((permission) => userPermissions.includes(permission))
      : route.permissions.some((permission) => userPermissions.includes(permission));

    if (!hasPermission) return false;
  }

  // Check roles
  if (route.roles && route.roles.length > 0) {
    const hasRole = route.requireAll
      ? route.roles.every((role) => userRoles.includes(role))
      : route.roles.some((role) => userRoles.includes(role));

    if (!hasRole) return false;
  }

  return true;
};

export const getAccessibleRoutes = (
  userPermissions: string[],
  userRoles: string[]
): RouteConfig[] => {
  const accessibleRoutes: RouteConfig[] = [];

  const checkRouteAccess = (routes: RouteConfig[]) => {
    for (const route of routes) {
      if (canAccessRoute(route.path || '', userPermissions, userRoles)) {
        accessibleRoutes.push(route);
      }
      if (route.children) {
        checkRouteAccess(route.children);
      }
    }
  };

  checkRouteAccess(routesConfig);
  return accessibleRoutes;
};

// Route constants
export const ROUTE_PATHS = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',

  // Protected routes
  HOME: '/home',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  SETTINGS: '/settings',

  // Error routes
  UNAUTHORIZED: '/401',
  NOT_FOUND: '/404',
} as const;

export const ROUTE_PERMISSIONS = {
  [ROUTE_PATHS.HOME]: [PERMISSIONS.DASHBOARD_READ],
  [ROUTE_PATHS.DASHBOARD]: [PERMISSIONS.DASHBOARD_READ],
  [ROUTE_PATHS.USERS]: [PERMISSIONS.USER_READ],
  [ROUTE_PATHS.SETTINGS]: [PERMISSIONS.SETTINGS_READ],
} as const;

export const ROUTE_ROLES = {
  [ROUTE_PATHS.DASHBOARD]: [ROLES.ADMIN, ROLES.MANAGER],
  [ROUTE_PATHS.USERS]: [ROLES.ADMIN],
} as const;

export default routesConfig;
