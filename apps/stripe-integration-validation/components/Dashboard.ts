import React, { useState, useEffect } from 'react';
import { useSupabase } from '../lib/db';
import { Stripe } from 'stripe';
import { PaymentIntent } from 'stripe';
import { Error } from '../lib/error';

interface DashboardProps {
}

const Dashboard: React.FC<DashboardProps> = () => {
  const supabase = useSupabase();
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async (amount: number, currency: string) => {
    try {
      const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY, {
        apiVersion: '2022-11-15',
      });
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ['card'],
      });
      setPaymentIntent(paymentIntent);
    } catch (error: any) {
      setError(error.message);
      throw new Error(error.message);
    }
  };

  const handleSavePayment = async (paymentIntentId: string) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          payment_intent_id: paymentIntentId,
        }]);
      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      setError(error.message);
      throw new Error(error.message);
    }
  };

  return (
    <div>
      <button onClick={() => handlePayment(1000, 'usd')}>Make Payment</button>
      {error && <Error message={error} />}
    </div>
  );
};

export default Dashboard;