// Generated via prompt: prompts/razorpay_recurring_payments_v1.md

import React from 'react';
import apiClient from '../store/api/apiClient';
import { useRazorpay } from '../hooks/useRazorpay';

const SubscribeButton: React.FC = () => {
  const { isLoaded } = useRazorpay();

  const handleSubscribe = async () => {
    if (!isLoaded) {
      alert('Razorpay not loaded yet');
      return;
    }

    const { data } = await apiClient.post('/patient/subscription/create');
    const { key, subscription_id } = data.data;

    const options: any = {
      key,
      subscription_id,
      name: 'Hair Health Subscription',
      description: 'Monthly Plan Rs. 500',
      handler: async (response: any) => {
        await apiClient.post('/patient/subscription/verify', response);
      },
      theme: { color: '#3399cc' },
    };

    new (window as any).Razorpay(options).open();
  };

  return (
    <button onClick={handleSubscribe} className="px-4 py-2 bg-blue-600 text-white rounded">
      Subscribe Now
    </button>
  );
};

export default SubscribeButton;


