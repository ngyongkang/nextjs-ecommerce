'use client';
import FormButton from '@/components/FormButton';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { StripeError, StripePaymentElementOptions } from '@stripe/stripe-js';
import { useState } from 'react';

interface CheckoutFormProps {
  createPaymentIntent: (paymentMethod: string) => Promise<{
    client_secret: string | null;
    status: string | null;
  }>;
}

// function CheckoutForm({ id }: CheckoutFormProps) {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [message, setMessage] = React.useState('');
//   const [isLoading, setIsLoading] = React.useState(true);

//   React.useEffect(() => {
//     if (!stripe) {
//       return;
//     }

//     if (!id) {
//       return;
//     }

//     stripe.retrievePaymentIntent(id).then(({ paymentIntent }) => {
//       switch (paymentIntent!.status) {
//         case 'succeeded':
//           setMessage('Payment succeeded!');
//           break;
//         case 'processing':
//           setMessage('Your payment is processing.');
//           break;
//         case 'requires_payment_method':
//           console.log(paymentIntent);
//           setMessage('Your payment was not successful, please try again.');
//           break;
//         default:
//           setMessage('Something went wrong.');
//           break;
//       }
//     });
//   }, [stripe]);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     if (!stripe || !elements) {
//       // Stripe.js hasn't yet loaded.
//       // Make sure to disable form submission until Stripe.js has loaded.
//       return;
//     }

//     setIsLoading(true);

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         // Make sure to change this to your payment completion page
//         return_url: 'http://localhost:3000',
//       },
//     });

//     // This point will only be reached if there is an immediate error when
//     // confirming the payment. Otherwise, your customer will be redirected to
//     // your `return_url`. For some payment methods like iDEAL, your customer will
//     // be redirected to an intermediate site first to authorize the payment, then
//     // redirected to the `return_url`.
//     if (error.type === 'card_error' || error.type === 'validation_error') {
//       setMessage(error.message!);
//     } else {
//       setMessage('An unexpected error occurred.');
//     }

//     setIsLoading(false);
//   };

//   const paymentElementOptions: StripePaymentElementOptions = {
//     layout: 'accordion',
//   };

//   const addressElementOPtions: StripeAddressElementOptions = {
//     mode: 'shipping',
//   };

//   return (
//     <form id="payment-form" onSubmit={handleSubmit}>
//       {/* {stripe && elements ? ( */}
//       <div className="flex flex-col gap-2">
//         <PaymentElement
//           id="payment-element"
//           options={paymentElementOptions}
//           // onReady={() => setIsLoading(false)}
//         />
//         <AddressElement options={addressElementOPtions} />
//         <button
//           className={`${isLoading ? 'hidden' : ''} btn btn-primary uppercase`}
//           // disabled={isLoading || !stripe || !elements}
//           id="submit"
//         >
//           Confirm Payment Method
//         </button>
//       </div>
//       {/* ) : ( */}
//       {/* <div className="loading loading-spinner"></div> */}
//       {/* )} */}
//       {/* Show any error or success messages */}
//       {message && <div id="payment-message">{message}</div>}
//     </form>
//   );
// }

function CheckoutForm({ createPaymentIntent }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements()!;

  const handleServerResponse = async (response: any) => {
    if (response.error) {
      // Show error from server on payment form
    } else if (response.status === 'requires_action') {
      // Use Stripe.js to handle the required next action
      const { error, paymentIntent } = await stripe!.handleNextAction({
        clientSecret: response.clientSecret,
      });

      if (error) {
        // Show error from Stripe.js in payment form
      } else {
        // Actions handled, show success message
      }
    } else {
      // No actions needed, show success message
    }
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

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

    if (error) {
      // This point is only reached if there's an immediate error when
      // creating the PaymentMethod. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
      return;
    }

    // Create the PaymentIntent
    const data = await createPaymentIntent(paymentMethod.id);

    // Handle any next actions or errors. See the Handle any next actions step for implementation.
    handleServerResponse(data);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'accordion',
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <PaymentElement options={paymentElementOptions} />
      <FormButton disabled={!stripe || loading} className="btn-block uppercase">
        Confirm Payment Method
      </FormButton>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
}

export default CheckoutForm;
