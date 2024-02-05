'use server';

import { createCart, getCart } from '@/lib/db/cart';
import prisma from '@/lib/db/prisma';
import { getPaymentIntent, updatePaymentIntent } from '@/lib/stripeAPI';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function setProductQuantity(productId: string, quantity: number) {
  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart?.items.find(
    (item) => item.productId === productId,
  );

  if (quantity === 0) {
    //Delete logic
    if (articleInCart) {
      //Converting to a nested query to the db.
      //This allows us to retain the update time on the cart.
      //While deleting the cartItem as previously done.
      await prisma.cart.update({
        where: { id: cart!.id },
        data: { items: { delete: { id: articleInCart.id } } },
      });

      // Old logic on delete
      // await prisma.cartItem.delete({
      //   where: { id: articleInCart.id },
      // });
    }
  } else {
    //Update logic
    if (articleInCart) {
      //Nested query for update.
      await prisma.cart.update({
        where: { id: cart!.id },
        data: {
          items: {
            update: {
              where: { id: articleInCart.id },
              data: { quantity },
            },
          },
        },
      });

      //Old logic for update
      // await prisma.cartItem.update({
      //   where: { id: articleInCart.id },
      //   data: { quantity },
      // });
    } else {
      //Create logic

      // Nested query for create logic.
      await prisma.cart.update({
        where: { id: cart!.id },
        data: {
          items: {
            create: {
              productId,
              quantity,
            },
          },
        },
      });

      // Old create logic
      // await prisma.cartItem.create({
      //   data: { cartId: cart!.id, productId, quantity },
      // });
    }
  }

  const paymentIntent = await getPaymentIntent();

  if (paymentIntent.data.length > 0) {
    const cart = (await getCart()) ?? (await createCart());
    if (cart!.size > 0) await updatePaymentIntent(paymentIntent.data[0].id);
  }

  revalidatePath('/cart');
}

async function redirectCheckout() {
  redirect('/checkout');
}

export { setProductQuantity, redirectCheckout };
