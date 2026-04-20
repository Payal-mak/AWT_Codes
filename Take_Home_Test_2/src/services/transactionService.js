import apiClient from './apiClient';

/**
 * Transaction Service — Mocked for frontend testing using localStorage.
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredTx = () => JSON.parse(localStorage.getItem('mock_transactions') || '[]');

const transactionService = {
  getAll: async (params = {}) => {
    await delay(400);
    let txs = getStoredTx();
    if (params.userId) txs = txs.filter((t) => t.userId === params.userId);
    if (params.status) txs = txs.filter((t) => t.status === params.status);
    return { transactions: txs };
  },

  getMine: async (params = {}) => {
    await delay(400);
    // Since we don't have token decoding, just return all active ones simulating current user
    const txs = getStoredTx().filter((t) => t.status !== 'returned');
    return { transactions: txs };
  },

  getById: async (id) => {
    await delay(200);
    const tx = getStoredTx().find((t) => t._id === id);
    if (!tx) throw new Error('Transaction not found');
    return tx;
  },

  issue: async (data) => {
    await delay(500);
    const txs = getStoredTx();
    // Fetch user and book details from mock stores simply by reading local storage
    const books = JSON.parse(localStorage.getItem('mock_books') || '[]');
    const book = books.find(b => String(b._id) === String(data.bookId));
    if (!book) throw new Error('Book not found in library');

    const newTx = {
      _id: `tx_${Date.now()}`,
      userId: data.userId,
      bookId: data.bookId,
      book: { title: book.title, author: book.author },
      user: { name: `User ${data.userId}` }, // Simulated
      issueDate: new Date().toISOString(),
      dueDate: data.dueDate,
      returnDate: null,
      status: 'active',
      fine: 0,
    };
    txs.push(newTx);
    localStorage.setItem('mock_transactions', JSON.stringify(txs));

    // Decrement available copies
    if (book.availableCopies > 0) {
      book.availableCopies -= 1;
      localStorage.setItem('mock_books', JSON.stringify(books));
    }
    return newTx;
  },

  renew: async (id, data) => {
    await delay(500);
    const txs = getStoredTx();
    const idx = txs.findIndex((t) => t._id === id);
    if (idx === -1) throw new Error('Transaction not found');
    
    txs[idx].dueDate = data.newDueDate;
    // Reset status to active if previous overdue is cleared, but fine carries over usually handling.
    txs[idx].status = 'active'; 
    localStorage.setItem('mock_transactions', JSON.stringify(txs));
    return txs[idx];
  },

  return: async (id) => {
    await delay(500);
    const txs = getStoredTx();
    const idx = txs.findIndex((t) => t._id === id);
    if (idx === -1) throw new Error('Transaction not found');
    
    txs[idx].status = 'returned';
    txs[idx].returnDate = new Date().toISOString();
    localStorage.setItem('mock_transactions', JSON.stringify(txs));

    // Increment available copies
    const books = JSON.parse(localStorage.getItem('mock_books') || '[]');
    const bookIdx = books.findIndex(b => String(b._id) === String(txs[idx].bookId));
    if (bookIdx !== -1) {
      books[bookIdx].availableCopies += 1;
      localStorage.setItem('mock_books', JSON.stringify(books));
    }
    return txs[idx];
  },
};

export default transactionService;
