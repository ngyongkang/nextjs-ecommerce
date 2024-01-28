'use client';
import React, { ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';

/* ComponentProps only works with type and not interfaces this allows
   a type to inherit the properties of whichever component stated.
*/
type FormButtonProps = {
  children: React.ReactNode;
  className?: string;
} & ComponentProps<'button'>;

/**
 * Custom react component to display loading on button.
 * @param children - Default react feature to inherit children
 * @param className - Param to take in className for css styling
 * @param ...props - Default react feature to inherit props
 * @returns A html button
 */
export default function FormButton({
  children,
  className,
  ...props
}: FormButtonProps) {
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
