import { RedirectType, redirect } from 'next/navigation';
import React from 'react';
import prisma from '@/lib/db/prisma';
import FormButton from '@/components/FormButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

type Props = {};

export const metadata = {
  title: 'Add Product - Stick & Treat',
};

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

  const session = await getServerSession(authOptions);
  const user = session?.user;

  //Validates if a user is currently logged in.
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/add-product');
  }

  //Validates if a user is admin
  if (user?.email != 'nyk.com.sg@gmail.com') {
    redirect('/unauthorised');
  }

  const name = formData.get('name')?.toString();
  const description = formData.get('description')?.toString();
  const imageUrl = formData.get('imageUrl')?.toString();
  const price = Number(formData.get('price') || 0);

  if (!name || !description || !imageUrl || !price)
    throw Error('Missing required fields');

  await prisma?.product.create({
    data: { name, description, imageUrl, price },
  });

  redirect('/');
}

export default async function page({}: Props) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  //Validates if a user is currently logged in.
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/add-product');
  }

  //Validates if a user is admin
  if (user?.email != 'nyk.com.sg@gmail.com') {
    redirect('/unauthorised');
  }

  return (
    <div>
      <h1 className="mb-3 text-lg font-bold">Add product</h1>
      <form action={addProduct}>
        <input
          required
          name="name"
          placeholder="Name"
          className="input input-bordered mb-3 w-full"
        />
        <textarea
          required
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered mb-3 w-full"
        />
        <input
          required
          name="imageUrl"
          placeholder="Image Url"
          type="url"
          className="input input-bordered mb-3 w-full"
        />
        <input
          required
          name="price"
          placeholder="Price"
          type="number"
          min="0"
          className="input input-bordered mb-3 w-full"
        />
        <FormButton className="btn-block">Add Product</FormButton>
      </form>
    </div>
  );
}
