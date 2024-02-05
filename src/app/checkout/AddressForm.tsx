'use client';
import FormButton from '@/components/FormButton';
import { AddressValue } from '@/lib/stripeAPI';
import {
  AddressElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { StripeAddressElementOptions, StripeError } from '@stripe/stripe-js';
import { useState, useTransition } from 'react';
import Stripe from 'stripe';

interface AddressFormProps {
  getPaymentIntent: () => Promise<
    Stripe.Response<Stripe.ApiSearchResult<Stripe.PaymentIntent>>
  >;
  createPaymentIntentAddress: (
    addressInfo: AddressValue,
  ) => Promise<Stripe.Response<Stripe.PaymentIntent>>;
  updatePaymentIntentAddress: (
    paymenyIntentId: string,
    paymentIntentAddress: AddressValue,
  ) => Promise<Stripe.Response<Stripe.PaymentIntent>>;
}

function AddressForm({
  createPaymentIntentAddress,
  getPaymentIntent,
  updatePaymentIntentAddress,
}: AddressFormProps) {
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
        setErrorMessage('Successfully confirmed shipping address.');
      }
    } else {
      // No actions needed, show success message
      setErrorMessage('Successfully confirmed shipping address.');
    }
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

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

    const addressInfo = (await elements.getElement('address')?.getValue())!
      .value;

    // if (error) {
    //   // This point is only reached if there's an immediate error when
    //   // creating the PaymentMethod. Show the error to your customer (for example, payment details incomplete)
    //   handleError(error);
    //   return;
    // }

    // Get the PaymentIntent first before creating the PaymentIntent
    let data;

    if ((await getPaymentIntent()).data.length > 0) {
      data = await getPaymentIntent();
      data = await updatePaymentIntentAddress(data.data[0].id, addressInfo);
    } else {
      data = await createPaymentIntentAddress(addressInfo);
    }

    // Handle any next actions or errors. See the Handle any next actions step for implementation.
    handleServerResponse(data);
  };
  const AddressElementOptions: StripeAddressElementOptions = {
    mode: 'shipping',
  };

  return (
    <form
      className="flex flex-col items-end gap-3 sm:items-center"
      onSubmit={(e) =>
        startTransition(async () => {
          handleSubmit(e);
        })
      }
    >
      <AddressElement options={AddressElementOptions} className="w-full" />
      <FormButton
        type="submit"
        disabled={!stripe || loading}
        className="uppercase "
      >
        Confirm Address
      </FormButton>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
}

export default AddressForm;
