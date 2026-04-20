import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from 'recharts';
import ReportTable from './ReportTable';
import {
  MOCK_OVERDUE,
  MOCK_ISSUED_MONTHLY,
  MOCK_GENRE_DISTRIBUTION,
  MOCK_TRANSACTIONS,
  MOCK_SUMMARY,
} from './mockData';

// ── Tab definition ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',     label: 'Overview',            icon: '📊' },
  { id: 'overdue',      label: 'Overdue Books',        icon: '⚠️' },
  { id: 'issued',       label: 'Issued Books Chart',   icon: '📈' },
  { id: 'history',      label: 'Transaction History',  icon: '🗂️' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:   'bg-blue-50  text-blue-700  border-blue-200',
    overdue:  'bg-red-50   text-red-700   border-red-200',
    returned: 'bg-green-50 text-green-700 border-green-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${map[status] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
      {status}
    </span>
  );
}

function FineBadge({ fine }) {
  if (!fine || fine === 0) return <span className="text-gray-400">—</span>;
  return <span className="font-semibold text-red-600">₹{fine}</span>;
}

function DateCell({ value }) {
  if (!value) return <span className="text-gray-400">—</span>;
  return <span>{new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>;
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = 'indigo' }) {
  const colors = {
    indigo: 'border-indigo-100 bg-indigo-50 text-indigo-700',
    red:    'border-red-100   bg-red-50   text-red-700',
    green:  'border-green-100 bg-green-50 text-green-700',
    amber:  'border-amber-100 bg-amber-50 text-amber-700',
    slate:  'border-slate-200  bg-white    text-slate-700',
  };
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <p className="text-xs font-medium text-current opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-bold text-current">{value}</p>
      {sub && <p className="mt-0.5 text-xs opacity-60">{sub}</p>}
    </div>
  );
}

// ── Custom Tooltip for charts ──────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg text-xs">
      <p className="mb-1.5 font-semibold text-gray-700">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-semibold text-gray-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Tab panels ─────────────────────────────────────────────────────────────────

/** Overview — summary stats + mini charts */
function OverviewTab() {
  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Books Issued (Total)" value={MOCK_SUMMARY.totalBooksIssued} color="indigo" />
        <StatCard label="Currently Borrowed"   value={MOCK_SUMMARY.currentlyBorrowed} sub="active loans" color="slate" />
        <StatCard label="Overdue Books"         value={MOCK_SUMMARY.overdueCount}      color="red" />
        <StatCard label="Fine Collected"        value={`₹${MOCK_SUMMARY.totalFineCollected}`} color="amber" />
        <StatCard label="Total Books in Library" value={MOCK_SUMMARY.totalBooks}       color="slate" />
        <StatCard label="Active Students"       value={MOCK_SUMMARY.activeStudents}    color="green" />
      </div>

      {/* Mini area chart — monthly trend */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-800">Monthly Issued vs Returned</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={MOCK_ISSUED_MONTHLY} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
            <Line type="monotone" dataKey="issued"   name="Issued"   stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: '#6366f1' }} />
            <Line type="monotone" dataKey="returned" name="Returned" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
            <Line type="monotone" dataKey="overdue"  name="Overdue"  stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 3, fill: '#f43f5e' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Genre distribution bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-800">Books Issued by Genre</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={MOCK_GENRE_DISTRIBUTION} margin={{ top: 4, right: 16, left: 0, bottom: 0 }} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="genre" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8f8ff' }} />
            <Bar dataKey="count" name="Books" radius={[4, 4, 0, 0]}>
              {MOCK_GENRE_DISTRIBUTION.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** Overdue Books tab */
function OverdueTab() {
  const columns = [
    { key: 'studentName',  label: 'Student',    render: (v, row) => (
      <div>
        <p className="font-medium text-gray-900">{v}</p>
        <p className="text-xs text-gray-400">{row.studentEmail}</p>
      </div>
    )},
    { key: 'bookTitle',    label: 'Book' },
    { key: 'dueDate',      label: 'Due Date', render: (v) => <DateCell value={v} /> },
    { key: 'overdueDays',  label: 'Days Overdue', render: (v) => (
      <span className={`font-semibold ${v > 10 ? 'text-red-600' : v > 5 ? 'text-amber-600' : 'text-gray-700'}`}>
        {v} day{v !== 1 ? 's' : ''}
      </span>
    )},
    { key: 'fine', label: 'Fine (₹)', render: (v) => (
      <span className="font-semibold text-red-600">₹{v}</span>
    )},
  ];

  const totalFine = MOCK_OVERDUE.reduce((s, r) => s + r.fine, 0);

  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <div className="flex flex-wrap gap-4">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-xs font-medium text-red-600">Total Overdue</p>
          <p className="text-xl font-bold text-red-700">{MOCK_OVERDUE.length}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs font-medium text-amber-600">Total Outstanding Fine</p>
          <p className="text-xl font-bold text-amber-700">₹{totalFine}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <p className="text-xs font-medium text-gray-500">Fine Rate</p>
          <p className="text-xl font-bold text-gray-700">₹2 / day</p>
        </div>
      </div>

      <ReportTable
        columns={columns}
        data={MOCK_OVERDUE}
        keyField="_id"
        searchable
        searchPlaceholder="Search by student or book…"
        emptyMessage="No overdue books — great job!"
        pageSize={6}
      />
    </div>
  );
}

