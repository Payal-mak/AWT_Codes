import { useForm } from 'react-hook-form';
import { FormField, Input, Button, AlertBanner } from '../../shared/components/FormComponents';
import { useTransactions } from './useTransactions';
import { useAuth } from '../../contexts/AuthContext';

export default function RenewBookForm() {
  const { user } = useAuth();
  const { renewBook, loading, success, error } = useTransactions();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  if (user?.role !== 'librarian') {
    return <div className="text-red-500">Access Denied.</div>;
  }

  const onSubmit = async (data) => {
    await renewBook(data);
  };

  return (
    <div className="mx-auto mt-6 max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Renew Book</h2>
      {success && <AlertBanner type="success" message="Book renewed successfully" />}
      {error && <AlertBanner type="error" message={error} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <FormField label="Transaction ID" error={errors.transactionId?.message}>
          <Input {...register('transactionId', { required: 'Transaction ID is required' })} placeholder="Enter Transaction ID" />
        </FormField>

        <FormField label="New Due Date" error={errors.newDueDate?.message}>
          <Input type="date" {...register('newDueDate', { required: 'New Due Date is required' })} />
        </FormField>

        {/* Extended Due Date Preview */}
        <div className="rounded-md bg-green-50 p-4 shadow-sm">
          <p className="text-sm text-green-800">Preview: Extending due date by selected days</p>
        </div>

        <Button type="submit" isLoading={loading} className="w-full">
          Renew Book
        </Button>
      </form>
    </div>
  );
}
