'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/lib/hooks/useAuth';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminAuthGuard({ children, fallback }: AdminAuthGuardProps) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // No user logged in, redirect to admin login
        router.push('/admin/login');
        return;
      }

      if (!isAdmin) {
        // User logged in but not admin, redirect to unauthorized page
        router.push('/admin/unauthorized');
        return;
      }

      // User is admin, allow access
      setIsChecking(false);
    }
  }, [user, isLoading, isAdmin, router]);

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    return (
      fallback || (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
            <p className='text-gray-600'>Verifying access...</p>
          </div>
        </div>
      )
    );
  }

  // Only render children if user is authenticated and is admin
  if (user && isAdmin) {
    return <>{children}</>;
  }

  // Fallback - should not reach here due to redirects above
  return null;
}
