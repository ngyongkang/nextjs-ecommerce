import { formatPrice } from '@/lib/format';
import React from 'react';

interface PriceTagProps {
  price: number;
  className?: string;
}

/**
 * Custom react component to display the price tag for products. This
 * component also uses a custom function called formatPrice.
 * @param price - Param to take in product price.
 * @param className - Param to take in className for css styling
 * @returns A html span
 */
function PriceTag({ price, className }: PriceTagProps) {
  return <span className={`badge ${className}`}>{formatPrice(price)}</span>;
}

export default PriceTag;
