/**
 * Button Component
 * A versatile button component with multiple variants, sizes, and states
 */

'use client';

import React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  // Base styles - removed dark mode styles
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#98342d] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[#98342d] text-white shadow hover:bg-[#98342d]/90',
        destructive:
          'bg-red-500 text-white shadow-sm hover:bg-red-500/90',
        outline:
          'border border-[#98342d]/30 bg-white text-[#98342d] shadow-sm hover:bg-[#98342d]/10 hover:text-[#98342d]',
        secondary:
          'bg-[#98342d]/10 text-[#98342d] shadow-sm hover:bg-[#98342d]/20',
        ghost: 'hover:bg-[#98342d]/10 hover:text-[#98342d]',
        link: 'text-[#98342d] underline-offset-4 hover:underline',
        premium:
          'bg-gradient-to-r from-[#98342d] to-[#98342d]/80 text-white shadow-lg hover:from-[#98342d]/90 hover:to-[#98342d]/70 transform hover:scale-105 transition-all duration-200',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        xl: 'h-12 rounded-lg px-10 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean; // Currently unused but kept for future Slot implementation
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false, // eslint-disable-line @typescript-eslint/no-unused-vars
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && leftIcon && leftIcon}
        {children}
        {!loading && rightIcon && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps }; 