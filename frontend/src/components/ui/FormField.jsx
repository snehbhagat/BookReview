import React from 'react';
import clsx from 'clsx';

export default function FormField({
  label,
  htmlFor,
  required,
  children,
  hint,
  error
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-lg font-medium text-gray-800 dark:text-gray-200"
        >
          {label} {required && <span className="text-emerald-600">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}