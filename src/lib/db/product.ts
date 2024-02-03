import prisma from '@/lib/db/prisma';
import Stripe from 'stripe';
import { env } from '@/lib/env';
import { authOptions } from '@/app/utils/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { currency } from '../format';

/**
 * Function to perform __Server Action__ on Next JS, this function
 * allows the usage of a form action which sends data via server instead
 * of sending data via client. This helps to move the processing to backend
 * as well as cut out code on the clientside such as fetching data from
 * an api.
 * @param formData - param to pass formData to backend.
 */
async function addProduct(formData: FormData) {
  'use server';
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const session = await getServerSession(authOptions);
  const user = session?.user;

  //Validates if a user is currently logged in.
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/add-product');
  }

  //Validates if a user is admin
  if (user?.type != 'Admin') {
    redirect('/');
  }

  const name = formData.get('name')?.toString();
  const description = formData.get('description')?.toString();
  const imageUrl = formData.get('imageUrl')?.toString();
  const price = Number(formData.get('price') || 0);

  if (!name || !description || !imageUrl || !price)
    throw Error('Missing required fields');

  //   await prisma?.product.create({
  //     data: { name, description, imageUrl, price },
  //   });

  await prisma.$transaction(async (tx) => {
    //First create product in prisma to save data in database.
    let stripeObject = await stripe.products.create({
      name: name,
      images: [imageUrl],
      description: description,
      default_price_data: {
        unit_amount: price,
        currency: currency,
      },
      expand: ['default_price'],
    });

    // Set stripe object in database as well to tally information.
    await tx.product.create({
      data: { name, description, imageUrl, price },
    });
  });

  redirect('/');
}

export { addProduct };
