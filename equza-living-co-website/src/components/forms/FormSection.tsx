'use client';

import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/components/ui/Typography';

interface FormSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  required?: boolean;
  step?: number;
  totalSteps?: number;
}

export const FormSection: FC<FormSectionProps> = ({
  children,
  title,
  description,
  className = '',
  required = false,
  step,
  totalSteps,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`space-y-4 ${className}`}
    >
      {/* Section Header */}
      {(title || description || step) && (
        <div className='space-y-2'>
          {/* Step Indicator */}
          {step && totalSteps && (
            <div className='flex items-center gap-2'>
              <span className='inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-stone-900 rounded-full'>
                {step}
              </span>
              <Typography variant='caption' className='text-stone-500'>
                Step {step} of {totalSteps}
              </Typography>
            </div>
          )}

          {/* Title */}
          {title && (
            <Typography variant='h4' className='font-serif text-stone-900'>
              {title}
              {required && <span className='text-red-500 ml-1'>*</span>}
            </Typography>
          )}

          {/* Description */}
          {description && (
            <Typography variant='body2' className='text-stone-600'>
              {description}
            </Typography>
          )}
        </div>
      )}

      {/* Section Content */}
      <div className='space-y-4'>{children}</div>
    </motion.div>
  );
};

FormSection.displayName = 'FormSection';
