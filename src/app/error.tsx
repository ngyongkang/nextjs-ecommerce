'use client';
import React from 'react';

type Props = {};

/**
 * This component acts as the default error page when the application
 * encounters a problem, note this component has to be a __client__ component
 * in order to work.
 *
 */
function error({}: Props) {
  return <div>Something went wrong. Please refresh the page.</div>;
}

export default error;
