/**
 * Label Component
 * A label component for form elements with consistent styling
 */

import React from 'react';

import { cn } from '@/lib/utils/cn';

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required = false, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-semibold text-neutral-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-red-500 font-bold">*</span>}
    </label>
  )
);

Label.displayName = 'Label';

export { Label }; 