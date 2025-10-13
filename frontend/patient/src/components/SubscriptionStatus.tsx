// Generated via prompt: prompts/razorpay_dynamic_payment_pages_v1.md

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchSubscriptionStatus, cancelSubscription } from '../store/slices/subscriptionSlice';
import toast from 'react-hot-toast';
import { formatDateTime } from '../utils/dateUtils';

const SubscriptionStatus: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { subscription, loading } = useSelector((state: RootState) => state.subscription);

  useEffect(() => {
    dispatch(fetchSubscriptionStatus());
  }, [dispatch]);

  const handleCancelSubscription = () => {
    dispatch(cancelSubscription())
      .unwrap()
      .then(() => {
        toast.success('Subscription cancelled successfully!');
        dispatch(fetchSubscriptionStatus());
      })
      .catch((error) => {
        toast.error(error || 'Failed to cancel subscription');
      });
  };

  if (loading) return <div>Loading subscription...</div>;
  if (!subscription) return <div>No subscription found.</div>;

  const formatAmount = (amount: number) => {
    return `₹${(amount / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return formatDateTime(dateString);
  };

  return (
    <div className="border rounded p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Subscription Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <strong className="text-gray-600">Amount:</strong>
          <span className="ml-2 text-lg font-semibold text-green-600">
            {formatAmount(subscription.amount || 0)}
          </span>
        </div>
        
        <div>
          <strong className="text-gray-600">Status:</strong>
          <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
            subscription.status === 'active' ? 'bg-green-100 text-green-800' :
            subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            subscription.status === 'failed' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {subscription.status.toUpperCase()}
          </span>
        </div>
        
        {subscription.payment_id && (
          <div>
            <strong className="text-gray-600">Payment ID:</strong>
            <span className="ml-2 font-mono text-sm text-gray-700">
              {subscription.payment_id}
            </span>
          </div>
        )}
        
        {subscription.razorpay_subscription_id && (
          <div>
            <strong className="text-gray-600">Subscription ID:</strong>
            <span className="ml-2 font-mono text-sm text-gray-700">
              {subscription.razorpay_subscription_id}
            </span>
          </div>
        )}
        
        {subscription.starts_at && (
          <div>
            <strong className="text-gray-600">Start Date:</strong>
            <span className="ml-2 text-gray-700">
              {formatDate(subscription.starts_at)}
            </span>
          </div>
        )}
        
        {subscription.ends_at && (
          <div>
            <strong className="text-gray-600">End Date:</strong>
            <span className="ml-2 text-gray-700">
              {formatDate(subscription.ends_at)}
            </span>
          </div>
        )}
        
        {subscription.next_payment_date && (
          <div>
            <strong className="text-gray-600">Next Payment:</strong>
            <span className="ml-2 text-gray-700">
              {formatDate(subscription.next_payment_date)}
            </span>
          </div>
        )}
        
        {subscription.next_billing_date && (
          <div>
            <strong className="text-gray-600">Next Billing:</strong>
            <span className="ml-2 text-gray-700">
              {formatDate(subscription.next_billing_date)}
            </span>
          </div>
        )}
      </div>
      
      {subscription.status === 'active' && (
        <div className="mt-4 pt-4 border-t">
          <button 
            onClick={handleCancelSubscription} 
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


