import { useRenewBook, formatDate, getOverdueDays } from './useTransaction';
import { FormField, Input, Button, AlertBanner } from '../../shared/components/FormComponents';

/**
 * RenewBookForm — form to extend the due date of an active borrowing.
 * Props:
 *   transaction — the current transaction object
 *   onSuccess   — callback after successful renewal
 *   onCancel    — optional cancel handler
 *
 * Features:
 *   - Shows current due date and overdue status
 *   - Fine preview if currently overdue
 *   - New due date picker
 */
export default function RenewBookForm({ transaction, onSuccess, onCancel }) {
  const {
    form, currentFine, overdueDays, serverError, setServerError, onSubmit,
  } = useRenewBook({ transaction, onSuccess });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = overdueDays > 0;

  if (!transaction) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">
        Select a transaction to renew.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
          <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Renew Book</h2>
          <p className="text-xs text-gray-500">Extend the due date for this borrowing</p>
        </div>
      </div>

      <AlertBanner message={serverError} onDismiss={() => setServerError(null)} />
      {serverError && <div className="mb-4" />}

      {/* Transaction summary */}
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
          <span className="text-gray-500">Current Due Date</span>
          <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
            {formatDate(transaction.dueDate)}
            {isOverdue && <span className="ml-2 text-xs">({overdueDays}d overdue)</span>}
          </span>
        </div>
      </div>

      {/* Fine preview (if overdue) */}
      {isOverdue && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">Overdue Fine Preview</p>
            <p className="text-xs text-amber-700 mt-0.5">
              ₹<strong>{currentFine}</strong> ({overdueDays} day{overdueDays !== 1 ? 's' : ''} × ₹2/day). Fine must be cleared before or at return.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* New Due Date */}
        <FormField label="New Due Date" id="renew-dueDate" error={errors.newDueDate?.message}>
          <Input
            id="renew-dueDate"
            type="date"
            min={today}
            {...register('newDueDate', {
              required: 'New due date is required',
              validate: (val) => val >= today || 'New due date must be today or later',
            })}
          />
          <p className="mt-1 text-xs text-gray-400">Default extension: 14 days from today</p>
        </FormField>

        <div className="flex gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
          <Button type="submit" loading={isSubmitting} className="flex-1">
            Renew Book
          </Button>
        </div>
      </form>
    </div>
  );
}
