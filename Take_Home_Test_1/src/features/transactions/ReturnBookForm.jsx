import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FormField, Input, Button, AlertBanner } from '../../shared/components/FormComponents';
import { useTransactions } from './useTransactions';
import { useAuth } from '../../contexts/AuthContext';

export default function ReturnBookForm() {
  const { user } = useAuth();
  const { returnBook, loading, success, error } = useTransactions();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const returnDateStr = watch('returnDate');
  const [finePreview, setFinePreview] = useState(0);

  // Mock checking overdue fine
  const calculateFine = (date) => {
    // Basic mock: randomly generate a fine if past a static mock due date
    const returnDate = date ? new Date(date) : new Date();
    const mockDueDate = new Date();
    mockDueDate.setDate(mockDueDate.getDate() - 5); // 5 days late
    
    if (returnDate > mockDueDate) {
      const diffTime = Math.abs(returnDate - mockDueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      setFinePreview(diffDays * 1); // $1 per day
    } else {
      setFinePreview(0);
    }
  };

  if (user?.role !== 'librarian') {
    return <div className="text-red-500">Access Denied.</div>;
  }

  const onSubmit = async (data) => {
    await returnBook(data);
  };

  return (
    <div className="mx-auto mt-6 max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Return Book</h2>
      {success && <AlertBanner type="success" message="Book returned successfully" />}
      {error && <AlertBanner type="error" message={error} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <FormField label="Transaction ID" error={errors.transactionId?.message}>
          <Input {...register('transactionId', { required: 'Transaction ID is required' })} placeholder="Enter Transaction ID" />
        </FormField>

        <FormField label="Return Date" error={errors.returnDate?.message}>
          <Input 
            type="date" 
            {...register('returnDate', { required: 'Return Date is required' })} 
            defaultValue={new Date().toISOString().split('T')[0]} 
            onChange={(e) => calculateFine(e.target.value)} 
          />
        </FormField>

        {/* Fine Preview */}
        <div className="rounded-md bg-yellow-50 p-4 shadow-sm">
          <p className="text-sm text-yellow-800">Fine Preview: <strong>${finePreview}</strong></p>
        </div>

        <Button type="submit" isLoading={loading} className="w-full">
          Return Book
        </Button>
      </form>
    </div>
  );
}
