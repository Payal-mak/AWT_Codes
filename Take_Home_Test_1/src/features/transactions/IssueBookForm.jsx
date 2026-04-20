import { useForm } from 'react-hook-form';
import { FormField, Input, Button, AlertBanner } from '../../shared/components/FormComponents';
import { useTransactions } from './useTransactions';
import { useAuth } from '../../contexts/AuthContext';

export default function IssueBookForm() {
  const { user } = useAuth();
  const { issueBook, loading, success, error } = useTransactions();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const issueDateStr = watch('issueDate');
  const issueDate = issueDateStr ? new Date(issueDateStr) : new Date();
  
  // Predict Due Date (14 days ahead)
  const predictedDueDate = new Date(issueDate);
  predictedDueDate.setDate(predictedDueDate.getDate() + 14);

  if (user?.role !== 'librarian') {
    return <div className="text-red-500">Access Denied.</div>;
  }

  const onSubmit = async (data) => {
    await issueBook(data);
  };

  return (
    <div className="mx-auto mt-6 max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Issue Book</h2>
      {success && <AlertBanner type="success" message="Book issued successfully" />}
      {error && <AlertBanner type="error" message={error} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <FormField label="User ID" error={errors.userId?.message}>
          <Input {...register('userId', { required: 'User ID is required' })} placeholder="Enter Student ID" />
        </FormField>
        
        <FormField label="Book ID" error={errors.bookId?.message}>
          <Input {...register('bookId', { required: 'Book ID is required' })} placeholder="Enter Book ID" />
        </FormField>
        
        <FormField label="Issue Date" error={errors.issueDate?.message}>
          <Input type="date" {...register('issueDate', { required: 'Issue Date is required' })} defaultValue={new Date().toISOString().split('T')[0]} />
        </FormField>

        {/* Availability Preview */}
        <div className="rounded-md bg-blue-50 p-4 shadow-sm">
          <p className="text-sm text-blue-800">Available Copies Preview: <strong>5 left</strong></p>
          <p className="mt-1 text-sm text-blue-800">
            Due Date Preview: <strong>{predictedDueDate.toISOString().split('T')[0]}</strong>
          </p>
        </div>

        <Button type="submit" isLoading={loading} className="w-full">
          Issue Book
        </Button>
      </form>
    </div>
  );
}
