import apiClient from './apiClient';

/**
 * Book Service — Mocked for frontend testing using localStorage.
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredBooks = () => {
  const stored = localStorage.getItem('mock_books');
  if (stored) return JSON.parse(stored);
  
  // Seed with some initial books if empty
  const initial = [
    { _id: 'b1', title: 'Clean Code', author: 'Robert C. Martin', genre: 'Technology', totalCopies: 5, availableCopies: 5, publishedYear: 2008 },
    { _id: 'b2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', genre: 'Technology', totalCopies: 3, availableCopies: 2, publishedYear: 1999 },
    { _id: 'b3', title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', totalCopies: 2, availableCopies: 0, publishedYear: 1965 },
    { _id: 'b4', title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', totalCopies: 10, availableCopies: 8, publishedYear: 2018 },
  ];
  localStorage.setItem('mock_books', JSON.stringify(initial));
  return initial;
};

const bookService = {
  getBooks: async (params = {}) => {
    await delay(500);
    let books = getStoredBooks();
    
    if (params.search) {
      const q = params.search.toLowerCase();
      books = books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    if (params.genre) {
      books = books.filter(b => b.genre === params.genre);
    }
    
    const page = parseInt(params.page || 1);
    const limit = parseInt(params.limit || 8);
    const start = (page - 1) * limit;
    
    return {
      books: books.slice(start, start + limit),
      total: books.length,
      page,
      totalPages: Math.ceil(books.length / limit)
    };
  },

  getBook: async (id) => {
    await delay(300);
    const book = getStoredBooks().find(b => b._id === id);
    if (!book) throw new Error('Book not found');
    return book;
  },

  createBook: async (bookData) => {
    await delay(500);
    const books = getStoredBooks();
    const newBook = { ...bookData, _id: `b_${Date.now()}` };
    books.push(newBook);
    localStorage.setItem('mock_books', JSON.stringify(books));
    return newBook;
  },

  updateBook: async (id, bookData) => {
    await delay(500);
    const books = getStoredBooks();
    const idx = books.findIndex(b => b._id === id);
    if (idx === -1) throw new Error('Book not found');
    books[idx] = { ...books[idx], ...bookData };
    localStorage.setItem('mock_books', JSON.stringify(books));
    return books[idx];
  },

  deleteBook: async (id) => {
    await delay(500);
    let books = getStoredBooks();
    books = books.filter(b => b._id !== id);
    localStorage.setItem('mock_books', JSON.stringify(books));
    return { success: true };
  },
};

export default bookService;
