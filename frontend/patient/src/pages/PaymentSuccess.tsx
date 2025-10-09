// Generated via prompt: prompts/razorpay_dynamic_payment_pages_v1.md

import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import PaymentSuccessComponent from '../components/PaymentSuccess';

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const state = location.state as any;

  // Redirect if no subscription data
  if (!state?.subscriptionData || state?.type !== 'success') {
    return <Navigate to="/subscription" replace />;
  }

  return <PaymentSuccessComponent subscriptionData={state.subscriptionData} />;
};

export default PaymentSuccess;
