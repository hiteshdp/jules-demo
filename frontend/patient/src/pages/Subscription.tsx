// Generated via prompt: prompts/razorpay_subscription_nav_v1.md

import React from 'react';
import SubscribeButton from '../components/SubscribeButton';
import SubscriptionStatus from '../components/SubscriptionStatus';

const Subscription: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Subscription</h1>
      <div className="mb-6">
        <SubscribeButton />
      </div>
      <SubscriptionStatus />
    </div>
  );
};

export default Subscription;


