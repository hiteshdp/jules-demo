// Generated via prompt: prompts/razorpay_recurring_payments_v1.md

import { useEffect, useState } from 'react';

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if ((window as any).Razorpay) {
      setIsLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setIsLoaded(false);
    document.body.appendChild(script);
    return () => {
      // no cleanup required for external script
    };
  }, []);

  return { isLoaded };
}


