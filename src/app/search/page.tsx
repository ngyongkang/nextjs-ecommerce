import ProductCard from '@/components/ProductCard';
import { searchProduct } from '@/lib/db/product';
import { Metadata } from 'next';
import React from 'react';

interface SearchPageProps {
  searchParams: { query: string };
}

export function generateMetadata({
  searchParams: { query },
}: SearchPageProps): Metadata {
  return {
    title: `Search: ${query} - Stick & Treat`,
  };
}

// Can add pagination for consistency
async function SearchPage({ searchParams: { query } }: SearchPageProps) {
  const products = await searchProduct(query);
  if (products.length === 0)
    return <div className="text-center">No products found</div>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products?.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}

export default SearchPage;
