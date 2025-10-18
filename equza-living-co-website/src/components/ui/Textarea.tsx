/**
 * Textarea Component
 * A flexible textarea component with label and helper text support
 */

'use client';

import React from 'react';

import { cn } from '@/lib/utils/cn';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, helperText, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || `textarea-${generatedId}`;

    return (
      <div className='w-full'>
        {label && (
          <label
            htmlFor={textareaId}
            className='mb-2 block text-sm font-semibold text-neutral-700'
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'flex min-h-[120px] w-full rounded-lg border bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
            error
              ? 'border-red-300 focus-visible:ring-red-200 focus-visible:border-red-500'
              : 'border-neutral-200 focus-visible:ring-neutral-200 focus-visible:border-neutral-300 hover:border-neutral-300',
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p
            className={cn(
              'mt-1 text-xs',
              error ? 'text-red-500' : 'text-stone-500 dark:text-stone-400'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
