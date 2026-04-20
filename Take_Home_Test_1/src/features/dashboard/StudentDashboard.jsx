import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const MOCK_BORROWED = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', issueDate: '2026-04-10', dueDate: '2026-04-24', status: 'issued' },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', issueDate: '2026-03-15', dueDate: '2026-03-29', status: 'overdue', fine: 5 },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [borrowed, setBorrowed] = useState(MOCK_BORROWED);

  if (user?.role !== 'student') {
    return <div className="p-8 text-red-500">Access Denied. Students only.</div>;
  }

  return (
    <div className="p-8 mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="mt-1 text-sm text-gray-500">Student Dashboard</p>
        </div>
        <Link to="/books" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Browse Library
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stats overview */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Active Borrowed Books</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{borrowed.filter(b => b.status === 'issued').length}</div>
        </div>
         <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <div className="text-sm font-medium text-red-500">Overdue Books</div>
          <div className="mt-2 text-3xl font-bold text-red-700">{borrowed.filter(b => b.status === 'overdue').length}</div>
        </div>
      </div>

      <h2 className="mt-10 mb-4 text-lg font-semibold text-gray-900">Your Borrowed Books</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Book</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Issue Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Fine</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {borrowed.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{b.title}</div>
                  <div className="text-xs text-gray-500">{b.author}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{b.issueDate}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{b.dueDate}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${b.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {b.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                  {b.fine ? <span className="text-red-600 font-medium">${b.fine}</span> : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
