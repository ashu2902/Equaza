'use client';
import { Suspense } from 'react';
import { CustomizeForm } from '@/components/forms/CustomizeForm';
import { createCustomizeLead } from '@/lib/firebase/client-leads';
import { CustomizeFormData } from '@/types';

export function CustomizeFormSection() {
  const handleSubmit = async (data: CustomizeFormData) => {
    try {
      console.log('Customize form data:', data);
      console.log('Attempting to submit to Firebase...');

      // Create lead directly using client-side Firebase SDK
      const leadId = await createCustomizeLead(data, 'customize-page');

      console.log('✅ Customize form successfully submitted to Firebase! Lead ID:', leadId);

      // Return success - the form component will handle the success state
    } catch (error) {
      console.error('❌ Customize form error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
      
      // Re-throw the error so the form shows error state
      throw error;
    }
  };

  return (
    <Suspense fallback={null}>
      <CustomizeForm onSubmit={handleSubmit} />
    </Suspense>
  );
}
