'use server';
import Stripe from 'stripe';
import { createCart, getCart } from './db/cart';
import { env } from './env';
import { currency } from './format';

// This is your test secret API key.
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

/**
 * Function to create Payment Intent from stripe to start payment session.
 */
async function createPaymentIntent(paymentMethodId: string) {
  const cart = (await getCart()) ?? (await createCart());
  // // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: cart!.subtotal,
    currency: currency.toLowerCase(),
    payment_method: paymentMethodId,
    use_stripe_sdk: true,
    confirmation_method: 'manual',
  });

  return {
    client_secret: paymentIntent.client_secret,
    status: paymentIntent.status,
  };
}

async function updatePaymentIntent(
  paymenyIntentId: string,
  paymentMethodId: string,
) {
  const cart = (await getCart()) ?? (await createCart());
  // // Create a PaymentIntent with the order amount and currency
  const paymentIntentOptions: Stripe.PaymentIntentUpdateParams = {
    amount: cart!.subtotal,
    currency: currency.toLowerCase(),
    payment_method: paymentMethodId,
  };
  const paymentIntent = await stripe.paymentIntents.update(
    paymenyIntentId,
    paymentIntentOptions,
  );

  return {
    client_secret: paymentIntent.client_secret,
    status: paymentIntent.status,
  };
}

async function cancelPaymentIntent(paymenyIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.cancel(paymenyIntentId);

  return {
    client_secret: paymentIntent.client_secret,
    status: paymentIntent.status,
  };
}

async function confirmPaymentIntent(paymenyIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.confirm(paymenyIntentId);

  return {
    client_secret: paymentIntent.client_secret,
    status: paymentIntent.status,
  };
}

async function listPaymentIntent() {
  let paymentIntent = await stripe.paymentIntents.list();
  let condition = paymentIntent.has_more;
  while (condition) {
    let temp = await stripe.paymentIntents.list({
      starting_after: paymentIntent.object,
    });

    condition = temp.has_more;
    paymentIntent.data = [...paymentIntent.data, ...temp.data];
  }

  return {
    paymentIntent,
  };
}

export {
  createPaymentIntent,
  updatePaymentIntent,
  cancelPaymentIntent,
  confirmPaymentIntent,
  listPaymentIntent,
};
