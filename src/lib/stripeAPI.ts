'use server';
import { AddressParam } from '@stripe/stripe-js';
import Stripe from 'stripe';
import { createCart, getCart } from './db/cart';
import { env } from './env';
import { currency } from './format';
import { redirect } from 'next/navigation';

// This is your test secret API key.
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export type AddressValue = {
  name: string;
  firstName?: string;
  lastName?: string;
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  phone?: string;
};
/**
 * Function to create Payment Intent from stripe to start payment session.
 */
async function createPaymentIntent(paymentMethodId: string) {
  const cart = (await getCart()) ?? (await createCart());
  // Create a PaymentIntent with the order amount and currency
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cart!.subtotal,
      currency: currency.toLowerCase(),
      payment_method: paymentMethodId,
      use_stripe_sdk: true,
      // confirmation_method: 'manual',
      metadata: {
        cartID: cart!.id,
      },
    });

    return paymentIntent;
  } catch (e) {
    throw new Error(e as string);
  }
}

/**
 * Function to create Payment Intent from stripe to start payment session.
 */
async function createPaymentIntentAddress(addressInfo: AddressValue) {
  const cart = (await getCart()) ?? (await createCart());
  // // Create a PaymentIntent with the order amount and currency
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cart!.subtotal,
      currency: currency.toLowerCase(),
      use_stripe_sdk: true,
      confirmation_method: 'manual',
      metadata: {
        cartID: cart!.id,
      },
      shipping: {
        address: addressInfo.address as AddressParam,
        name: addressInfo.name,
        carrier: '',
        tracking_number: '',
      },
    });
    return paymentIntent;
  } catch (e) {
    throw new Error(e as string);
  }
}

async function updatePaymentIntent(
  paymenyIntentId: string,
  paymentMethodId: string,
) {
  const cart = (await getCart()) ?? (await createCart());
  // // Create a PaymentIntent with the order amount and currency
  try {
    const paymentIntentOptions: Stripe.PaymentIntentUpdateParams = {
      amount: cart!.subtotal,
      currency: currency.toLowerCase(),
      payment_method: paymentMethodId,
    };
    const paymentIntent = await stripe.paymentIntents.update(
      paymenyIntentId,
      paymentIntentOptions,
    );

    return paymentIntent;
  } catch (e) {
    throw new Error(e as string);
  }
}

async function updatePaymentIntentAddress(
  paymenyIntentId: string,
  paymentIntentAddress: AddressValue,
) {
  const cart = (await getCart()) ?? (await createCart());
  // Update a PaymentIntent with the order amount and currency
  try {
    const paymentIntentOptions: Stripe.PaymentIntentUpdateParams = {
      amount: cart!.subtotal,
      currency: currency.toLowerCase(),
      shipping: {
        address: paymentIntentAddress.address as AddressParam,
        name: paymentIntentAddress.name,
        carrier: '',
        tracking_number: '',
      },
    };

    const paymentIntent = await stripe.paymentIntents.update(
      paymenyIntentId,
      paymentIntentOptions,
    );

    return paymentIntent;
  } catch (e) {
    throw new Error(e as string);
  }
}

async function cancelPaymentIntent(paymenyIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.cancel(paymenyIntentId);

    return {
      client_secret: paymentIntent.client_secret,
      status: paymentIntent.status,
    };
  } catch (e) {
    throw new Error(e as string);
  }
}

/**
 * Changed this into a server action.
 * @param formData
 */
async function confirmPaymentIntent() {
  try {
    const existingPaymentIntent = await getPaymentIntent();

    if (existingPaymentIntent.data.length == 0)
      redirect('/checkout?status=failed');

    const paymentIntent = await stripe.paymentIntents.confirm(
      existingPaymentIntent.data[0].id,
    );

    if (paymentIntent) redirect('/');
  } catch (e) {
    throw new Error(e as string);
  }
}

async function listPaymentIntent() {
  try {
    let paymentIntent = await stripe.paymentIntents.list();
    let condition = paymentIntent.has_more;
    while (condition) {
      let temp = await stripe.paymentIntents.list({
        starting_after: paymentIntent.data.at(paymentIntent.data.length - 1)
          ?.id,
      });

      condition = temp.has_more;
      paymentIntent.data = [...paymentIntent.data, ...temp.data];
    }

    return {
      paymentIntent,
    };
  } catch (e) {
    throw new Error(e as string);
  }
}

async function getPaymentIntent() {
  const cart = (await getCart()) ?? (await createCart());
  // const cart = {
  //   id: '65b7334b7f929aa68a239f6c',
  // };
  /*
    According to Stripe API documents the search functionality is not
    available to merchants in India.
  */
  try {
    const paymentIntent = await stripe.paymentIntents.search({
      query: `metadata[\'cartID\']: \'${cart!.id}\' AND -status:\'canceled\' AND -status:\'succeeded\'`,
    });
    return paymentIntent;
  } catch (e) {
    throw new Error(e as string);
  }
}

export {
  cancelPaymentIntent,
  confirmPaymentIntent,
  createPaymentIntent,
  createPaymentIntentAddress,
  getPaymentIntent,
  listPaymentIntent,
  updatePaymentIntent,
  updatePaymentIntentAddress,
};
