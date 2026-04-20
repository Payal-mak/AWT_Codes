import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import transactionService from '../../services/transactionService';
import bookService from '../../services/bookService';

// ── Fine calculation ─────────────────────────────────────────────────────────
const FINE_RATE_PER_DAY = 2; // ₹ per day overdue

/** Returns number of overdue days (0 if not overdue) */
export function getOverdueDays(dueDate) {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - due) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

/** Returns calculated fine amount in ₹ */
export function calculateFine(dueDate) {
  return getOverdueDays(dueDate) * FINE_RATE_PER_DAY;
}

/** Returns ISO date string for today + n days */
export function futureDate(days = 14) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/** Format a date string to readable form */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ── useIssueBook ─────────────────────────────────────────────────────────────
/**
 * Custom hook for the Issue Book form.
 * Handles: book search for availability, form state, submission.
 */
export function useIssueBook({ onSuccess } = {}) {
  const [availability, setAvailability] = useState(null); // null | { available, totalCopies }
  const [availLoading, setAvailLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const form = useForm({
    mode: 'onTouched',
    defaultValues: { bookId: '', userId: '', dueDate: futureDate(14) },
  });

  const checkAvailability = useCallback(async (bookId) => {
    if (!bookId) { setAvailability(null); return; }
    setAvailLoading(true);
    try {
      const book = await bookService.getBook(bookId);
      setAvailability({
        available: (book.availableCopies ?? book.totalCopies ?? 1) > 0,
        availableCopies: book.availableCopies ?? book.totalCopies ?? 1,
        title: book.title,
      });
    } catch {
      setAvailability(null);
    } finally {
      setAvailLoading(false);
    }
  }, []);

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const result = await transactionService.issue(data);
      form.reset();
      setAvailability(null);
      onSuccess?.(result);
    } catch (err) {
      setServerError(err.message);
    }
  };

  return { form, availability, availLoading, serverError, setServerError, checkAvailability, onSubmit };
}

// ── useRenewBook ─────────────────────────────────────────────────────────────
/**
 * Custom hook for the Renew Book form.
 * Handles: fine preview based on current due date, new due date selection.
 */
export function useRenewBook({ transaction, onSuccess } = {}) {
  const [serverError, setServerError] = useState(null);

  const currentFine = transaction ? calculateFine(transaction.dueDate) : 0;
  const overdueDays = transaction ? getOverdueDays(transaction.dueDate) : 0;

  const form = useForm({
    mode: 'onTouched',
    defaultValues: {
      newDueDate: futureDate(14),
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const result = await transactionService.renew(transaction._id, { newDueDate: data.newDueDate });
      onSuccess?.(result);
    } catch (err) {
      setServerError(err.message);
    }
  };

  return { form, currentFine, overdueDays, serverError, setServerError, onSubmit };
}

// ── useReturnBook ─────────────────────────────────────────────────────────────
/**
 * Custom hook for the Return Book form.
 * Handles: fine preview, submission.
 */
export function useReturnBook({ transaction, onSuccess } = {}) {
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const currentFine = transaction ? calculateFine(transaction.dueDate) : 0;
  const overdueDays = transaction ? getOverdueDays(transaction.dueDate) : 0;

  const handleReturn = async () => {
    setServerError(null);
    setSubmitting(true);
    try {
      const result = await transactionService.return(transaction._id);
      onSuccess?.(result);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return { currentFine, overdueDays, serverError, setServerError, submitting, handleReturn };
}
