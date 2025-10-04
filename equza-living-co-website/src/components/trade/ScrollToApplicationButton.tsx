'use client';

import { Button } from '@/components/ui/Button';

export function ScrollToApplicationButton() {
  const scrollToApplication = () => {
    const element = document.getElementById('partnership-application');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <Button 
      size="lg" 
      className="bg-white text-gray-900 hover:bg-gray-100"
      onClick={scrollToApplication}
    >
      Partner With Us
    </Button>
  );
}
