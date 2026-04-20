import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './shared/components/ProtectedRoute';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import BookListPage from './features/books/BookListPage';
import LibrarianUserList from './features/users/LibrarianUserList';
import StudentDashboard from './features/dashboard/StudentDashboard';
import TransactionPage from './features/transactions/TransactionPage';
import ReportDashboard from './features/reports/ReportDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/books" element={<BookListPage />} />
            <Route path="/users" element={<LibrarianUserList />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/reports" element={<ReportDashboard />} />
          </Route>

          {/* Fallback — redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
