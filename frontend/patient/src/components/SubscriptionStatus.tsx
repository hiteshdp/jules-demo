// Generated via prompt: prompts/razorpay_recurring_payments_v1.md

import React, { useEffect, useState } from 'react';
import apiClient from '../store/api/apiClient';

type Subscription = {
  amount: number;
  status: 'created' | 'active' | 'cancelled' | 'failed';
  next_payment_date?: string | null;
};

const SubscriptionStatus: React.FC = () => {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/patient/subscription/status');
      setSub(data.data);
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    await apiClient.post('/patient/subscription/cancel');
    await fetchStatus();
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) return <div>Loading subscription...</div>;
  if (!sub) return <div>No subscription found.</div>;

  return (
    <div className="border rounded p-4">
      <div><strong>Amount:</strong> Rs. {(sub.amount || 0) / 100}</div>
      <div><strong>Status:</strong> {sub.status}</div>
      <div><strong>Next Payment:</strong> {sub.next_payment_date ? new Date(sub.next_payment_date).toLocaleString() : '—'}</div>
      {sub.status === 'active' && (
        <button onClick={cancelSubscription} className="mt-3 px-3 py-2 bg-red-600 text-white rounded">Cancel Subscription</button>
      )}
    </div>
  );
};

export default SubscriptionStatus;


