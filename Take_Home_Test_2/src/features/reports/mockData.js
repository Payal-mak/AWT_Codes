/**
 * mockData.js — static mock data for the ReportDashboard.
 * Replace these with real API calls when the backend is connected.
 */

// ── Overdue Books ─────────────────────────────────────────────────────────────
export const MOCK_OVERDUE = [
  { _id: 'tx001', studentName: 'Priya Sharma',   studentEmail: 'priya@college.edu',  bookTitle: 'Clean Code',              dueDate: '2026-04-01', overdueDays: 19, fine: 38 },
  { _id: 'tx002', studentName: 'Arjun Mehta',    studentEmail: 'arjun@college.edu',  bookTitle: 'The Pragmatic Programmer', dueDate: '2026-04-05', overdueDays: 15, fine: 30 },
  { _id: 'tx003', studentName: 'Sneha Patel',    studentEmail: 'sneha@college.edu',  bookTitle: 'Design Patterns',         dueDate: '2026-04-08', overdueDays: 12, fine: 24 },
  { _id: 'tx004', studentName: 'Rohan Gupta',    studentEmail: 'rohan@college.edu',  bookTitle: 'Introduction to Algorithms', dueDate: '2026-04-10', overdueDays: 10, fine: 20 },
  { _id: 'tx005', studentName: 'Ananya Nair',    studentEmail: 'ananya@college.edu', bookTitle: 'You Don\'t Know JS',      dueDate: '2026-04-13', overdueDays: 7,  fine: 14 },
  { _id: 'tx006', studentName: 'Karan Singh',    studentEmail: 'karan@college.edu',  bookTitle: 'Refactoring',             dueDate: '2026-04-15', overdueDays: 5,  fine: 10 },
  { _id: 'tx007', studentName: 'Meera Rao',      studentEmail: 'meera@college.edu',  bookTitle: 'The Lean Startup',        dueDate: '2026-04-17', overdueDays: 3,  fine: 6  },
  { _id: 'tx008', studentName: 'Dev Kapoor',     studentEmail: 'dev@college.edu',    bookTitle: 'Deep Work',               dueDate: '2026-04-18', overdueDays: 2,  fine: 4  },
];

// ── Issued Books — monthly chart data ─────────────────────────────────────────
export const MOCK_ISSUED_MONTHLY = [
  { month: 'Nov', issued: 24, returned: 18, overdue: 4 },
  { month: 'Dec', issued: 31, returned: 27, overdue: 6 },
  { month: 'Jan', issued: 42, returned: 38, overdue: 5 },
  { month: 'Feb', issued: 38, returned: 35, overdue: 7 },
  { month: 'Mar', issued: 55, returned: 49, overdue: 9 },
  { month: 'Apr', issued: 47, returned: 39, overdue: 8 },
];

// ── Genre Distribution — pie/bar chart data ───────────────────────────────────
export const MOCK_GENRE_DISTRIBUTION = [
  { genre: 'Technology', count: 58, fill: '#6366f1' },
  { genre: 'Fiction',    count: 44, fill: '#8b5cf6' },
  { genre: 'Science',    count: 37, fill: '#06b6d4' },
  { genre: 'History',    count: 29, fill: '#f59e0b' },
  { genre: 'Biography',  count: 22, fill: '#10b981' },
  { genre: 'Self-Help',  count: 18, fill: '#f43f5e' },
];

// ── Transaction History ────────────────────────────────────────────────────────
export const MOCK_TRANSACTIONS = [
  { _id: 'h001', studentName: 'Priya Sharma',  bookTitle: 'Clean Code',                 issueDate: '2026-03-15', dueDate: '2026-03-29', returnDate: null,         status: 'overdue',  fine: 38 },
  { _id: 'h002', studentName: 'Arjun Mehta',   bookTitle: 'The Pragmatic Programmer',   issueDate: '2026-03-18', dueDate: '2026-04-01', returnDate: null,         status: 'overdue',  fine: 30 },
  { _id: 'h003', studentName: 'Sneha Patel',   bookTitle: 'Design Patterns',            issueDate: '2026-03-20', dueDate: '2026-04-03', returnDate: '2026-04-02', status: 'returned', fine: 0  },
  { _id: 'h004', studentName: 'Rohan Gupta',   bookTitle: 'CLRS Algorithms',            issueDate: '2026-03-22', dueDate: '2026-04-05', returnDate: null,         status: 'overdue',  fine: 20 },
  { _id: 'h005', studentName: 'Ananya Nair',   bookTitle: 'You Don\'t Know JS',         issueDate: '2026-03-25', dueDate: '2026-04-08', returnDate: '2026-04-07', status: 'returned', fine: 0  },
  { _id: 'h006', studentName: 'Karan Singh',   bookTitle: 'Refactoring',                issueDate: '2026-03-28', dueDate: '2026-04-11', returnDate: null,         status: 'active',   fine: 0  },
  { _id: 'h007', studentName: 'Meera Rao',     bookTitle: 'The Lean Startup',           issueDate: '2026-04-01', dueDate: '2026-04-15', returnDate: '2026-04-14', status: 'returned', fine: 0  },
  { _id: 'h008', studentName: 'Dev Kapoor',    bookTitle: 'Deep Work',                  issueDate: '2026-04-03', dueDate: '2026-04-17', returnDate: null,         status: 'active',   fine: 0  },
  { _id: 'h009', studentName: 'Ishaan Verma',  bookTitle: 'Atomic Habits',              issueDate: '2026-04-05', dueDate: '2026-04-19', returnDate: '2026-04-18', status: 'returned', fine: 0  },
  { _id: 'h010', studentName: 'Simran Kaur',   bookTitle: 'The Alchemist',              issueDate: '2026-04-08', dueDate: '2026-04-22', returnDate: null,         status: 'active',   fine: 0  },
  { _id: 'h011', studentName: 'Priya Sharma',  bookTitle: 'Dune',                       issueDate: '2026-04-10', dueDate: '2026-04-24', returnDate: null,         status: 'active',   fine: 0  },
  { _id: 'h012', studentName: 'Arjun Mehta',   bookTitle: 'Zero to One',                issueDate: '2026-04-12', dueDate: '2026-04-26', returnDate: null,         status: 'active',   fine: 0  },
];

// ── Summary stats ──────────────────────────────────────────────────────────────
export const MOCK_SUMMARY = {
  totalBooksIssued: 247,
  currentlyBorrowed: 34,
  overdueCount: 8,
  totalFineCollected: 1420,
  totalBooks: 512,
  activeStudents: 78,
};
