import React from 'react';
import clsx from 'clsx';

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'lg',
  className,
  loading = false,
  disabled,
  children,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 transition';
  const variants = {
    primary:
      'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:focus-visible:ring-emerald-400',
    subtle:
      'bg-gray-100 text-gray-800 hover:bg-gray-200 focus-visible:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    ghost:
      'text-emerald-600 hover:bg-emerald-50 focus-visible:ring-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-900/30'
  };
  const sizes = {
    sm: 'h-10 px-4 text-base',
    md: 'h-12 px-5 text-lg',
    lg: 'h-14 px-6 text-lg'
  };

  return (
    <Comp
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <svg
          className="mr-2 h-5 w-5 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-80"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </Comp>
  );
}