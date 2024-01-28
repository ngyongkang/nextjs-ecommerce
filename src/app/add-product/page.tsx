import { redirect } from 'next/navigation';
import React from 'react';
import prisma from '@/lib/db/prisma';
import FormButton from '@/components/FormButton';

type Props = {};

export const metadata = {
  title: 'Add Product - Stick & Treat',
};

//Server function
async function addProduct(formData: FormData) {
  'use server';

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

export default function page({}: Props) {
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
