import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../helpers/feature/store';
import { usePermissionCheck } from './middleWare';
import { ROUTE_PATHS } from './routesObject';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requiredGuards?: string[];
  requireAll?: boolean;
  redirectTo?: string;
  fallbackComponent?: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  requiredGuards = [],
  requireAll = false,
  redirectTo = ROUTE_PATHS.UNAUTHORIZED,
  fallbackComponent = <div>Access Denied</div>,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useStore((state: any) => state.isAuthenticated);
  const user = useStore((state: any) => state.user);

  // Check permissions
  const permissionCheck = usePermissionCheck({
    requiredPermissions,
    requiredRoles,
    requiredGuardNames: requiredGuards,
    requireAll,
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    // Check if user has required permissions
    if (requiredPermissions.length > 0 || requiredRoles.length > 0 || requiredGuards.length > 0) {
      if (!permissionCheck.hasPermission) {
        navigate(redirectTo, { replace: true });
        return;
      }
    }
  }, [
    isAuthenticated,
    permissionCheck.hasPermission,
    navigate,
    location.pathname,
    redirectTo,
    requiredPermissions,
    requiredRoles,
    requiredGuards,
  ]);

  // Show loading while checking permissions
  if (!isAuthenticated) {
    return (
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
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p>Checking authentication...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show fallback if permissions are not met
  if (requiredPermissions.length > 0 || requiredRoles.length > 0 || requiredGuards.length > 0) {
    if (!permissionCheck.hasPermission) {
      return <>{fallbackComponent}</>;
    }
  }

  return <>{children}</>;
};

export default RouteGuard;
