import { Prisma } from '@prisma/client';
import { cookies, headers } from 'next/headers';
import prisma from './prisma';

/**
 * Custom type to include product information as well as the cart
 * information.
 */
export type CartWithProducts = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

/**
 * Custom type to hold shopping cart infomration, will be performing
 * an __intersection__ to combine two types to form the final type.
 */
export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

/**
 * Function to get current shopping cart.
 * @returns
 */
export async function getCart(): Promise<ShoppingCart | null> {
  const localCartId = cookies().get('localCartId')?.value;
  //This function gives the cart with the latest product data.
  //the nesting is a little confusing though.
  const cart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: { include: { product: true } } },
      })
    : null;

  if (!cart) {
    return null;
  }

  return {
    ...cart,
    size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    ),
  };
}

/**
 * Function to create a new shopping cart.
 * @returns
 */
export async function createCart(): Promise<ShoppingCart | null> {
  const newCart = await prisma.cart.create({
    data: {},
  });

  //Note: Needs encryption + secure settings in real production app.
  const protocol = headers().get('x-forwarded-proto')!;

  if (protocol.includes('https'))
    cookies().set('localCartId', newCart.id, { secure: true });
  else cookies().set('localCartId', newCart.id);

  return {
    ...newCart,
    items: [],
    size: 0,
    subtotal: 0,
  };
}
