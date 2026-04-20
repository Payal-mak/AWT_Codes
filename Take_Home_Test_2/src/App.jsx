import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './shared/components/ProtectedRoute';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import BookListPage from './features/books/BookListPage';
import StudentDashboard from './features/users/StudentDashboard';
import LibrarianUserList from './features/users/LibrarianUserList';
import ReportDashboard from './features/reports/ReportDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public routes ──────────────────────────────────── */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Protected: any authenticated user ─────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/books" element={<BookListPage />} />
          </Route>

          {/* ── Protected: student only ────────────────────────── */}
          <Route element={<ProtectedRoute requiredRole="student" />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
          </Route>

          {/* ── Protected: librarian only ──────────────────────── */}
          <Route element={<ProtectedRoute requiredRole="librarian" />}>
            <Route path="/librarian/users" element={<LibrarianUserList />} />
            <Route path="/reports"         element={<ReportDashboard />} />
          </Route>

          {/* ── Fallback ───────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
