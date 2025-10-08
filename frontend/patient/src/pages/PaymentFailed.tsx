// Generated via prompt: prompts/razorpay_dynamic_payment_pages_v1.md

import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import PaymentFailedComponent from '../components/PaymentFailed';

const PaymentFailed: React.FC = () => {
  const location = useLocation();
  const state = location.state as any;

  // Redirect if no error data
  if (!state?.errorData || state?.type !== 'failed') {
    return <Navigate to="/subscription" replace />;
  }

  return <PaymentFailedComponent errorData={state.errorData} />;
};

export default PaymentFailed;
