import prisma from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import PriceTag from '@/components/PriceTag';
import { Metadata } from 'next';
import { cache } from 'react';
import AddToCartButton from './AddToCartButton';
import { incrementProductQuantity } from './actions';

interface ProductPageProps {
  params: {
    id: string;
  };
}

/**
 * Custom function to cache data, this function uses
 * a react feature called "__cache__" to prevent
 * fetching data multiple times.
 */
const getProduct = cache(async function (id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();
  return product;
});

/**
 * Function to dynamically generate metadata.
 */
export async function generateMetadata({
  params: { id },
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(id);

  return {
    title: product.name + ' - Stick & Treat',
    description: product.description,
    openGraph: {
      images: [{ url: product.imageUrl }],
    },
  };
}

async function page({ params: { id } }: ProductPageProps) {
  const product = await getProduct(id);
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={500}
        height={500}
        className="rounded-lg"
        priority
      />
      <div>
        <h1 className="text-5xl font-bold">{product.name}</h1>
        <PriceTag price={product.price} />
        <p className="py-6">{product.description}</p>
        <AddToCartButton
          productId={product.id}
          incrementProductQuantity={incrementProductQuantity}
        />
      </div>
    </div>
  );
}

export default page;
