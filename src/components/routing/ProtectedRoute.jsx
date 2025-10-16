import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

// Unified Protected Route Component - Handles authentication and role-based access
export function ProtectedRoute({ children, auth = true, roles = [] }) {
  const { isAuthenticated, isAuthLoading, getPrimaryRole } = useAuth();
  const primaryRole = getPrimaryRole();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-2xl font-bold mt-4">Loading...</h2>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (auth && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If authentication is not required but user is authenticated, allow access
  if (!auth && isAuthenticated) {
    return children;
  }

  // If authentication is required and user is authenticated, check roles
  if (
    auth &&
    isAuthenticated &&
    roles.length > 0 &&
    !roles.includes(primaryRole)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
