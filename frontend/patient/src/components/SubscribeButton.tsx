// Generated via prompt: prompts/razorpay_dynamic_payment_pages_v1.md

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { createSubscription, verifyPayment } from '../store/slices/subscriptionSlice';
import { useRazorpay } from '../hooks/useRazorpay';
import { Button, message } from 'antd';

const SubscribeButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoaded } = useRazorpay();
  const { paymentLoading, paymentError } = useSelector((state: RootState) => state.subscription);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!isLoaded) {
      message.error('Razorpay not loaded yet. Please try again.');
      return;
    }

    setLoading(true);
    try {
      // Create subscription using Redux
      const createResult = await dispatch(createSubscription()).unwrap();
      const { key, subscription_id } = createResult;

      const options: any = {
        key,
        subscription_id,
        name: 'Hair Health Subscription',
        description: 'Monthly Plan Rs. 500',
        handler: async (response: any) => {
          try {
            // Verify payment using Redux
            const verifyResult = await dispatch(verifyPayment(response)).unwrap();
            
            if (verifyResult.success) {
              // Navigate to success page with subscription data
              navigate('/payment-success', { 
                state: { 
                  subscriptionData: verifyResult.data,
                  type: 'success'
                } 
              });
            } else {
              // Navigate to failure page with error data
              navigate('/payment-failed', { 
                state: { 
                  errorData: {
                    message: verifyResult.message || 'Payment verification failed',
                    error: verifyResult.error,
                    code: verifyResult.code
                  },
                  type: 'failed'
                } 
              });
            }
          } catch (error: any) {
            // Navigate to failure page with error data
            navigate('/payment-failed', { 
              state: { 
                errorData: {
                  message: 'Payment verification failed',
                  error: error || 'An error occurred while verifying your payment',
                  code: 'VERIFICATION_ERROR',
                  details: 'An error occurred while verifying your payment'
                },
                type: 'failed'
              } 
            });
          }
        },
        modal: {
          ondismiss: () => {
            message.info('Payment cancelled by user');
          }
        },
        theme: { color: '#3399cc' },
      };

      new (window as any).Razorpay(options).open();
    } catch (error: any) {
      message.error(paymentError || 'Failed to create subscription. Please try again.');
      console.error('Subscription creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      type="primary" 
      size="large"
      onClick={handleSubscribe}
      loading={loading || paymentLoading}
      className="px-6 py-2"
    >
      {loading || paymentLoading ? 'Creating Subscription...' : 'Subscribe Now - ₹500/month'}
    </Button>
  );
};

export default SubscribeButton;


