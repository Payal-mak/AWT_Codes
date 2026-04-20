import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute — renders children (via <Outlet />) only if the user is
 * authenticated. Otherwise redirects to /login, preserving the intended URL.
 *
 * Optional `requiredRole` prop: 'librarian' | 'student'
 * — if provided, also checks that the user's role matches.
 */
export default function ProtectedRoute({ requiredRole } = {}) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // User is authenticated but doesn't have the required role
    return <Navigate to="/books" replace />;
  }

  return <Outlet />;
}
