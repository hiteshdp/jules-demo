// Generated via prompt: prompts/razorpay_recurring_payments_v1.md

import React, { useEffect, useState } from 'react';
import apiClient from '../store/api/apiClient';

type Subscription = {
  amount: number;
  status: 'created' | 'active' | 'cancelled' | 'failed';
  next_payment_date?: string | null;
  next_billing_date?: string | null;
  payment_id?: string | null;
  razorpay_subscription_id?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
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

  const formatAmount = (amount: number) => {
    return `₹${(amount / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border rounded p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Subscription Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <strong className="text-gray-600">Amount:</strong>
          <span className="ml-2 text-lg font-semibold text-green-600">
            {formatAmount(sub.amount || 0)}
          </span>
        </div>
        
        <div>
          <strong className="text-gray-600">Status:</strong>
          <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
            sub.status === 'active' ? 'bg-green-100 text-green-800' :
            sub.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            sub.status === 'failed' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {sub.status.toUpperCase()}
          </span>
        </div>
        
        {sub.payment_id && (
          <div>
            <strong className="text-gray-600">Payment ID:</strong>
            <span className="ml-2 font-mono text-sm text-gray-700">
              {sub.payment_id}
            </span>
          </div>
        )}
        
        {sub.razorpay_subscription_id && (
          <div>
            <strong className="text-gray-600">Subscription ID:</strong>
            <span className="ml-2 font-mono text-sm text-gray-700">
              {sub.razorpay_subscription_id}
            </span>
          </div>
        )}
        
        {sub.starts_at && (
          <div>
            <strong className="text-gray-600">Start Date:</strong>
            <span className="ml-2 text-gray-700">
              {formatDate(sub.starts_at)}
            </span>
          </div>
        )}
        
        {sub.ends_at && (
          <div>
            <strong className="text-gray-600">End Date:</strong>
            <span className="ml-2 text-gray-700">
              {formatDate(sub.ends_at)}
            </span>
          </div>
        )}
        
        {sub.next_payment_date && (
          <div>
            <strong className="text-gray-600">Next Payment:</strong>
            <span className="ml-2 text-gray-700">
              {formatDate(sub.next_payment_date)}
            </span>
          </div>
        )}
        
        {sub.next_billing_date && (
          <div>
            <strong className="text-gray-600">Next Billing:</strong>
            <span className="ml-2 text-gray-700">
              {formatDate(sub.next_billing_date)}
            </span>
          </div>
        )}
      </div>
      
      {sub.status === 'active' && (
        <div className="mt-4 pt-4 border-t">
          <button 
            onClick={cancelSubscription} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Cancel Subscription
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;


