/**
 * Product Page Loading Component
 */

import { Container } from '@/components/ui/Container';

export default function ProductLoading() {
  return (
    <div className='min-h-screen' style={{ backgroundColor: '#f1eee9' }}>
      <div className='animate-pulse'>
        {/* Breadcrumb skeleton */}
        <div className='py-6 border-b border-gray-200'>
          <Container size='lg'>
            <div className='h-4 bg-gray-200 rounded w-80'></div>
          </Container>
        </div>

        {/* Product detail skeleton */}
        <div className='py-16'>
          <Container size='lg'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
              {/* Image skeleton */}
              <div className='h-96 bg-gray-200 rounded'></div>

              {/* Content skeleton */}
              <div className='space-y-6'>
                <div className='h-8 bg-gray-200 rounded w-3/4'></div>
                <div className='h-6 bg-gray-200 rounded w-1/2'></div>
                <div className='h-8 bg-gray-200 rounded w-32'></div>
                <div className='space-y-2'>
                  <div className='h-4 bg-gray-200 rounded'></div>
                  <div className='h-4 bg-gray-200 rounded'></div>
                  <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                </div>
                <div className='h-12 bg-gray-200 rounded w-40'></div>
              </div>
            </div>
          </Container>
        </div>

        {/* Specifications skeleton */}
        <div className='py-16 border-t border-gray-200'>
          <Container size='lg'>
            <div className='h-6 bg-gray-200 rounded w-48 mb-6'></div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='h-20 bg-gray-200 rounded'></div>
              ))}
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}
