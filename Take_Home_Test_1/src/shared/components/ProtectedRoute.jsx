import { Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute — renders children (via <Outlet />) only if the user is
 * authenticated. Otherwise redirects to /login, preserving the intended URL.
 *
 * Optional `requiredRole` prop: 'librarian' | 'student'
 * — if provided, also checks that the user's role matches.
 */
export default function ProtectedRoute({ requiredRole } = {}) {
  const { isAuthenticated, role, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-stretch">
      <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-6">
          <Link to="/books" className="text-xl font-bold text-indigo-600 font-sans tracking-tight hover:text-indigo-800 transition-colors">LibraryApp</Link>
          <div className="hidden sm:flex gap-4">
            <Link to="/books" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Books</Link>
            {role === 'librarian' && (
              <>
                <Link to="/users" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Users</Link>
                <Link to="/transactions" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Transactions</Link>
                <Link to="/reports" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Reports</Link>
              </>
            )}
            {role === 'student' && (
              <Link to="/student-dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Dashboard</Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-gray-700 bg-gray-100 py-1.5 px-3 rounded-full flex gap-2 items-center">
             <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
             {user?.name || 'User'} ({role})
          </div>
          <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-800 hover:underline transition-all">Logout</button>
        </div>
      </nav>
      <div className="flex-1 w-full mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
