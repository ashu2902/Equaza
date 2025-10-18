'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { RefreshCw, Database } from 'lucide-react';
import { initializeHeroImages } from '@/lib/firebase/hero-images';

export function InitializeButton({ onSuccess }: { onSuccess?: () => void }) {
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitialize = async () => {
    if (
      !confirm(
        'Initialize hero images with default static images? This will overwrite existing data.'
      )
    ) {
      return;
    }

    setIsInitializing(true);
    try {
      await initializeHeroImages('admin-ui');
      alert('Hero images initialized successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Error initializing hero images:', error);
      alert(
        `Failed to initialize: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <Button
      onClick={handleInitialize}
      disabled={isInitializing}
      variant='outline'
      className='flex items-center'
    >
      {isInitializing ? (
        <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
      ) : (
        <Database className='w-4 h-4 mr-2' />
      )}
      {isInitializing ? 'Initializing...' : 'Initialize Default Images'}
    </Button>
  );
}
