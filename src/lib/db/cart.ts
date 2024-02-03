import { Cart, CartItem, Prisma } from '@prisma/client';
import { cookies, headers } from 'next/headers';
import prisma from './prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';

/**
 * Custom type to include product information as well as the cart
 * information.
 */
export type CartWithProducts = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

/**
 * Custom type to include product information as well as the cartItem
 * information.
 */
export type CartItemWithProducts = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

/**
 * Custom type to hold shopping cart information, will be performing
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
  const session = await getServerSession(authOptions);

  let cart: CartWithProducts | null;

  if (session) {
    cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
    });
  } else {
    const localCartId = cookies().get('localCartId')?.value;
    //This function gives the cart with the latest product data.
    //the nesting is a little confusing though.
    cart = localCartId
      ? await prisma.cart.findUnique({
          where: { id: localCartId },
          include: { items: { include: { product: true } } },
        })
      : null;
  }

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
  const session = await getServerSession(authOptions);

  let newCart: Cart;

  //Checks session if user is logged in to identify if a cart should be
  //linked to the user or anonymously
  if (session) {
    newCart = await prisma.cart.create({
      data: { userId: session.user.id },
    });
  } else {
    newCart = await prisma.cart.create({
      data: {},
    });
  }

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

export async function mergeAnonymousCartIntoUserCart(userId: string) {
  const localCartId = cookies().get('localCartId')?.value;

  // Get local Cart if not return
  const localCart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: true },
      })
    : null;

  if (!localCart) return;

  // Get user Cart.
  const userCart = await prisma.cart.findFirst({
    where: { userId: userId },
    include: { items: true },
  });

  // *** IMPORTANT by performing a "transaction" we can ensure that
  // if an error occurs within the transaction we are able to rollback
  // the data, preventing data corruption or faulty data.
  await prisma.$transaction(async (tx) => {
    if (userCart) {
      const mergedCartItems = mergeCartItems(localCart.items, userCart.items);

      // First we delete the items in the current user cart.
      await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });

      // Second we replace the items in the current user cart.
      // Nested create logic
      await tx.cart.update({
        where: { id: userCart.id },
        data: {
          items: {
            createMany: {
              data: mergedCartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });

      // Old create logic
      // await tx.cartItem.createMany({
      //   data: mergedCartItems.map((item) => ({
      //     cartId: userCart.id,
      //     productId: item.productId,
      //     quantity: item.quantity,
      //   })),
      // });
    } else {
      await tx.cart.create({
        data: {
          userId,
          items: {
            createMany: {
              data: localCart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    }

    // Third Delete local Cart.
    await tx.cart.delete({ where: { id: localCart.id } });
    // throw Error('test'); //Testing purposes only.
    cookies().set('localCartId', '');
  });
}

/**
 * Complex function to perform merging of X carts.
 * @param cartItems
 * @returns
 */
function mergeCartItems(...cartItems: CartItem[][]) {
  return cartItems.reduce((acc, items) => {
    items.forEach((item) => {
      const existingItem = acc.find((i) => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
}
