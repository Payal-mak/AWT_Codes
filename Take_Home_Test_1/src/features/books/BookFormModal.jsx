import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import bookService from '../../services/bookService';
import { FormField, Input, Button, AlertBanner } from '../../shared/components/FormComponents';

const GENRES = [
  'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History',
  'Biography', 'Fantasy', 'Mystery', 'Romance', 'Self-Help',
];

/**
 * BookFormModal — shared modal for AddBook and EditBook.
 * Props:
 *   isOpen, onClose, onSuccess, book (null = create mode)
 */
export default function BookFormModal({ isOpen, onClose, onSuccess, book = null }) {
  const isEditMode = Boolean(book);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      title: '', author: '', genre: '', isbn: '',
      publishedYear: '', description: '', totalCopies: 1,
    },
  });

  useEffect(() => {
    if (book) {
      reset({
        title: book.title ?? '',
        author: book.author ?? '',
        genre: book.genre ?? '',
        isbn: book.isbn ?? '',
        publishedYear: book.publishedYear ?? '',
        description: book.description ?? '',
        totalCopies: book.totalCopies ?? 1,
      });
    } else {
      reset();
    }
  }, [book, reset]);

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const payload = {
        ...data,
        publishedYear: Number(data.publishedYear),
        totalCopies: Number(data.totalCopies),
      };
      const result = isEditMode
        ? await bookService.updateBook(book._id, payload)
        : await bookService.createBook(payload);
      onSuccess(result);
      onClose();
    } catch (err) {
      setServerError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            {isEditMode ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-5">
          <AlertBanner message={serverError} onDismiss={() => setServerError(null)} />
          {serverError && <div className="mb-4" />}

          <form id="book-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Title */}
            <FormField label="Title" id="book-title" error={errors.title?.message}>
              <Input id="book-title" type="text" placeholder="The Great Gatsby"
                {...register('title', {
                  required: 'Title is required',
                  maxLength: { value: 200, message: 'Title is too long' },
                })} />
            </FormField>

            {/* Author */}
            <FormField label="Author" id="book-author" error={errors.author?.message}>
              <Input id="book-author" type="text" placeholder="F. Scott Fitzgerald"
                {...register('author', {
                  required: 'Author is required',
                  maxLength: { value: 100, message: 'Author name is too long' },
                })} />
            </FormField>

            {/* Genre + ISBN */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Genre" id="book-genre" error={errors.genre?.message}>
                <select id="book-genre"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900
                    outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  {...register('genre', { required: 'Select a genre' })}>
                  <option value="">Select genre</option>
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </FormField>

              <FormField label="ISBN" id="book-isbn" error={errors.isbn?.message}>
                <Input id="book-isbn" type="text" placeholder="978-0-00-000000-0"
                  {...register('isbn', { required: 'ISBN is required' })} />
              </FormField>
            </div>

            {/* Year + Copies */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Published Year" id="book-year" error={errors.publishedYear?.message}>
                <Input id="book-year" type="number" placeholder="2024"
                  {...register('publishedYear', {
                    required: 'Year is required',
                    min: { value: 1000, message: 'Enter a valid year' },
                    max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' },
                  })} />
              </FormField>

              <FormField label="Total Copies" id="book-copies" error={errors.totalCopies?.message}>
                <Input id="book-copies" type="number" placeholder="1"
                  {...register('totalCopies', {
                    required: 'Required',
                    min: { value: 1, message: 'At least 1 copy' },
                    max: { value: 9999, message: 'Too many copies' },
                  })} />
              </FormField>
            </div>

            {/* Description */}
            <FormField label="Description" id="book-description" error={errors.description?.message}>
              <textarea id="book-description" rows={3}
                placeholder="Brief description of the book…"
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900
                  placeholder-gray-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                {...register('description', {
                  maxLength: { value: 1000, message: 'Description is too long' },
                })} />
            </FormField>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="book-form" loading={isSubmitting} disabled={isEditMode && !isDirty}>
            {isEditMode ? 'Save Changes' : 'Add Book'}
          </Button>
        </div>
      </div>
    </div>
  );
}
