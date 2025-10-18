'use client';

import { FC, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Label } from '@/components/ui/Label';
import { Typography } from '@/components/ui/Typography';

interface FormFieldProps {
  children: ReactNode;
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  success?: string;
  hint?: string;
  className?: string;
  labelClassName?: string;
  fieldClassName?: string;
  description?: string;
}

export const FormField: FC<FormFieldProps> = ({
  children,
  label,
  htmlFor,
  required = false,
  error,
  success,
  hint,
  className = '',
  labelClassName = '',
  fieldClassName = '',
  description,
}) => {
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success);
  const hasHint = Boolean(hint);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <Label htmlFor={htmlFor} required={required} className={labelClassName}>
          {label}
        </Label>
      )}

      {/* Description */}
      {description && (
        <Typography variant='body2' className='text-stone-600'>
          {description}
        </Typography>
      )}

      {/* Field Container */}
      <div className={`relative ${fieldClassName}`}>
        {children}

        {/* Success Icon */}
        {hasSuccess && !hasError && (
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
            <CheckCircle className='w-5 h-5 text-green-500' />
          </div>
        )}
      </div>

      {/* Messages */}
      <AnimatePresence mode='wait'>
        {hasError && (
          <motion.div
            key='error'
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className='flex items-start gap-2'
          >
            <AlertCircle className='w-4 h-4 text-red-500 flex-shrink-0 mt-0.5' />
            <Typography variant='caption' className='text-red-600'>
              {error}
            </Typography>
          </motion.div>
        )}

        {!hasError && hasSuccess && (
          <motion.div
            key='success'
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className='flex items-start gap-2'
          >
            <CheckCircle className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
            <Typography variant='caption' className='text-green-600'>
              {success}
            </Typography>
          </motion.div>
        )}

        {!hasError && !hasSuccess && hasHint && (
          <motion.div
            key='hint'
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className='flex items-start gap-2'
          >
            <Info className='w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5' />
            <Typography variant='caption' className='text-stone-500'>
              {hint}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

FormField.displayName = 'FormField';
