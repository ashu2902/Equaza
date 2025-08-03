/**
 * Collection Page Loading Component
 */

import { Container } from '@/components/ui/Container';

export default function CollectionLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f1eee9' }}>
      <div className="animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="py-6 border-b border-gray-200">
          <Container size="lg">
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </Container>
        </div>
        
        {/* Hero skeleton */}
        <div className="py-16">
          <Container size="lg">
            <div className="h-64 bg-gray-200 rounded"></div>
          </Container>
        </div>
        
        {/* Products skeleton */}
        <div className="py-16">
          <Container size="lg">
            <div className="flex gap-8">
              <div className="hidden lg:block w-64 h-96 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}