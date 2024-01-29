import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import logo from '@/assets/icon.png';
import { redirect } from 'next/navigation';
import ShoppingCartButton from './ShoppingCartButton';
import { getCart } from '@/lib/db/cart';
import UserMenuButton from './UserMenuButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

type Props = {};

async function searchProducts(formData: FormData) {
  'use server';

  const searchQuery = formData.get('searchQuery')?.toString();
  if (searchQuery) {
    redirect('/search?query=' + searchQuery);
  }
}

async function Navbar({}: Props) {
  const session = await getServerSession(authOptions);
  const cart = await getCart();

  return (
    <div className="bg-base-100">
      <div className="navbar m-auto max-w-7xl flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            <Image src={logo} alt="website logo" width={40} height={40} />
            Stick & Treat
          </Link>
        </div>
        <div className="flex-none gap-2">
          <form action={searchProducts}>
            <div className="form-control">
              <input
                name="searchQuery"
                placeholder="Search"
                className="input input-bordered w-full min-w-[100px]"
              />
            </div>
          </form>
          <ShoppingCartButton cart={cart} />
          <UserMenuButton session={session} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
