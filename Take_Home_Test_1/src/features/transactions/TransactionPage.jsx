import { useState } from 'react';
import IssueBookForm from './IssueBookForm';
import RenewBookForm from './RenewBookForm';
import ReturnBookForm from './ReturnBookForm';

export default function TransactionPage() {
  const [activeTab, setActiveTab] = useState('issue');

  return (
    <div className="p-8 mx-auto max-w-7xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Manage Transactions</h1>
      
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('issue')}
            className={`${activeTab === 'issue' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Issue Book
          </button>
          <button
            onClick={() => setActiveTab('renew')}
            className={`${activeTab === 'renew' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Renew Book
          </button>
          <button
            onClick={() => setActiveTab('return')}
            className={`${activeTab === 'return' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Return Book
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'issue' && <IssueBookForm />}
        {activeTab === 'renew' && <RenewBookForm />}
        {activeTab === 'return' && <ReturnBookForm />}
      </div>
    </div>
  );
}
