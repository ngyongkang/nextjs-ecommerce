'use client';

import { ShoppingCart } from '@/lib/db/cart';
import { formatPrice } from '@/lib/format';
import Link from 'next/link';
import React from 'react';

interface ShoppingCartButtonProps {
  cart: ShoppingCart | null;
}

function ShoppingCartButton({ cart }: ShoppingCartButtonProps) {
  function closeDropdown() {
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem.blur();
    }
  }
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-circle btn-ghost">
        <div className="indicator">
          {' '}
          <svg
            className="h-5 w-5 "
            fill="currentColor"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 461.927 461.927"
          >
            <path
              d="M441.928,118.601H108.43L86.037,37.952c-2.403-8.657-10.285-14.649-19.271-14.649H20c-11.046,0-20,8.954-20,20
        c0,11.046,8.954,20,20,20h31.563l88.086,317.243c2.403,8.657,10.285,14.649,19.271,14.649h4.584
        c-0.772,2.865-1.19,5.874-1.19,8.982c0,19.025,15.423,34.448,34.448,34.448c19.025,0,34.449-15.423,34.449-34.448
        c0-3.108-0.419-6.117-1.19-8.982h42.435c-0.772,2.865-1.19,5.874-1.19,8.982c0,19.025,15.423,34.448,34.448,34.448
        c19.025,0,34.448-15.423,34.448-34.448c0-3.108-0.418-6.117-1.19-8.982h17.447c11.046,0,20-8.954,20-20c0-11.046-8.954-20-20-20
        H174.123l-8.575-30.882h206.308c12.066,0,22.627-8.109,25.741-19.767l38.987-145.944h5.343c11.046,0,20-8.954,20-20
        C461.927,127.556,452.974,118.601,441.928,118.601z M211.762,269.506c0,8.284-6.716,15-15,15s-15-6.716-15-15v-85.129
        c0-8.284,6.716-15,15-15s15,6.716,15,15V269.506z M283.462,269.506c0,8.284-6.716,15-15,15s-15-6.716-15-15v-85.129
        c0-8.284,6.716-15,15-15s15,6.716,15,15V269.506z M355.161,269.506c0,8.284-6.716,15-15,15s-15-6.716-15-15v-85.129
        c0-8.284,6.716-15,15-15s15,6.716,15,15V269.506z"
            />
          </svg>
          <span className="badge indicator-item badge-sm">
            {cart?.size || 0}
          </span>
        </div>
      </label>
      <div className="card dropdown-content card-compact z-30 mt-3 w-52 bg-base-100 shadow">
        <div className="card-body">
          <span className="text-lg font-bold">{cart?.size || 0} Items</span>
          <span className="text-info">
            Subtotal: {formatPrice(cart?.subtotal || 0)}
          </span>
          <div className="card-actions">
            <Link
              href="/cart"
              className="btn btn-primary btn-block"
              onClick={closeDropdown}
            >
              {' '}
              View cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCartButton;
