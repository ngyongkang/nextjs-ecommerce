import ProductCard from '@/components/ProductCard';
import prisma from '@/lib/db/prisma';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' },
  });

  return (
    <div>
      {/* Hero Product aka newest product */}
      <div className="hero rounded-xl bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <Image
            src={products[0].imageUrl}
            alt={products[0].name}
            width={800}
            height={400}
            className="w-full max-w-sm rounded-lg shadow-2xl"
            priority
          />
          <div>
            <h1 className="text-5xl font-bold">{products[0].name}</h1>
            <p className="py-6">{products[0].description}</p>
            <Link
              href={'/products/' + products[0].id}
              className="btn btn-primary uppercase"
            >
              Check it out
            </Link>
          </div>
        </div>
      </div>

      {/* Grid div to display the product list. */}
      <div className="md:grids-cols-2 my-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {products.slice(1).map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>
    </div>
  );
}
