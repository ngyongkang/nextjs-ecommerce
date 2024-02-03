import { redirect } from 'next/navigation';
import React from 'react';
import FormButton from '@/components/FormButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import { addProduct } from '@/lib/db/product';
type Props = {};

export const metadata = {
  title: 'Add Product - Stick & Treat',
};

export default async function page({}: Props) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  //Validates if a user is currently logged in.
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/add-product');
  }

  //Validates if a user is admin
  if (user?.type != 'Admin') {
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
