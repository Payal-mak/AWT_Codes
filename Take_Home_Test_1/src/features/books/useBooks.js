import { useState, useEffect, useCallback, useRef } from 'react';
import bookService from '../../services/bookService';

/**
 * useBooks — custom hook encapsulating book list state:
 *   search, filter (genre), pagination, loading, error.
 * Returns all state + setters consumed by BookList.
 */
export function useBooks() {
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);
  const limit = 8;

  // Debounce search input to avoid excessive API calls
  const debounceRef = useRef(null);

  const fetchBooks = useCallback(async (q, g, p) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookService.getBooks({
        search: q,
        genre: g,
        page: p,
        limit,
      });
      // Support both { books, total } and plain array responses
      if (Array.isArray(data)) {
        setBooks(data);
        setTotal(data.length);
      } else {
        setBooks(data.books ?? []);
        setTotal(data.total ?? 0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchBooks(search, genre, page);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [search, genre, page, fetchBooks]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleGenreChange = (val) => {
    setGenre(val);
    setPage(1);
  };

  const refresh = () => fetchBooks(search, genre, page);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    books,
    total,
    loading,
    error,
    search,
    genre,
    page,
    totalPages,
    limit,
    setSearch: handleSearchChange,
    setGenre: handleGenreChange,
    setPage,
    refresh,
  };
}
