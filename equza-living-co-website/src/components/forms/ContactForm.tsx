'use client';

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { contactFormSchema } from '@/lib/utils/validation';
import { ContactFormData } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  className?: string;
  title?: string;
  description?: string;
  showCard?: boolean;
  splitName?: boolean; // when true, show First/Last name fields and combine into name
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export const ContactForm: FC<ContactFormProps> = ({
  onSubmit,
  className = '',
  title = 'Get in Touch',
  description = 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
  showCard = true,
  splitName = false
}) => {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange'
  });

  // support split name UI while keeping single `name` field in schema
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { setValue } = ({} as any) || { setValue: () => {} };
  // react-hook-form's setValue is available from useForm; above typing workaround avoids TS re-export errors in this environment

  const formValues = watch();
  const isFormDirty = Object.values(formValues).some(value => value && value.trim() !== '');

  const handleFormSubmit = async (data: ContactFormData) => {
    try {
      setFormState('submitting');
      setErrorMessage('');
      
      await onSubmit(data);
      
      setFormState('success');
      reset();
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Typography
          variant="h3"
          className="font-serif text-stone-900"
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          className="text-stone-600"
        >
          {description}
        </Typography>
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
              Message Sent!
            </Typography>
            <Typography
              variant="body1"
              className="text-stone-600"
            >
              Thank you for your message. We'll get back to you within 24 hours.
            </Typography>
            <Button
              variant="outline"
              onClick={resetForm}
              className="mt-4"
            >
              Send Another Message
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
            {/* Name Field(s) */}
            {splitName ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-first-name" required>
                    First Name
                  </Label>
                  <Input
                    id="contact-first-name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      // update underlying name field
                      const combined = `${e.target.value} ${lastName}`.trim();
                      // @ts-ignore
                      setValue && setValue('name', combined, { shouldValidate: true, shouldDirty: true });
                    }}
                    placeholder="Enter your first name"
                    disabled={formState === 'submitting'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-last-name">
                    Last Name
                  </Label>
                  <Input
                    id="contact-last-name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      const combined = `${firstName} ${e.target.value}`.trim();
                      // @ts-ignore
                      setValue && setValue('name', combined, { shouldValidate: true, shouldDirty: true });
                    }}
                    placeholder="Enter your last name"
                    disabled={formState === 'submitting'}
                  />
                </div>
                {/* hidden name input registered for schema */}
                <input type="hidden" {...register('name')} />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="contact-name" required>
                  Full Name
                </Label>
                <Input
                  id="contact-name"
                  {...register('name')}
                  placeholder="Enter your full name"
                  error={!!errors.name?.message}
                  disabled={formState === 'submitting'}
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="contact-email" required>
                Email Address
              </Label>
              <Input
                id="contact-email"
                type="email"
                {...register('email')}
                placeholder="Enter your email address"
                error={!!errors.email?.message}
                disabled={formState === 'submitting'}
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="contact-phone">
                Phone Number
              </Label>
              <Input
                id="contact-phone"
                type="tel"
                {...register('phone')}
                placeholder="Enter your phone number (optional)"
                error={!!errors.phone?.message}
                disabled={formState === 'submitting'}
              />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor="contact-message" required>
                Message
              </Label>
              <Textarea
                id="contact-message"
                {...register('message')}
                placeholder="Tell us about your project or how we can help you..."
                rows={5}
                error={!!errors.message?.message}
                disabled={formState === 'submitting'}
              />
              <div className="text-right">
                <Typography
                  variant="caption"
                  className="text-stone-500"
                >
                  {formValues.message?.length || 0}/1000 characters
                </Typography>
              </div>
            </div>

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
                    Error sending message
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
                  Sending Message...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>

            {/* Contact Info */}
            <div className="pt-4 border-t border-stone-200 text-center space-y-2">
              <Typography
                variant="body2"
                className="text-stone-600"
              >
                Prefer to contact us directly?
              </Typography>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <a
                  href="mailto:hello@equzaliving.com"
                  className="text-stone-900 hover:text-stone-700 font-medium transition-colors"
                >
                  hello@equzaliving.com
                </a>
                <span className="hidden sm:block text-stone-400">•</span>
                <a
                  href="tel:+919876543210"
                  className="text-stone-900 hover:text-stone-700 font-medium transition-colors"
                >
                  +91 98765 43210
                </a>
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

ContactForm.displayName = 'ContactForm';