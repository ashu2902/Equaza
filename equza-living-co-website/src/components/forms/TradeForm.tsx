'use client';

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2, Briefcase } from 'lucide-react';
import { tradeFormSchema } from '@/lib/utils/validation';
import { TradeFormData } from '@/types';
import { TradeActionResult } from '@/lib/actions/trade';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { FormField } from './FormField';
import { FormSection } from './FormSection';

interface TradeFormProps {
  onSubmit: (data: TradeFormData) => Promise<TradeActionResult>;
  className?: string;
  title?: string;
  description?: string;
  showCard?: boolean;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export const TradeForm: FC<TradeFormProps> = ({
  onSubmit,
  className = '',
  title = 'Trade Partnership Enquiry',
  showCard = true
}) => {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<TradeFormData>({
    resolver: zodResolver(tradeFormSchema),
    mode: 'onChange'
  });

  const formValues = watch();
  const isFormDirty = Object.values(formValues).some(value => value && value.trim() !== '');

  const handleFormSubmit = async (data: TradeFormData) => {
    try {
      setFormState('submitting');
      setErrorMessage('');
      
      const result = await onSubmit(data);
      
      if (result.success) {
        setFormState('success');
        reset();
      } else {
        setFormState('error');
        setErrorMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setFormState('error');
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Something went wrong. Please try again.'
      );
    }
  };

  const resetForm = () => {
    setFormState('idle');
    setErrorMessage('');
    reset();
  };

  const formContent = (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Briefcase className="w-6 h-6 text-stone-600" />
          <Typography
            variant="h3"
            className="font-serif text-stone-900"
          >
            {title}
          </Typography>
        </div>
        
        
      </div>

      

      {/* Form */}
      <AnimatePresence mode="wait">
        {formState === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-8 space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            </motion.div>
            <Typography
              variant="h4"
              className="font-serif text-stone-900"
            >
              Application Received!
            </Typography>
            <Typography
              variant="body1"
              className="text-stone-600"
            >
              Thank you for your interest in partnering with us. Our trade team will review your application and get back to you within 3 business days.
            </Typography>
            <Button
              variant="outline"
              onClick={resetForm}
              className="mt-4"
            >
              Submit Another Application
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {/* Contact Information */}
            <FormSection
              title="Contact Information"
              description="Please provide your business contact details"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Full Name"
                  htmlFor="trade-name"
                  required
                  error={errors.name?.message}
                >
                  <Input
                    id="trade-name"
                    {...register('name')}
                    placeholder="Enter your full name"
                    disabled={formState === 'submitting'}
                  />
                </FormField>

                <FormField
                  label="Email Address"
                  htmlFor="trade-email"
                  required
                  error={errors.email?.message}
                >
                  <Input
                    id="trade-email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter your business email"
                    disabled={formState === 'submitting'}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Phone Number"
                  htmlFor="trade-phone"
                  error={errors.phone?.message}
                  hint="Business phone number for quick communication"
                >
                  <Input
                    id="trade-phone"
                    type="tel"
                    {...register('phone')}
                    placeholder="Enter your phone number"
                    disabled={formState === 'submitting'}
                  />
                </FormField>

                <FormField
                  label="Company Name"
                  htmlFor="trade-company"
                  error={errors.company?.message}
                  hint="Optional - if applicable"
                >
                  <Input
                    id="trade-company"
                    {...register('company')}
                    placeholder="Enter your company name"
                    disabled={formState === 'submitting'}
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Business Information */}
            <FormSection
              title="Tell Us About Your Business"
              description="Help us understand how we can work together"
            >
              <FormField
                label="Business Details & Partnership Interest"
                htmlFor="trade-message"
                required
                error={errors.message?.message}
                description="Please include information about your business type, target market, current product lines, and how you'd like to incorporate our rugs into your offerings."
              >
                <Textarea
                  id="trade-message"
                  {...register('message')}
                  placeholder="Tell us about your business, target customers, and how you envision selling our products..."
                  rows={6}
                  disabled={formState === 'submitting'}
                />
                <div className="text-right mt-1">
                  <Typography
                    variant="caption"
                    className="text-stone-500"
                  >
                    {formValues.message?.length || 0}/1000 characters
                  </Typography>
                </div>
              </FormField>
            </FormSection>

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
                    Error submitting application
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

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!isValid || !isFormDirty || formState === 'submitting'}
            >
              {formState === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Partnership Application
                </>
              )}
            </Button>

            {/* Next Steps */}
            <div className="text-center pt-4 border-t border-stone-200 space-y-2">
              <Typography
                variant="body2"
                className="text-stone-600 font-medium"
              >
                What happens next?
              </Typography>
              <div className="text-sm text-stone-500 space-y-1">
                <div>1. We'll review your application within 3 business days</div>
                <div>2. Schedule a call to discuss partnership details</div>
                <div>3. Provide partnership agreement and wholesale pricing</div>
                <div>4. Set up your account and place your first order</div>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );

  if (showCard) {
    return (
      <Card className={`p-6 md:p-8 ${className}`}>
        {formContent}
      </Card>
    );
  }

  return (
    <div className={className}>
      {formContent}
    </div>
  );
};

TradeForm.displayName = 'TradeForm';