/** Issued Books Chart tab */
function IssuedChartTab() {
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'line'

  return (
    <div className="space-y-6">
      {/* Chart type toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500">Chart type:</span>
        {['bar', 'line'].map((t) => (
          <button
            key={t}
            id={`chart-type-${t}`}
            onClick={() => setChartType(t)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors
              ${chartType === t
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
          >
            {t === 'bar' ? '▊ Bar' : '〜 Line'}
          </button>
        ))}
      </div>

      {/* Monthly Issued / Returned / Overdue */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Monthly Issue Activity</h3>
            <p className="mt-0.5 text-xs text-gray-400">Last 6 months — issued, returned, overdue</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          {chartType === 'bar' ? (
            <BarChart data={MOCK_ISSUED_MONTHLY} margin={{ top: 4, right: 16, left: 0, bottom: 0 }} barCategoryGap="30%" barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8f8ff' }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Bar dataKey="issued"   name="Issued"   fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="returned" name="Returned" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="overdue"  name="Overdue"  fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={MOCK_ISSUED_MONTHLY} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Line type="monotone" dataKey="issued"   name="Issued"   stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="returned" name="Returned" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="overdue"  name="Overdue"  stroke="#f43f5e" strokeWidth={2}   strokeDasharray="5 3" dot={{ r: 3, fill: '#f43f5e' }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Genre distribution */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-1 text-sm font-semibold text-gray-800">Genre Distribution</h3>
        <p className="mb-4 text-xs text-gray-400">Total issues by book genre</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MOCK_GENRE_DISTRIBUTION} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="genre" width={80} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8f8ff' }} />
            <Bar dataKey="count" name="Books Issued" radius={[0, 4, 4, 0]}>
              {MOCK_GENRE_DISTRIBUTION.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data table below chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-800">Monthly Data Table</h3>
        <ReportTable
          columns={[
            { key: 'month',    label: 'Month' },
            { key: 'issued',   label: 'Issued',   render: (v) => <span className="font-semibold text-indigo-600">{v}</span> },
            { key: 'returned', label: 'Returned', render: (v) => <span className="font-semibold text-green-600">{v}</span> },
            { key: 'overdue',  label: 'Overdue',  render: (v) => <span className="font-semibold text-red-500">{v}</span> },
            {
              key: 'issued',
              label: 'Return Rate',
              sortable: false,
              render: (_, row) => {
                const rate = row.issued > 0 ? ((row.returned / row.issued) * 100).toFixed(0) : 0;
                return (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-green-500" style={{ width: `${rate}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{rate}%</span>
                  </div>
                );
              },
            },
          ]}
          data={MOCK_ISSUED_MONTHLY}
          keyField="month"
        />
      </div>
    </div>
  );
}

/** Transaction History tab */
function HistoryTab() {
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = statusFilter === 'all'
    ? MOCK_TRANSACTIONS
    : MOCK_TRANSACTIONS.filter((t) => t.status === statusFilter);

  const columns = [
    { key: 'studentName', label: 'Student', render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: 'bookTitle',   label: 'Book' },
    { key: 'issueDate',   label: 'Issued',   render: (v) => <DateCell value={v} /> },
    { key: 'dueDate',     label: 'Due Date', render: (v) => <DateCell value={v} /> },
    { key: 'returnDate',  label: 'Returned', sortable: false, render: (v) => <DateCell value={v} /> },
    { key: 'status',      label: 'Status',   sortable: false, render: (v) => <StatusBadge status={v} /> },
    { key: 'fine',        label: 'Fine',     render: (v) => <FineBadge fine={v} /> },
  ];

  return (
    <div className="space-y-5">
      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {['all', 'active', 'returned', 'overdue'].map((s) => (
          <button
            key={s}
            id={`filter-${s}`}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors
              ${statusFilter === s
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
          >
            {s === 'all' ? 'All' : s}
            {' '}
            <span className="ml-0.5 font-normal opacity-70">
              ({s === 'all'
                ? MOCK_TRANSACTIONS.length
                : MOCK_TRANSACTIONS.filter((t) => t.status === s).length})
            </span>
          </button>
        ))}
      </div>

      <ReportTable
        columns={columns}
        data={filtered}
        keyField="_id"
        searchable
        searchPlaceholder="Search by student or book…"
        emptyMessage="No transactions match this filter."
        pageSize={8}
      />
    </div>
  );
}

// ── Main ReportDashboard ───────────────────────────────────────────────────────
/**
 * ReportDashboard — /reports (librarian-only)
 * Tabs: Overview | Overdue Books | Issued Chart | Transaction History
 */
export default function ReportDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'overdue':  return <OverdueTab />;
      case 'issued':   return <IssuedChartTab />;
      case 'history':  return <HistoryTab />;
      default:         return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-base font-bold text-gray-900">LibraryMS</span>
            <span className="hidden sm:inline rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">Librarian</span>
          </div>

          {/* Inline nav */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link to="/books"          className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">Books</Link>
            <Link to="/librarian/users" className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">Users</Link>
            <Link to="/reports"        className="rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 transition-colors">Reports</Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-medium text-gray-800">{user?.name}</span>
              <span className="text-xs text-gray-400">Librarian</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {user?.name?.[0]?.toUpperCase() ?? 'L'}
            </div>
            <button id="reports-logout" onClick={logout}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-0.5 text-sm text-gray-500">Library activity and statistics — mock data</p>
        </div>

        {/* Tab bar */}
        <div className="mb-6 flex overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div id={`panel-${activeTab}`}>
          {renderTab()}
        </div>
      </main>
    </div>
  );
}
