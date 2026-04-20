import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBooks } from './useBooks';
import BookFormModal from './BookFormModal';
import bookService from '../../services/bookService';
import { Button, AlertBanner } from '../../shared/components/FormComponents';

const GENRES = [
  '', 'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History',
  'Biography', 'Fantasy', 'Mystery', 'Romance', 'Self-Help',
];

/** BookCard — single book in the grid */
function BookCard({ book, isLibrarian, onEdit, onDelete }) {
  return (
    <div className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-shadow duration-150 hover:shadow-md">
      {/* Genre badge */}
      {book.genre && (
        <span className="mb-3 inline-flex w-fit rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
          {book.genre}
        </span>
      )}

      {/* Title & Author */}
      <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 leading-snug">
        {book.title}
      </h3>
      <p className="mb-3 text-xs text-gray-500">{book.author}</p>

      {/* Meta */}
      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
        {book.publishedYear && <span>{book.publishedYear}</span>}
        {book.totalCopies !== undefined && (
          <span className={book.totalCopies > 0 ? 'text-green-600' : 'text-red-500'}>
            {book.totalCopies > 0 ? `${book.totalCopies} available` : 'Out of stock'}
          </span>
        )}
      </div>

      {/* Librarian actions */}
      {isLibrarian && (
        <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <button
            id={`edit-book-${book._id}`}
            onClick={() => onEdit(book)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit
          </button>
          <button
            id={`delete-book-${book._id}`}
            onClick={() => onDelete(book)}
            className="flex items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}

/** Pagination */
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
  const visible = pages.slice(start - 1, end);

  return (
    <div className="flex items-center justify-center gap-1">
      <button id="pagination-prev" disabled={page === 1} onClick={() => onPageChange(page - 1)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">‹</button>
      {start > 1 && (<><button onClick={() => onPageChange(1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-xs text-gray-500 hover:border-gray-300 transition-colors">1</button>{start > 2 && <span className="px-1 text-gray-300">…</span>}</>)}
      {visible.map((p) => (
        <button key={p} id={`pagination-page-${p}`} onClick={() => onPageChange(p)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-medium transition-colors
            ${p === page ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
          {p}
        </button>
      ))}
      {end < totalPages && (<>{end < totalPages - 1 && <span className="px-1 text-gray-300">…</span>}<button onClick={() => onPageChange(totalPages)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-xs text-gray-500 hover:border-gray-300 transition-colors">{totalPages}</button></>)}
      <button id="pagination-next" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">›</button>
    </div>
  );
}

/** Delete confirm dialog */
function DeleteConfirmDialog({ book, onConfirm, onCancel, loading }) {
  if (!book) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-2 text-center text-base font-semibold text-gray-900">Delete Book?</h3>
        <p className="mb-6 text-center text-sm text-gray-500">
          <span className="font-medium text-gray-700">&ldquo;{book.title}&rdquo;</span> will be permanently removed.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" className="flex-1" loading={loading} onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

/**
 * BookListPage — /books
 */
export default function BookListPage() {
  const { user, isLibrarian, logout } = useAuth();
  const {
    books, total, loading, error,
    search, genre, page, totalPages,
    setSearch, setGenre, setPage, refresh,
  } = useBooks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const openAddModal = () => { setEditingBook(null); setModalOpen(true); };
  const openEditModal = (book) => { setEditingBook(book); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingBook(null); };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await bookService.deleteBook(deletingBook._id);
      setDeletingBook(null);
      refresh();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

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
          </div>

          {/* Role-based nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link to="/books"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 transition-colors">
              Books
            </Link>
            {isLibrarian ? (
              <>
                <Link to="/librarian/users" id="nav-users"
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                  Users
                </Link>
                <Link to="/reports" id="nav-reports"
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                  Reports
                </Link>
              </>
            ) : (
              <Link to="/dashboard" id="nav-dashboard"
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                My Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-medium text-gray-800">{user?.name}</span>
              <span className="text-xs text-gray-400 capitalize">{user?.role}</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <button id="logout-btn" onClick={logout}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Book Catalogue</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {total > 0 ? `${total} book${total !== 1 ? 's' : ''} found` : 'No books found'}
            </p>
          </div>
          {isLibrarian && (
            <Button id="add-book-btn" onClick={openAddModal} className="shrink-0">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Book
            </Button>
          )}
        </div>

        {/* Search + filter */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input id="book-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, or ISBN…"
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400
                outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
            )}
          </div>
          <select id="genre-filter" value={genre} onChange={(e) => setGenre(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700
              outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 sm:w-40">
            {GENRES.map((g) => (
              <option key={g} value={g}>{g || 'All Genres'}</option>
            ))}
          </select>
        </div>

        {/* Active filter chips */}
        {(search || genre) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {search && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-indigo-700">
                &ldquo;{search}&rdquo;
                <button onClick={() => setSearch('')} className="hover:text-indigo-900">✕</button>
              </span>
            )}
            {genre && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600">
                {genre}
                <button onClick={() => setGenre('')} className="hover:text-gray-900">✕</button>
              </span>
            )}
            <button onClick={() => { setSearch(''); setGenre(''); }} className="text-xs text-gray-400 underline hover:text-gray-600">
              Clear all
            </button>
          </div>
        )}

        {/* Error banners */}
        <AlertBanner message={error} />
        {deleteError && <AlertBanner message={deleteError} onDismiss={() => setDeleteError(null)} />}

        {/* Book grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-xl border border-gray-100 bg-gray-100" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 bg-white">
              <svg className="h-7 w-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-700">No books found</h3>
            <p className="mt-1 text-sm text-gray-400">Try a different search or filter.</p>
            {isLibrarian && <Button onClick={openAddModal} className="mt-4">Add the first book</Button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book._id} book={book} isLibrarian={isLibrarian} onEdit={openEditModal} onDelete={setDeletingBook} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && books.length > 0 && (
          <div className="mt-8">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </main>

      {/* Modals — librarian only */}
      {isLibrarian && (
        <>
          <BookFormModal isOpen={modalOpen} onClose={closeModal} onSuccess={refresh} book={editingBook} />
          <DeleteConfirmDialog book={deletingBook} onConfirm={handleDeleteConfirm} onCancel={() => setDeletingBook(null)} loading={deleteLoading} />
        </>
      )}
    </div>
  );
}
