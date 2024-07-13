'use client';
import FormButton from '@/components/FormButton';
import { AddressValue } from '@/lib/stripeAPI';
import {
  AddressElement,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import {
  StripeAddressElementOptions,
  StripeError,
  StripePaymentElementOptions,
} from '@stripe/stripe-js';
import { useState } from 'react';
import Stripe from 'stripe';

interface CheckoutFormProps {
  getPaymentIntent: () => Promise<
    Stripe.Response<Stripe.ApiSearchResult<Stripe.PaymentIntent>>
  >;
  createPaymentIntent: (
    paymentMethod: string,
    addressInfo: AddressValue,
    email: string,
  ) => Promise<Stripe.Response<Stripe.PaymentIntent>>;
  updatePaymentIntent: (
    paymenyIntentId: string,
    paymentMethodId: string,
    addressInfo: AddressValue,
    email: string,
  ) => Promise<Stripe.Response<Stripe.PaymentIntent>>;
}

function CheckoutForm({
  createPaymentIntent,
  getPaymentIntent,
  updatePaymentIntent,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements()!;

  const handleServerResponse = async (
    response: Stripe.Response<Stripe.PaymentIntent>,
  ) => {
    if (response.last_payment_error) {
      // Show error from server on payment form
    } else if (response.status === 'requires_action') {
      // Use Stripe.js to handle the required next action
      const { error, paymentIntent } = await stripe!.handleNextAction({
        clientSecret: response.client_secret as string,
      });

      if (error) {
        // Show error from Stripe.js in payment form
        setErrorMessage(error.message as string);
      } else {
        // Actions handled, show success message
        setErrorMessage('Successfully confirmed payment method.');
      }
    } else {
      // No actions needed, show success message
      setErrorMessage('Successfully confirmed payment method.');
    }
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');

  const handleError = (error: StripeError) => {
    setLoading(false);
    setErrorMessage(error.message!);
  };

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    // Create the PaymentMethod using the details collected by the Payment Element
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      elements,
    });

    //Collect address information from Address Element
    const addressInfo = (await elements.getElement('address')?.getValue())!
      .value;

    if (error) {
      // This point is only reached if there's an immediate error when
      // creating the PaymentMethod. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
      return;
    }

    // Create the PaymentIntent
    let data;
    if ((await getPaymentIntent()).data.length > 0) {
      data = await getPaymentIntent();
      data = await updatePaymentIntent(
        data.data[0].id,
        paymentMethod.id,
        addressInfo,
        customerEmail,
      );
    } else {
      data = await createPaymentIntent(
        paymentMethod.id,
        addressInfo,
        customerEmail,
      );
    }

    // Handle any next actions or errors. See the Handle any next actions step for implementation.
    handleServerResponse(data);
  };

  /**  Customisation section  **/
  const AddressElementOptions: StripeAddressElementOptions = {
    mode: 'shipping',
    display: {
      name: 'split',
    },
    fields: {
      phone: 'always',
    },
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    },
  };
  /**  Customisation section  **/

  return (
    <form
      className="flex flex-col items-end gap-3 sm:items-center"
      onSubmit={handleSubmit}
    >
      <AddressElement options={AddressElementOptions} className="w-full" />
      <LinkAuthenticationElement
        onChange={(e) => setCustomerEmail(e.value.email)}
        className="w-full"
      />
      <PaymentElement options={paymentElementOptions} className="w-full" />
      <FormButton
        type="submit"
        disabled={!stripe || loading}
        className="uppercase"
      >
        Confirm Payment Method
      </FormButton>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
}

export default CheckoutForm;
