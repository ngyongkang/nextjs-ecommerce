import { getCart } from '@/lib/db/cart';
import CheckoutForm from './CheckoutForm';
import StripeWrapper from './StripeWrapper';
import CartEntry from '@/app/cart/CartEntry';
import { setProductQuantity } from '@/app/cart/actions';
import { formatPrice } from '@/lib/format';
import FormButton from '@/components/FormButton';
import { createPaymentIntent } from '@/lib/stripeAPI';

type Props = {};

async function page({}: Props) {
  const cart = await getCart();
  return (
    <StripeWrapper subtotal={cart!.subtotal}>
      {' '}
      <div className="join join-vertical w-full">
        <div className="collapse join-item collapse-plus border border-base-300">
          <input type="radio" name="my-accordion-4" />
          <div className="collapse-title text-xl font-medium">
            Click to open this one and close others
          </div>
          <div className="collapse-content"></div>
        </div>
        <div className="collapse join-item collapse-plus border border-base-300">
          <input type="radio" name="my-accordion-4" />
          <div className="collapse-title text-xl font-medium">
            Payment methods
          </div>
          <div className="collapse-content">
            <CheckoutForm createPaymentIntent={createPaymentIntent} />
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
              <form action={'#'}>
                <FormButton className="btn-block uppercase">
                  Confirm Order
                </FormButton>
              </form>
            </div>
          </div>
        </div>
      </div>
    </StripeWrapper>
  );
}

export default page;
