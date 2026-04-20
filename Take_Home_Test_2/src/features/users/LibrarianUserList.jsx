import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';
import transactionService from '../../services/transactionService';
import IssueBookForm from '../transactions/IssueBookForm';
import ReturnBookForm from '../transactions/ReturnBookForm';
import { Button, AlertBanner } from '../../shared/components/FormComponents';

/** Role badge */
function RoleBadge({ role }) {
  const styles = {
    librarian: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    student: 'bg-gray-50 text-gray-600 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${styles[role] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
      {role}
    </span>
  );
}

/** Status indicator */
function ActiveBadge({ active }) {
  return active ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />Inactive
    </span>
  );
}

/** Inline edit row for a user's role */
function EditUserRow({ user, onSave, onCancel }) {
  const [role, setRole] = useState(user.role);
  const [isActive, setIsActive] = useState(user.isActive ?? true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(user._id, { role, isActive });
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr className="bg-indigo-50/40">
      <td className="px-5 py-3 font-medium text-gray-900">{user.name}</td>
      <td className="px-4 py-3 text-gray-500">{user.email}</td>
      <td className="px-4 py-3">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-800
            outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
        >
          <option value="student">Student</option>
          <option value="librarian">Librarian</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <select
          value={isActive ? 'active' : 'inactive'}
          onChange={(e) => setIsActive(e.target.value === 'active')}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-800
            outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </td>
      <td className="px-4 py-3">—</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Button type="button" loading={saving} onClick={handleSave} className="py-1 px-3 text-xs">
            Save
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} className="py-1 px-3 text-xs">
            Cancel
          </Button>
        </div>
      </td>
    </tr>
  );
}

/**
 * LibrarianUserList — /librarian/users (librarian-only route)
 * Features:
 *   - Search users by name/email
 *   - Table with role badge, status, transaction count
 *   - Inline edit row to change role/status
 *   - Issue Book modal (select user → open form)
 *   - Return Book panel (select active transaction)
 */
export default function LibrarianUserList() {
  const { user: me, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // Transaction panel state
  const [issueOpen, setIssueOpen] = useState(false);
  const [returnTarget, setReturnTarget] = useState(null); // active transaction for return
  const [userTransactions, setUserTransactions] = useState([]); // for selected user
  const [txLoading, setTxLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll({ search });
      setUsers(Array.isArray(data) ? data : data.users ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 350);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleSaveUser = async (id, updates) => {
    setSaveError(null);
    try {
      await userService.update(id, updates);
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setSaveError(err.message);
    }
  };

  const loadUserTransactions = async (userId) => {
    setSelectedUserId(userId);
    setTxLoading(true);
    try {
      const data = await transactionService.getAll({ userId, status: 'active' });
      setUserTransactions(Array.isArray(data) ? data : data.transactions ?? []);
    } catch {
      setUserTransactions([]);
    } finally {
      setTxLoading(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-base font-bold text-gray-900">LibraryMS</span>
            <span className="hidden sm:inline rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">Librarian</span>
          </div>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link to="/books"          className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">Books</Link>
            <Link to="/librarian/users" className="rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 transition-colors">Users</Link>
            <Link to="/reports"        className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">Reports</Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-medium text-gray-800">{me?.name}</span>
              <span className="text-xs text-gray-400">Librarian</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {me?.name?.[0]?.toUpperCase() ?? 'L'}
            </div>
            <button id="librarian-logout" onClick={logout}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">User Management</h1>
            <p className="mt-0.5 text-sm text-gray-500">{filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}</p>
          </div>
          <Button id="issue-book-btn" onClick={() => setIssueOpen(true)} className="shrink-0">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Issue Book
          </Button>
        </div>

        {/* Issue Book form panel */}
        {issueOpen && (
          <div className="mb-6">
            <IssueBookForm
              onSuccess={() => { setIssueOpen(false); fetchUsers(); }}
              onCancel={() => setIssueOpen(false)}
            />
          </div>
        )}

        {/* Return Book form panel */}
        {returnTarget && (
          <div className="mb-6">
            <ReturnBookForm
              transaction={returnTarget}
              onSuccess={() => { setReturnTarget(null); loadUserTransactions(selectedUserId); }}
              onCancel={() => setReturnTarget(null)}
            />
          </div>
        )}

        <AlertBanner message={error} />
        <AlertBanner message={saveError} onDismiss={() => setSaveError(null)} />
        {(error || saveError) && <div className="mb-4" />}

        {/* Search */}
        <div className="mb-5 relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            id="user-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400
              outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 max-w-md"
          />
        </div>

        {/* Users table */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">All Users</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-medium text-gray-500">No users found</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search term.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Active Books</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((u) =>
                    editingId === u._id ? (
                      <EditUserRow
                        key={u._id}
                        user={u}
                        onSave={handleSaveUser}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-gray-900">{u.name}</td>
                        <td className="px-4 py-3.5 text-gray-500">{u.email}</td>
                        <td className="px-4 py-3.5"><RoleBadge role={u.role} /></td>
                        <td className="px-4 py-3.5"><ActiveBadge active={u.isActive ?? true} /></td>
                        <td className="px-4 py-3.5 text-gray-500">{u.borrowedCount ?? '—'}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex gap-2">
                            <button
                              id={`edit-user-${u._id}`}
                              onClick={() => setEditingId(u._id)}
                              className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                            >
                              Edit
                            </button>
                            {u.role === 'student' && (
                              <button
                                id={`return-user-${u._id}`}
                                onClick={async () => {
                                  await loadUserTransactions(u._id);
                                  // Return panel will show after transactions load
                                }}
                                className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:border-green-300 hover:text-green-600 transition-colors"
                              >
                                Returns
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User's active transactions (for return) */}
        {selectedUserId && userTransactions.length > 0 && !returnTarget && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">Active Transactions — select to return</h2>
              <button onClick={() => { setSelectedUserId(null); setUserTransactions([]); }}
                className="text-xs text-gray-400 hover:text-gray-600">✕ Close</button>
            </div>
            {txLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Book</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {userTransactions.map((t) => (
                      <tr key={t._id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-900">{t.book?.title ?? t.bookId ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-500">{new Date(t.dueDate).toLocaleDateString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <button
                            id={`return-tx-${t._id}`}
                            onClick={() => setReturnTarget(t)}
                            className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:border-green-300 hover:text-green-600 transition-colors"
                          >
                            Return
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
