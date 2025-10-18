import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { Container } from '@/components/ui';

interface FormPageTemplateProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function FormPageTemplate({
  children,
  title,
  description,
  backHref = '/',
  backLabel = 'Back to Home',
  className = '',
  maxWidth = 'md',
}: FormPageTemplateProps) {
  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Minimal Header */}
      <header className='border-b border-neutral-200 bg-white'>
        <Container>
          <div className='flex items-center justify-between py-4'>
            {/* Back Link */}
            <Link
              href={backHref}
              className='flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              <span className='text-sm font-medium'>{backLabel}</span>
            </Link>

            {/* Logo */}
            <Link href='/' className='flex items-center'>
              <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3'>
                <span className='text-white font-bold text-sm'>E</span>
              </div>
              <span className='font-serif text-lg text-neutral-900 tracking-wide'>
                Equza Living Co.
              </span>
            </Link>

            {/* Spacer for centering */}
            <div className='w-24'></div>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className='flex-1 py-12'>
        <Container>
          <div className={`mx-auto ${maxWidthClasses[maxWidth]}`}>
            {/* Page Header */}
            <div className='text-center mb-8'>
              <h1 className='text-3xl lg:text-4xl font-serif font-normal text-neutral-900 mb-4'>
                {title}
              </h1>
              {description && (
                <p className='text-lg text-neutral-600 leading-relaxed'>
                  {description}
                </p>
              )}
            </div>

            {/* Form Content */}
            <div className='bg-white rounded-lg shadow-sm border border-neutral-200 p-6 lg:p-8'>
              {children}
            </div>

            {/* Footer Text */}
            <div className='text-center mt-8'>
              <p className='text-sm text-neutral-500'>
                Need help? Contact us at{' '}
                <a
                  href='mailto:info@equzalivingco.com'
                  className='text-primary hover:underline'
                >
                  info@equzalivingco.com
                </a>
              </p>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
