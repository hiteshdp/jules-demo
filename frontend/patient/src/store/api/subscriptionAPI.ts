// Generated via prompt: prompts/razorpay_dynamic_payment_pages_v1.md

import apiClient from './apiClient';

export interface Subscription {
  id: number;
  user_id: number;
  amount: number;
  status: 'created' | 'active' | 'cancelled' | 'failed';
  razorpay_subscription_id?: string;
  razorpay_plan_id?: string;
  payment_id?: string;
  next_payment_date?: string;
  next_billing_date?: string;
  starts_at?: string;
  ends_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export const subscriptionAPI = {
  // Create subscription
  createSubscription: () =>
    apiClient.post('/patient/subscription/create'),
  
  // Verify payment
  verifyPayment: (paymentData: any) =>
    apiClient.post('/patient/subscription/verify', paymentData),
  
  // Get subscription status
  getSubscriptionStatus: () =>
    apiClient.get('/patient/subscription/status'),
  
  // Cancel subscription
  cancelSubscription: () =>
    apiClient.post('/patient/subscription/cancel'),
};
