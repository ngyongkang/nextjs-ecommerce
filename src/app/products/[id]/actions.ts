'use server';

import { createCart, getCart } from '@/lib/db/cart';
import prisma from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function incrementProductQuantity(productId: string) {
  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart?.items.find(
    (item) => item.productId === productId,
  );

  if (articleInCart) {
    // Nested update logic
    await prisma.cart.update({
      where: { id: cart!.id },
      data: {
        items: {
          update: {
            where: { id: articleInCart.id },
            data: { quantity: { increment: 1 } },
          },
        },
      },
    });

    // Old update logic
    // await prisma.cartItem.update({
    //   where: { id: articleInCart.id },
    //   data: { quantity: { increment: 1 } },
    // });
  } else {
    // Nested create logic
    await prisma.cart.update({
      where: { id: cart!.id },
      data: {
        items: {
          create: {
            productId,
            quantity: 1,
          },
        },
      },
    });

    // Old create logic
    // await prisma.cartItem.create({
    //   data: { cartId: cart!.id, productId, quantity: 1 },
    // });
  }

  // Had an issue where I was loading a dynamic path should use the path only.
  revalidatePath('/products/[id]', 'page');
}
