import { getCart } from '@/lib/db/cart';
import React from 'react';
import CartEntry from './CartEntry';
import { setProductQuantity } from './actions';
import { formatPrice } from '@/lib/format';

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
      {!cart?.items.length && <p>Your cart is empty.</p>}
      <div className="flex flex-col items-end sm:items-center">
        <p className="mb-3 font-bold">
          Total: {formatPrice(cart?.subtotal || 0)}
        </p>
        <button className="btn btn-primary uppercase sm:w-[200px]">
          Checkout
        </button>
      </div>
    </div>
  );
}

export default page;
