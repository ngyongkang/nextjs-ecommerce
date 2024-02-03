'use client';
import { currency } from '@/lib/format';
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import React from 'react';

type Props = { subtotal: number; children: React.ReactNode };

let stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string,
);

function StripeWrapper({ subtotal, children }: Props) {
  // Settings to state what kind of payment intent we will be doing.
  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: subtotal,
    currency: currency.toLowerCase(),
    paymentMethodCreation: 'manual',
    // Fully customizable with appearance API.
    appearance: {
      theme: 'stripe',
    },
  };
  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}

export default StripeWrapper;
