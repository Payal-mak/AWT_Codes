import apiClient from './apiClient';

/**
 * Book Service — wraps all /books endpoints.
 * All methods return the response data directly (interceptor unwraps .data).
 */
const bookService = {
  /** GET /books?search=&genre=&page=&limit= */
  getBooks: (params = {}) => apiClient.get('/books', { params }),

  /** GET /books/:id */
  getBook: (id) => apiClient.get(`/books/${id}`),

  /** POST /books — librarian only */
  createBook: (bookData) => apiClient.post('/books', bookData),

  /** PUT /books/:id — librarian only */
  updateBook: (id, bookData) => apiClient.put(`/books/${id}`, bookData),

  /** DELETE /books/:id — librarian only */
  deleteBook: (id) => apiClient.delete(`/books/${id}`),
};

export default bookService;
