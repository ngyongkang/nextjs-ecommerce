import FormButton from '@/components/FormButton';
import { getCart } from '@/lib/db/cart';
import { formatPrice } from '@/lib/format';
import CartEntry from './CartEntry';
import { redirectCheckout, setProductQuantity } from './actions';

type Props = {};

export const metadata = {
  title: 'Your Cart - Stick & Treat',
};

async function page({}: Props) {
  const cart = await getCart();
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
      {cart?.items.map((cartItem) => {
        return (
          <CartEntry
            cartItem={cartItem}
            key={cartItem.id}
            setProductQuantity={setProductQuantity}
          />
        );
      })}
      {!cart?.items.length ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="flex flex-col items-end sm:items-center">
          <p className="mb-3 font-bold">
            Total: {formatPrice(cart?.subtotal || 0)}
          </p>
          {/* Optional: Setup Stripe payment method for checkout. */}
          <form action={redirectCheckout}>
            <FormButton className="btn-block uppercase">Checkout</FormButton>
          </form>
        </div>
      )}
    </div>
  );
}

export default page;
