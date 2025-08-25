"use client";
import { Suspense } from 'react';
import { CustomizeForm } from '@/components/forms/CustomizeForm';
import { submitCustomizeForm } from '@/lib/actions/customize';
import { CustomizeFormData } from '@/types';

export function CustomizeFormSection() {
  const handleSubmit = async (data: CustomizeFormData) => {
    const result = await submitCustomizeForm(data, 'customize-page');
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to submit form');
    }
  };

  return (
    <Suspense fallback={null}>
      <CustomizeForm onSubmit={handleSubmit} />
    </Suspense>
  );
}