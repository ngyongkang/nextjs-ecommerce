import Link from 'next/link';
import React from 'react';

type Props = {};

function NotFoundPage({}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div>Page not found.</div>
      <div>
        <Link href={'/'} className="btn btn-primary uppercase">
          Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
