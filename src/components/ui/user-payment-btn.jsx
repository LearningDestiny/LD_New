'use client';
import { useState, useEffect } from 'react';
import { useToast } from "../../hooks/use-toast";

const FEATURE_CONFIG = {
  Course: {
    dataFile: "courses.json",
    descriptionPrefix: "Course Enrollment"
  },
  Event: {
    dataFile: "events.json",
    descriptionPrefix: "Event Registration"
  },
  Workshop: {
    dataFile: "workshops.json",
    descriptionPrefix: "Workshop Registration"
  },
  // Add other features as needed
};
export default function PaymentHandler({
  amount,
  feature, // 'course', 'event', 'workshop', etc.
  itemId,  // courseId, eventId, workshopId
  submissionId,
  userId,
  userDetails, // { fullName, email, phone }
  id,
  onPaymentSuccess,
  onPaymentFailure
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load Razorpay script dynamically
  useEffect(() => {
    if (document.getElementById('razorpay-script')) return;
    
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onerror = () => {
      toast({
        title: 'Error',
        description: 'Failed to load payment processor',
        variant: 'destructive'
      });
    };
    document.body.appendChild(script);
    
    return () => {
      if (document.getElementById('razorpay-script')) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initiatePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Create order
      const orderRes = await fetch('/api/form/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          userId,
          itemId,
          submissionId,
          feature,
          id
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error || 'Failed to create payment order');

      // Step 2: Open Razorpay checkout
      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount * 100,
        currency: 'INR',
        name: 'Learning Destiny',
        description: orderData.description,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            // Step 3: Verify payment
            const verifyRes = await fetch('/api/form/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderCreationId: orderData.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                userId,
                itemId,
                submissionId,
                feature,
                dataFile: FEATURE_CONFIG[feature].dataFile
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error(verifyData.error);

            toast({
              title: 'Success',
              description: `${FEATURE_CONFIG[feature].descriptionPrefix} completed successfully`
            });
            onPaymentSuccess?.(verifyData);
          } catch (error) {
            console.error('Payment verification failed:', error);
            onPaymentFailure?.(error);
            toast({
              title: 'Error',
              description: error.message || 'Payment verification failed',
              variant: 'destructive'
            });
          }
        },
        prefill: {
          name: userDetails.fullName,
          email: userDetails.email,
          contact: userDetails.phone
        },
        theme: { color: '#fba758' },
        modal: {
          ondismiss: () => {
            toast({ title: 'Info', description: 'Payment window closed' });
          }
        }
      });

      razorpay.open();

    } catch (error) {
      console.error('Payment initiation failed:', error);
      onPaymentFailure?.(error);
      toast({
        title: 'Error',
        description: error.message || 'Payment processing failed',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={initiatePayment}
      disabled={loading}
      className={`px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-500 ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
}