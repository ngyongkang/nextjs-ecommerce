'use client';
import Link from 'next/link';
import React from 'react';

type Props = {};

/**
 * This component acts as the default error page when the application
 * encounters a problem, note this component has to be a __client__ component
 * in order to work.
 *
 */
function ErrorPage({}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div>Something went wrong. Please refresh the page.</div>
      <div>
        <Link href={'/'} className="btn btn-primary uppercase">
          Home
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
