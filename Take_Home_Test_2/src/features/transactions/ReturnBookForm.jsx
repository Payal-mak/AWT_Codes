import { useReturnBook, formatDate } from './useTransaction';
import { Button, AlertBanner } from '../../shared/components/FormComponents';

/**
 * ReturnBookForm — confirmation UI to mark a book as returned.
 * Props:
 *   transaction — current active transaction object
 *   onSuccess   — callback after successful return
 *   onCancel    — optional cancel handler
 *
 * Features:
 *   - Shows borrowed book details
 *   - Fine preview (₹2/day overdue)
 *   - One-click return confirmation (no extra fields needed)
 */
export default function ReturnBookForm({ transaction, onSuccess, onCancel }) {
  const {
    currentFine, overdueDays, serverError, setServerError, submitting, handleReturn,
  } = useReturnBook({ transaction, onSuccess });

  const isOverdue = overdueDays > 0;

  if (!transaction) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">
        Select a transaction to return.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Return Book</h2>
          <p className="text-xs text-gray-500">Mark this borrowing as returned</p>
        </div>
      </div>

      <AlertBanner message={serverError} onDismiss={() => setServerError(null)} />
      {serverError && <div className="mb-4" />}

      {/* Transaction details */}
      <div className="mb-5 rounded-lg border border-gray-100 bg-gray-50 p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Book</span>
          <span className="font-medium text-gray-800">{transaction.book?.title ?? transaction.bookId ?? '—'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Student</span>
          <span className="font-medium text-gray-800">{transaction.user?.name ?? transaction.userId ?? '—'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Issued On</span>
          <span className="font-medium text-gray-800">{formatDate(transaction.issueDate)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Due Date</span>
          <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
            {formatDate(transaction.dueDate)}
          </span>
        </div>
      </div>

      {/* Fine preview */}
      {isOverdue ? (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <p className="text-sm font-semibold text-red-700">Fine Due on Return</p>
            <p className="text-xs text-red-600 mt-0.5">
              ₹<strong>{currentFine}</strong> — {overdueDays} day{overdueDays !== 1 ? 's' : ''} overdue × ₹2/day
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <svg className="h-4 w-4 shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <p className="text-sm text-green-700">Returned on time — <strong>No fine</strong></p>
        </div>
      )}

      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button
          type="button"
          loading={submitting}
          onClick={handleReturn}
          className="flex-1"
        >
          Confirm Return
        </Button>
      </div>
    </div>
  );
}
