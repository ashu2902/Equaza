/**
 * MotionWrapper Component
 * A wrapper component using Framer Motion for consistent animations
 */

'use client';

import React from 'react';

import { motion, HTMLMotionProps, Variants } from 'framer-motion';

interface MotionWrapperProps extends HTMLMotionProps<'div'> {
  animation?:
    | 'fadeIn'
    | 'slideUp'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight'
    | 'scale'
    | 'none';
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

// Predefined animation variants
const animationVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  none: {
    hidden: {},
    visible: {},
  },
};

const MotionWrapper = React.forwardRef<HTMLDivElement, MotionWrapperProps>(
  (
    { animation = 'fadeIn', delay = 0, duration = 0.6, children, ...props },
    ref
  ) => {
    const variants = animationVariants[animation];

    const motionProps = {
      ref,
      initial: 'hidden' as const,
      animate: 'visible' as const,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.25, 0, 1] as const, // Custom cubic-bezier for smooth animations
      },
      ...(variants && { variants }),
      ...props,
    };

    return <motion.div {...motionProps}>{children}</motion.div>;
  }
);

MotionWrapper.displayName = 'MotionWrapper';

// Convenience components for common animations
const FadeIn = React.forwardRef<
  HTMLDivElement,
  Omit<MotionWrapperProps, 'animation'>
>((props, ref) => <MotionWrapper ref={ref} animation='fadeIn' {...props} />);
FadeIn.displayName = 'FadeIn';

const SlideUp = React.forwardRef<
  HTMLDivElement,
  Omit<MotionWrapperProps, 'animation'>
>((props, ref) => <MotionWrapper ref={ref} animation='slideUp' {...props} />);
SlideUp.displayName = 'SlideUp';

const ScaleIn = React.forwardRef<
  HTMLDivElement,
  Omit<MotionWrapperProps, 'animation'>
>((props, ref) => <MotionWrapper ref={ref} animation='scale' {...props} />);
ScaleIn.displayName = 'ScaleIn';

export { MotionWrapper, FadeIn, SlideUp, ScaleIn };
export type { MotionWrapperProps };
