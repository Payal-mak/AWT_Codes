import { useState } from 'react';

export function useTransactions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Mocked for frontend design step
  const issueBook = async (data) => {
    setLoading(true); setError(null); setSuccess(false);
    return new Promise((resolve) => setTimeout(() => {
      setLoading(false); setSuccess(true); resolve();
    }, 500));
  };

  const renewBook = async (data) => {
    setLoading(true); setError(null); setSuccess(false);
    return new Promise((resolve) => setTimeout(() => {
      setLoading(false); setSuccess(true); resolve();
    }, 500));
  };

  const returnBook = async (data) => {
    setLoading(true); setError(null); setSuccess(false);
    return new Promise((resolve) => setTimeout(() => {
      setLoading(false); setSuccess(true); resolve();
    }, 500));
  };

  return { issueBook, renewBook, returnBook, loading, error, success };
}
