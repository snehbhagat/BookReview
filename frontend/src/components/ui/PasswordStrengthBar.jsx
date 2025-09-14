import React, { useMemo } from 'react';
import clsx from 'clsx';

function scorePassword(pw = '') {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  return score; // 0..5
}

export default function PasswordStrengthBar({ password }) {
  const score = useMemo(() => scorePassword(password), [password]);
  const labels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Strong'];
  const colors = [
    'bg-red-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-emerald-600'
  ];
  return (
    <div className="mt-2">
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              'h-2.5 flex-1 rounded-full transition-colors',
              i < score ? colors[score] : 'bg-gray-300 dark:bg-gray-700'
            )}
          />
        ))}
      </div>
      <p
        className={clsx(
          'mt-1 text-xs font-medium',
          score <= 1 && 'text-red-600 dark:text-red-400',
          score === 2 && 'text-yellow-600 dark:text-yellow-400',
          score >= 3 && 'text-emerald-600 dark:text-emerald-400'
        )}
      >
        {labels[score]}
      </p>
    </div>
  );
}