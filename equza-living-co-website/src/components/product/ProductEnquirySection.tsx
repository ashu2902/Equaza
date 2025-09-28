'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EnquiryModal } from '@/components/forms/EnquiryModal';
import { submitEnquiryForm } from '@/lib/actions/enquiry';
import { EnquiryFormData } from '@/types';

interface ProductEnquirySectionProps {
  product: any;
}

export function ProductEnquirySection({ product }: ProductEnquirySectionProps) {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  // Wrapper function to match EnquiryModal's expected signature
  const handleEnquirySubmit = async (data: EnquiryFormData): Promise<void> => {
    await submitEnquiryForm(data, 'product-enquiry');
  };

  return (
    <>
      <div className="pt-2 pb-4 md:pb-6">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsEnquiryModalOpen(true)}
          className="w-full text-lg py-0"
          style={{
            borderColor: '#98342d',
            color: '#98342d',
            fontFamily: 'Poppins'
          }}
        >
          Enquire About This Rug
        </Button>
      </div>

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        onSubmit={handleEnquirySubmit}
        product={product}
      />
    </>
  );
}
