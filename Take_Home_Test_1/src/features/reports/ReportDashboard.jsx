import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

const ISSUED_BOOKS_CHART_DATA = [
  { name: 'Jan', issued: 40 },
  { name: 'Feb', issued: 30 },
  { name: 'Mar', issued: 60 },
  { name: 'Apr', issued: 85 },
  { name: 'May', issued: 50 },
];

const OVERDUE_BOOKS_MOCK = [
  { id: 1, title: 'Clean Code', user: 'Bob Jones', dueDate: '2026-04-15', fine: 5 },
  { id: 2, title: 'Refactoring', user: 'Alice Smith', dueDate: '2026-04-10', fine: 10 },
];

const TRANSACTION_HISTORY_MOCK = [
  { id: 101, title: 'The Great Gatsby', type: 'issue', date: '2026-04-10', user: 'Alice Smith' },
  { id: 102, title: 'Clean Code', type: 'return', date: '2026-04-18', user: 'Bob Jones' },
  { id: 103, title: 'Design Patterns', type: 'renew', date: '2026-04-19', user: 'Charlie Brown' },
];

export default function ReportDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('chart');

  if (user?.role !== 'librarian') {
    return <div className="p-8 text-red-500">Access Denied. Librarians only.</div>;
  }

  return (
    <div className="p-8 mx-auto max-w-7xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Reports Dashboard</h1>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('chart')}
            className={`${activeTab === 'chart' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Issue Trends
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`${activeTab === 'overdue' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Overdue Books
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`${activeTab === 'history' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Transaction History
          </button>
        </nav>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {activeTab === 'chart' && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Monthly Issued Books</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ISSUED_BOOKS_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="issued" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'overdue' && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Overdue Books Table</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {OVERDUE_BOOKS_MOCK.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.user}</td>
                    <td className="px-6 py-4 text-sm text-red-500">{item.dueDate}</td>
                    <td className="px-6 py-4 text-sm text-red-600 font-bold">${item.fine}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Recent Transactions</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {TRANSACTION_HISTORY_MOCK.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                        ${item.type === 'issue' ? 'bg-blue-100 text-blue-800' : item.type === 'return' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.user}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
