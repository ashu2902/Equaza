/**
 * Typography Component
 * A comprehensive typography system for consistent text styling
 */

import React from 'react';

import { cn } from '@/lib/utils/cn';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'body'
    | 'lead'
    | 'small'
    | 'caption'
    | 'overline';
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'destructive';
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  as?: React.ElementType;
  children: React.ReactNode;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      variant = 'body1',
      color = 'primary',
      align = 'left',
      weight,
      as,
      children,
      ...props
    },
    ref
  ) => {
    // Variant styles mapping - Updated for Figma design
    const variantStyles = {
      h1: 'text-4xl md:text-5xl lg:text-6xl font-display font-normal tracking-tight leading-tight',
      h2: 'text-3xl md:text-4xl lg:text-5xl font-display font-normal tracking-tight leading-tight',
      h3: 'text-2xl md:text-3xl lg:text-4xl font-display font-normal tracking-tight leading-snug',
      h4: 'text-xl md:text-2xl lg:text-3xl font-display font-normal tracking-tight leading-snug',
      h5: 'text-lg md:text-xl font-display font-medium leading-snug',
      h6: 'text-base md:text-lg font-display font-medium leading-snug',
      subtitle1: 'text-lg md:text-xl font-body font-medium leading-relaxed',
      subtitle2: 'text-base md:text-lg font-body font-medium leading-relaxed',
      body1: 'text-base font-body leading-relaxed',
      body2: 'text-sm font-body leading-relaxed',
      body: 'text-base font-body leading-relaxed', // Alias for body1
      lead: 'text-lg md:text-xl font-body leading-relaxed text-warm-600', // Large introductory text
      small: 'text-xs font-body leading-normal text-warm-500', // Small text
      caption: 'text-sm font-body leading-normal',
      overline: 'text-xs font-body font-medium uppercase tracking-widest',
    };

    // Color styles mapping
    const colorStyles = {
      primary: 'text-warm-900 dark:text-warm-50',
      secondary: 'text-warm-600 dark:text-warm-400',
      muted: 'text-warm-500 dark:text-warm-400',
      accent: 'text-primary-600 dark:text-primary-400',
      destructive: 'text-red-600 dark:text-red-400',
    };

    // Alignment styles
    const alignStyles = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    };

    // Weight styles (optional override)
    const weightStyles = weight
      ? {
          light: 'font-light',
          normal: 'font-normal',
          medium: 'font-medium',
          semibold: 'font-semibold',
          bold: 'font-bold',
        }[weight]
      : '';

    // Default element mapping
    const defaultElements = {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      subtitle1: 'h6',
      subtitle2: 'h6',
      body1: 'p',
      body2: 'p',
      body: 'p', // Alias for body1
      lead: 'p', // Lead paragraph
      small: 'small', // Small text element
      caption: 'span',
      overline: 'span',
    };

    const Component = as || (defaultElements[variant] as React.ElementType) || 'p';

    return (
      <Component
        ref={ref}
        className={cn(
          variantStyles[variant],
          colorStyles[color],
          alignStyles[align],
          weightStyles,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Typography.displayName = 'Typography';

// Convenience components for common use cases
const Heading = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, 'variant'> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }
>(({ level = 1, ...props }, ref) => {
  const variant = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  return (
    <Typography
      ref={ref}
      variant={variant}
      {...props}
    />
  );
});
Heading.displayName = 'Heading';

const Text = React.forwardRef<
  HTMLParagraphElement,
  Omit<TypographyProps, 'variant'> & { size?: 'sm' | 'base' | 'lg' }
>(({ size = 'base', ...props }, ref) => {
  const variant = size === 'sm' ? 'body2' : size === 'lg' ? 'subtitle1' : 'body1';
  return <Typography ref={ref} variant={variant} {...props} />;
});
Text.displayName = 'Text';

const Caption = React.forwardRef<
  HTMLSpanElement,
  Omit<TypographyProps, 'variant'>
>((props, ref) => (
  <Typography ref={ref} variant="caption" color="muted" {...props} />
));
Caption.displayName = 'Caption';

export { Typography, Heading, Text, Caption };
export type { TypographyProps }; 