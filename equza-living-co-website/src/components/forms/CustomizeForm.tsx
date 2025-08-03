'use client';

import { FC, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2, Palette } from 'lucide-react';
import { customizeFormSchema } from '@/lib/utils/validation';
import { CustomizeFormData } from '@/types';
import { FORMS } from '@/lib/utils/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { FormField } from './FormField';
import { FormSection } from './FormSection';
import { FileUpload } from './FileUpload';

interface CustomizeFormProps {
  onSubmit: (data: CustomizeFormData) => Promise<void>;
  className?: string;
  title?: string;
  description?: string;
  showCard?: boolean;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export const CustomizeForm: FC<CustomizeFormProps> = ({
  onSubmit,
  className = '',
  title = 'Create Your Custom Rug',
  description = 'Tell us about your vision and we\'ll craft a unique piece just for you.',
  showCard = true
}) => {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<CustomizeFormData>({
    resolver: zodResolver(customizeFormSchema),
    mode: 'onChange',
    defaultValues: {
      preferredMaterials: [],
      moodboardFiles: []
    }
  });

  const formValues = watch();
  const isFormDirty = Object.values(formValues).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value && typeof value === 'string' && value.trim() !== '';
  });

  const handleFormSubmit = async (data: CustomizeFormData) => {
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

  const handleMaterialToggle = (material: string, currentMaterials: string[]) => {
    if (currentMaterials.includes(material)) {
      return currentMaterials.filter(m => m !== material);
    } else {
      return [...currentMaterials, material];
    }
  };

  const formContent = (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Palette className="w-6 h-6 text-stone-600" />
          <Typography
            variant="h3"
            className="font-serif text-stone-900"
          >
            {title}
          </Typography>
        </div>
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
              Request Submitted!
            </Typography>
            <Typography
              variant="body1"
              className="text-stone-600"
            >
              Thank you for your custom rug request. Our design team will review your requirements and get back to you within 2 business days.
            </Typography>
            <Button
              variant="outline"
              onClick={resetForm}
              className="mt-4"
            >
              Submit Another Request
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-8"
          >
            {/* Personal Information */}
            <FormSection
              title="Contact Information"
              description="We'll use this information to discuss your custom rug project"
              step={1}
              totalSteps={4}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Full Name"
                  htmlFor="customize-name"
                  required
                  error={errors.name?.message}
                >
                  <Input
                    id="customize-name"
                    {...register('name')}
                    placeholder="Enter your full name"
                    disabled={formState === 'submitting'}
                  />
                </FormField>

                <FormField
                  label="Email Address"
                  htmlFor="customize-email"
                  required
                  error={errors.email?.message}
                >
                  <Input
                    id="customize-email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email address"
                    disabled={formState === 'submitting'}
                  />
                </FormField>
              </div>

              <FormField
                label="Phone Number"
                htmlFor="customize-phone"
                error={errors.phone?.message}
                hint="Optional - for easier communication about your project"
              >
                <Input
                  id="customize-phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="Enter your phone number"
                  disabled={formState === 'submitting'}
                />
              </FormField>
            </FormSection>

            {/* Size Requirements */}
            <FormSection
              title="Size Requirements"
              description="Tell us your preferred size for the custom rug"
              step={2}
              totalSteps={4}
            >
              <FormField
                label="Preferred Size"
                htmlFor="customize-size"
                required
                error={errors.preferredSize?.message}
                hint="Choose from standard sizes or specify custom dimensions"
              >
                <select
                  id="customize-size"
                  {...register('preferredSize')}
                  disabled={formState === 'submitting'}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select preferred size</option>
                  {FORMS.customize.sizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </FormField>
            </FormSection>

            {/* Material Preferences */}
            <FormSection
              title="Material Preferences"
              description="Select your preferred materials (optional)"
              step={3}
              totalSteps={4}
            >
              <Controller
                name="preferredMaterials"
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Materials"
                    error={errors.preferredMaterials?.message}
                    hint="Choose one or more materials for your custom rug"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {FORMS.customize.materialOptions.map((material) => (
                        <label
                          key={material}
                          className="flex items-center gap-2 p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={field.value.includes(material)}
                            onChange={() => {
                              const updated = handleMaterialToggle(material, field.value);
                              field.onChange(updated);
                            }}
                            disabled={formState === 'submitting'}
                            className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
                          />
                          <Typography variant="body2" className="text-stone-700">
                            {material}
                          </Typography>
                        </label>
                      ))}
                    </div>
                  </FormField>
                )}
              />
            </FormSection>

            {/* Design Inspiration */}
            <FormSection
              title="Design Inspiration"
              description="Share your vision with us"
              step={4}
              totalSteps={4}
            >
              <Controller
                name="moodboardFiles"
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Moodboard & Inspiration Images"
                    error={errors.moodboardFiles?.message}
                    hint="Upload up to 5 images that represent your design vision"
                  >
                    <FileUpload
                      onFilesChange={field.onChange}
                      acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                      maxFiles={5}
                      disabled={formState === 'submitting'}
                      hint="Drag and drop your inspiration images here"
                      showPreview={true}
                    />
                  </FormField>
                )}
              />

              <FormField
                label="Additional Notes"
                htmlFor="customize-message"
                error={errors.message?.message}
                hint="Tell us more about your vision, color preferences, style, or any specific requirements"
              >
                <Textarea
                  id="customize-message"
                  {...register('message')}
                  placeholder="Describe your vision for the custom rug..."
                  rows={4}
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
                    Error submitting request
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
                  Submitting Request...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Custom Request
                </>
              )}
            </Button>

            {/* Info */}
            <div className="text-center pt-4 border-t border-stone-200 space-y-2">
              <Typography
                variant="body2"
                className="text-stone-600"
              >
                Our design team will review your request and provide a detailed quote within 2 business days.
              </Typography>
              <Typography
                variant="caption"
                className="text-stone-500"
              >
                Custom rugs typically take 6-8 weeks to complete depending on complexity.
              </Typography>
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

CustomizeForm.displayName = 'CustomizeForm';