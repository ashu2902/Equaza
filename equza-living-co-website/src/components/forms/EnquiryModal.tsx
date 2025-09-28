'use client';

import { FC, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2, MessageSquare, X } from 'lucide-react';
import { enquiryFormSchema } from '@/lib/utils/validation';
import { EnquiryFormData, Product } from '@/types';
import { SafeProduct } from '@/types/safe';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Typography } from '@/components/ui/Typography';
import { Modal, ModalContent } from '@/components/ui/Modal';
import { FormField } from './FormField';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EnquiryFormData) => Promise<void>;
  product?: Product | SafeProduct;
  productId?: string;
  className?: string;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export const EnquiryModal: FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  productId,
  className = ''
}) => {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const finalProductId = productId || product?.id || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquiryFormSchema),
    mode: 'onChange',
    defaultValues: {
      productId: finalProductId
    }
  });

  const formValues = watch();
  const isFormDirty = Object.values(formValues).some(value => value && value.trim() !== '');

  // Set product ID when modal opens or product changes
  useEffect(() => {
    if (finalProductId) {
      setValue('productId', finalProductId, { shouldValidate: true });
    }
  }, [finalProductId, setValue]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormState('idle');
        setErrorMessage('');
        reset({ productId: finalProductId });
      }, 300); // Wait for modal close animation
    }
  }, [isOpen, reset, finalProductId]);

  const handleFormSubmit = async (data: EnquiryFormData) => {
    try {
      setFormState('submitting');
      setErrorMessage('');
      
      await onSubmit({
        ...data,
        productId: finalProductId
      });
      
      setFormState('success');
    } catch (error) {
      setFormState('error');
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Something went wrong. Please try again.'
      );
    }
  };

  const handleClose = () => {
    if (formState !== 'submitting') {
      onClose();
    }
  };

  const handleSuccessClose = () => {
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
    >
      <ModalContent
        className={`max-w-lg ${className}`}
        showCloseButton={formState !== 'submitting'}
        onClose={handleClose}
      >
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <Typography
              variant="h4"
              className="font-serif text-gray-900"
              style={{ color: '#98342d' }}
            >
              Product Enquiry
            </Typography>
            {product && (
              <Typography
                variant="body2"
                className="text-gray-600 mt-1"
              >
                About: {product.name}
              </Typography>
            )}
          </div>
        </div>

        {/* Product Preview */}
        {product && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            {product.images.length > 0 && (
              <img
                src={product.images.find(img => img.isMain)?.url || product.images[0]?.url || '/images/placeholder-rug.jpg'}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <Typography
                variant="body2"
                className="font-medium text-gray-900"
              >
                {product.name}
              </Typography>
              <Typography
                variant="caption"
                className="text-gray-600"
              >
                {product.collections.join(', ')}
              </Typography>
            </div>
          </div>
        )}

        {/* Form Content */}
        <AnimatePresence mode="wait">
          {formState === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-6 space-y-4"
            >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            </motion.div>
            <Typography
              variant="h4"
              className="font-serif text-gray-900"
              style={{ color: '#98342d' }}
            >
              Enquiry Sent!
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-700"
            >
              Thank you for your enquiry about {product?.name || 'this product'}. We'll get back to you within 24 hours.
            </Typography>
              <Button
                onClick={handleSuccessClose}
                className="mt-4"
              >
                Close
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              {/* Hidden product ID */}
              <input
                type="hidden"
                {...register('productId')}
                value={finalProductId}
              />

              {/* Name Field */}
              <FormField
                label="Full Name"
                htmlFor="enquiry-name"
                required
                error={errors.name?.message}
              >
                <Input
                  id="enquiry-name"
                  {...register('name')}
                  placeholder="Enter your full name"
                  disabled={formState === 'submitting'}
                />
              </FormField>

              {/* Email Field */}
              <FormField
                label="Email Address"
                htmlFor="enquiry-email"
                required
                error={errors.email?.message}
              >
                <Input
                  id="enquiry-email"
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email address"
                  disabled={formState === 'submitting'}
                />
              </FormField>

              {/* Message Field */}
              <FormField
                label="Your Enquiry"
                htmlFor="enquiry-message"
                required
                error={errors.message?.message}
                hint="Tell us what you'd like to know about this product"
              >
                <Textarea
                  id="enquiry-message"
                  {...register('message')}
                  placeholder={`I'm interested in learning more about ${product?.name || 'this product'}. Could you please provide more information about...`}
                  rows={4}
                  disabled={formState === 'submitting'}
                />
                <div className="text-right mt-1">
                  <Typography
                    variant="caption"
                    className="text-gray-500"
                  >
                    {formValues.message?.length || 0}/500 characters
                  </Typography>
                </div>
              </FormField>

              {/* Error Message */}
              {formState === 'error' && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <Typography
                      variant="body2"
                      className="text-red-800 font-medium"
                    >
                      Error sending enquiry
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-red-700"
                    >
                      {errorMessage}
                    </Typography>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={formState === 'submitting'}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!isValid || !isFormDirty || formState === 'submitting'}
                >
                  {formState === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Enquiry
                    </>
                  )}
                </Button>
              </div>

              {/* Info */}
              <div className="text-center pt-2 border-t border-gray-200">
                <Typography
                  variant="caption"
                  className="text-gray-600"
                >
                  We'll respond to your enquiry within 24 hours
                </Typography>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        </div>
      </ModalContent>
    </Modal>
  );
};

EnquiryModal.displayName = 'EnquiryModal';