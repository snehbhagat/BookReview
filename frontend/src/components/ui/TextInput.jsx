import React, { forwardRef } from 'react';
import clsx from 'clsx';

const TextInput = forwardRef(function TextInput(
  { className, error, leftIcon, rightIcon, ...rest },
  ref
) {
  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
          {leftIcon}
        </div>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-lg border bg-white/90 dark:bg-white/10 backdrop-blur focus:outline-none text-lg h-14 px-4 transition shadow-sm',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/40',
          'dark:border-gray-600 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/40',
          leftIcon && 'pl-12',
          rightIcon && 'pr-12',
          error &&
            'border-red-500 focus:border-red-600 focus:ring-red-500/40 dark:border-red-500 dark:focus:border-red-400 dark:focus:ring-red-400/40',
          className
        )}
        {...rest}
      />
      {rightIcon && (
        <button
          type="button"
          tabIndex={-1}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          onClick={rightIcon.onClick}
        >
          {rightIcon.icon}
        </button>
      )}
    </div>
  );
});

export default TextInput;