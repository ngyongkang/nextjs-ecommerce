import PaginationBar from '@/components/PaginationBar';
import ProductCard from '@/components/ProductCard';
import prisma from '@/lib/db/prisma';
import Image from 'next/image';
import Link from 'next/link';

/* 
  By adding searchParams this makes the server component dynamic
  which in turns apply revalidation of the page when new data comes in.
  This is really useful as it is the equivalent of adding.
  const revalidate = 0;
*/
interface HomeProps {
  //IMPORTANT THIS IS HOW NEXTJS USES SEARCH PARAMS
  //Has to be exact camelcase
  searchParams: { page: string };
}

/**
 * Note that this is a server component as the function is asynchronous
 * @returns
 */
export default async function Home({
  searchParams: { page = '1' },
}: HomeProps) {
  const currentPage = parseInt(page);
  const pageSize = 6;
  const heroItemCount = 1;
  const totalItemCount = await prisma.product.count();
  const totalPages = Math.ceil((totalItemCount - heroItemCount) / pageSize);

  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' },
    skip:
      (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemCount),
    take: pageSize + (currentPage === 1 ? heroItemCount : 0),
  });

  return (
    <div className="flex flex-col items-center">
      {/* Hero Product aka newest product */}
      {currentPage === 1 && (
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
      )}

      {/* Grid div to display the product list. */}
      <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(currentPage === 1 ? products.slice(1) : products).map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>
      {totalPages > 1 && (
        <PaginationBar currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
