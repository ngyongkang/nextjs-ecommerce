import CartEntry from '@/app/cart/CartEntry';
import { setProductQuantity } from '@/app/cart/actions';
import FormButton from '@/components/FormButton';
import { getCart } from '@/lib/db/cart';
import { formatPrice } from '@/lib/format';
import {
  cancelPaymentIntent,
  confirmPaymentIntent,
  createPaymentIntent,
  getPaymentIntent,
  updatePaymentIntent,
} from '@/lib/stripeAPI';
import CheckoutForm from './CheckoutForm';
import StripeWrapper from './StripeWrapper';

type Props = {};

async function page({}: Props) {
  const cart = await getCart();
  if (cart!.subtotal <= 0) {
    const paymentIntents = await getPaymentIntent();
    paymentIntents.data.map((paymentIntent) => {
      cancelPaymentIntent(paymentIntent.id);
    });
    return <div>Cannot checkout with 0 items!!</div>;
  }
  return (
    <div className="join join-vertical w-full">
      <div className="collapse join-item collapse-plus border border-base-300">
        <input type="radio" name="my-accordion-4" />
        <div className="collapse-title text-xl font-medium">
          Payment methods
        </div>
        <div className="collapse-content">
          <StripeWrapper subtotal={cart!.subtotal}>
            <CheckoutForm
              createPaymentIntent={createPaymentIntent}
              getPaymentIntent={getPaymentIntent}
              updatePaymentIntent={updatePaymentIntent}
            />
          </StripeWrapper>
        </div>
      </div>
      <div className="collapse join-item collapse-plus border border-base-300">
        <input type="radio" name="my-accordion-4" defaultChecked />
        <div className="collapse-title text-xl font-medium">
          Review items and delivery
        </div>
        <div className="collapse-content">
          {cart?.items.map((cartItem) => {
            return (
              <CartEntry
                cartItem={cartItem}
                key={cartItem.id}
                setProductQuantity={setProductQuantity}
              />
            );
          })}
          <div className="flex flex-col items-end sm:items-center">
            <p className="mb-3 font-bold">
              Total: {formatPrice(cart?.subtotal || 0)}
            </p>
            {/* Optional: Setup Stripe payment method for checkout. */}
            <form action={confirmPaymentIntent}>
              <FormButton className="btn-block uppercase">
                Confirm Order
              </FormButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
