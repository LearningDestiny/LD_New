'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

export default function PaymentHandlerButton({
  finalAmt,
  fullName,
  email,
  contact,
  stream,
  qualification,
  onPaymentSuccess
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadScript = () => {
      if (document.getElementById('razorpay-script')) return;
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onerror = () => {
        console.error('Failed to load Razorpay script.');
      };
      document.body.appendChild(script);
    };
    loadScript();
  }, []);

  const processPayment = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const orderRes = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmt, currency: 'INR' }),
      });
      const orderData = await orderRes.json();

      if (!window.Razorpay) {
        throw new Error('Razorpay script not loaded. Refresh and try again.');
      }

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: finalAmt,
        currency: 'INR',
        name: 'Learning Destiny',
        description: 'Course Enrollment Payment',
        order_id: orderData.orderId,
        handler: async (response) => {
          const verifyRes = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderCreationId: orderData.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            toast({
              title: 'Success',
              description: 'Payment completed successfully.',
            });
            onPaymentSuccess();
          } else {
            throw new Error('Payment verification failed.');
          }
        },
        prefill: {
          name: fullName,
          email,
          contact,
        },
        theme: {
          color: '#FBA758',
        },
      });

      razorpay.open();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred during payment.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // <Button onClick={processPayment} size="lg" className="w-full" disabled={loading}>
    <Button onClick={processPayment}
    className={`py-4 px-8 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </Button>
  );
}