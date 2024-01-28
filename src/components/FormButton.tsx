'use client';
import React, { ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';

/* ComponentProps only works with type and not interfaces this allows
   a type to inherit the properties of whichever component stated.
*/
type Props = {
  children: React.ReactNode;
  className?: string;
} & ComponentProps<'button'>;

export default function FormButton({ children, className, ...props }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      {...props}
      className={`btn btn-primary ${className}`}
      type="submit"
      disabled={pending}
    >
      {pending && <span className="loading loading-spinner" />}
      {children}
    </button>
  );
}
