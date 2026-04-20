import { useEffect } from 'react';
import { useIssueBook, formatDate } from './useTransaction';
import { FormField, Input, Button, AlertBanner } from '../../shared/components/FormComponents';

/**
 * IssueBookForm — form for librarians to issue a book to a student.
 * Features:
 *   - Book ID / Student ID inputs
 *   - Live availability preview after book ID is entered (debounced)
 *   - Due date picker (defaults to 14 days from today)
 *   - react-hook-form validation
 */
export default function IssueBookForm({ onSuccess, onCancel }) {
  const {
    form, availability, availLoading, serverError, setServerError,
    checkAvailability, onSubmit,
  } = useIssueBook({ onSuccess });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = form;
  const bookId = watch('bookId');

  // Check availability whenever bookId changes (debounce handled in component)
  useEffect(() => {
    const timer = setTimeout(() => checkAvailability(bookId), 500);
    return () => clearTimeout(timer);
  }, [bookId, checkAvailability]);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
          <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Issue Book</h2>
          <p className="text-xs text-gray-500">Assign a book to a student</p>
        </div>
      </div>

      <AlertBanner message={serverError} onDismiss={() => setServerError(null)} />
      {serverError && <div className="mb-4" />}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Book ID */}
        <FormField label="Book ID" id="issue-bookId" error={errors.bookId?.message}>
          <Input
            id="issue-bookId"
            type="text"
            placeholder="Enter book ID"
            {...register('bookId', { required: 'Book ID is required' })}
          />
        </FormField>

        {/* Availability preview */}
        {bookId && (
          <div className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm transition-all
            ${availLoading ? 'border-gray-200 bg-gray-50 text-gray-400'
              : availability?.available
                ? 'border-green-200 bg-green-50 text-green-700'
                : availability
                  ? 'border-red-200 bg-red-50 text-red-600'
                  : 'border-gray-200 bg-gray-50 text-gray-400'}`}>
            {availLoading ? (
              <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> Checking availability…</>
            ) : availability ? (
              <>
                <span>{availability.available ? '✓' : '✗'}</span>
                <span>
                  {availability.title && <strong className="font-medium">{availability.title}</strong>}
                  {' — '}
                  {availability.available
                    ? `${availability.availableCopies} cop${availability.availableCopies === 1 ? 'y' : 'ies'} available`
                    : 'No copies available'}
                </span>
              </>
            ) : null}
          </div>
        )}

        {/* Student ID */}
        <FormField label="Student ID" id="issue-userId" error={errors.userId?.message}>
          <Input
            id="issue-userId"
            type="text"
            placeholder="Enter student ID"
            {...register('userId', { required: 'Student ID is required' })}
          />
        </FormField>

        {/* Due Date */}
        <FormField label="Due Date" id="issue-dueDate" error={errors.dueDate?.message}>
          <Input
            id="issue-dueDate"
            type="date"
            min={today}
            {...register('dueDate', {
              required: 'Due date is required',
              validate: (val) => val >= today || 'Due date must be today or later',
            })}
          />
          <p className="mt-1 text-xs text-gray-400">Default: 14 days from today</p>
        </FormField>

        <div className="flex gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={availability && !availability.available}
            className="flex-1"
          >
            Issue Book
          </Button>
        </div>
      </form>
    </div>
  );
}
