"use client";
import { Suspense } from 'react';
import { CustomizeForm } from '@/components/forms/CustomizeForm';

export function CustomizeFormSection() {
  // You can add your actual onSubmit logic here
  const handleSubmit = async (data: any) => {
    // ...submit logic...
  };

  return (
    <Suspense fallback={null}>
      <CustomizeForm onSubmit={handleSubmit} />
    </Suspense>
  );
}