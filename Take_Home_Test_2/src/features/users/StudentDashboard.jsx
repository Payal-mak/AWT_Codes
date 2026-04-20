import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import transactionService from '../../services/transactionService';
import { calculateFine, formatDate, getOverdueDays } from '../transactions/useTransaction';
import RenewBookForm from '../transactions/RenewBookForm';
import { AlertBanner } from '../../shared/components/FormComponents';

/** Status badge with colour coding */
function StatusBadge({ status }) {
  const map = {
    active: 'bg-blue-50 text-blue-700 border-blue-200',
    overdue: 'bg-red-50 text-red-700 border-red-200',
    returned: 'bg-green-50 text-green-700 border-green-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${map[status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  );
}

/** Summary stat card */
function StatCard({ label, value, sub, accent }) {
  const accents = {
    indigo: 'border-indigo-200 bg-indigo-50',
    red: 'border-red-200 bg-red-50',
    green: 'border-green-200 bg-green-50',
  };
  return (
    <div className={`rounded-xl border p-4 ${accents[accent] ?? 'border-gray-200 bg-white'}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

/**
 * StudentDashboard — /dashboard (student route)
 * Shows: summary stats, active borrows table, overdue warning, renew modal.
 */
export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renewTarget, setRenewTarget] = useState(null); // which transaction to renew

  const fetchMyBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionService.getMine();
      setTransactions(Array.isArray(data) ? data : data.transactions ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMyBooks(); }, [fetchMyBooks]);

  // Computed stats
  const active = transactions.filter((t) => t.status === 'active' || !t.returnDate);
  const overdue = active.filter((t) => getOverdueDays(t.dueDate) > 0);
  const totalFine = overdue.reduce((sum, t) => sum + calculateFine(t.dueDate), 0);
  const returned = transactions.filter((t) => t.status === 'returned' || t.returnDate);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-base font-bold text-gray-900">LibraryMS</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-medium text-gray-800">{user?.name}</span>
              <span className="text-xs text-gray-400">Student</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {user?.name?.[0]?.toUpperCase() ?? 'S'}
            </div>
            <button id="student-logout" onClick={logout}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-500">Track your borrowed books and due dates</p>
        </div>

        {/* Stats row */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard label="Currently Borrowed" value={active.length} sub="active books" accent="indigo" />
          <StatCard label="Overdue Books" value={overdue.length} sub={totalFine > 0 ? `₹${totalFine} fine` : 'no fine'} accent={overdue.length > 0 ? 'red' : 'green'} />
          <StatCard label="Total Returned" value={returned.length} sub="all time" accent="green" />
        </div>

        {/* Global overdue warning */}
        {overdue.length > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <p className="text-sm font-semibold text-amber-800">
                {overdue.length} book{overdue.length !== 1 ? 's' : ''} overdue
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Total outstanding fine: <strong>₹{totalFine}</strong>. Please return or renew overdue books.
              </p>
            </div>
          </div>
        )}

        <AlertBanner message={error} />

        {/* Renew side-panel */}
        {renewTarget && (
          <div className="mb-6">
            <RenewBookForm
              transaction={renewTarget}
              onSuccess={() => { setRenewTarget(null); fetchMyBooks(); }}
              onCancel={() => setRenewTarget(null)}
            />
          </div>
        )}

        {/* Transactions table */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-800">My Transactions</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="mb-3 h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-sm font-medium text-gray-500">No transactions yet</p>
              <p className="text-xs text-gray-400">Visit the library to borrow books.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Book</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Issued</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Fine</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((t) => {
                    const isActive = !t.returnDate && t.status !== 'returned';
                    const fine = isActive ? calculateFine(t.dueDate) : (t.fine ?? 0);
                    const overdueDays = isActive ? getOverdueDays(t.dueDate) : 0;
                    const status = t.status ?? (t.returnDate ? 'returned' : overdueDays > 0 ? 'overdue' : 'active');
                    return (
                      <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-gray-900">
                          {t.book?.title ?? t.bookId ?? '—'}
                          {t.book?.author && <p className="text-xs font-normal text-gray-400">{t.book.author}</p>}
                        </td>
                        <td className="px-4 py-3.5 text-gray-500">{formatDate(t.issueDate)}</td>
                        <td className={`px-4 py-3.5 font-medium ${overdueDays > 0 ? 'text-red-600' : 'text-gray-700'}`}>
                          {formatDate(t.dueDate)}
                          {overdueDays > 0 && <p className="text-xs font-normal text-red-400">{overdueDays}d overdue</p>}
                        </td>
                        <td className="px-4 py-3.5">
                          {fine > 0
                            ? <span className="font-semibold text-red-600">₹{fine}</span>
                            : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-3.5"><StatusBadge status={status} /></td>
                        <td className="px-4 py-3.5">
                          {isActive && (
                            <button
                              id={`renew-btn-${t._id}`}
                              onClick={() => setRenewTarget(renewTarget?._id === t._id ? null : t)}
                              className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                            >
                              Renew
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
