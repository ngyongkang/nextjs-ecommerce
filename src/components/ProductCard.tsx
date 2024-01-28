import React from 'react';
import { Product } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import PriceTag from './PriceTag';

interface ProductCardProps {
  product: Product;
}

/**
 * Custom react component to display a product in card format from Daisy UI.
 * @param product - Param to take in product details.
 * @returns A custom html to display a product.
 */
function ProductCard({ product }: ProductCardProps) {
  /**
   *  This helps to check if a product is within 7 days timestamp.
   *  The calculation is done in milliseconds so it's
   *  1000 milliseconds
   *  * multiple 60 for a minute.
   *  * multiple 60 for an hour.
   *  * multiple 24 for a day.
   *  * multiple 7 for total days.
   */
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    1000 * 60 * 60 * 24 * 7;

  return (
    <Link
      href={'/products/' + product.id}
      className="card w-full bg-base-100 transition-shadow hover:shadow-xl"
    >
      <figure>
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={800}
          height={400}
          className="h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        {isNew && <div className="badge badge-secondary">NEW</div>}
        <p>{product.description}</p>
        <PriceTag price={product.price} />
      </div>
    </Link>
  );
}

export default ProductCard;
