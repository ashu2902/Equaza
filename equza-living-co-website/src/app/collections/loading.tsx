/**
 * Collections Page Loading Component
 */

import { Container } from '@/components/ui/Container';

export default function CollectionsLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f1eee9' }}>
      <div className="animate-pulse">
        {/* Hero skeleton */}
        <div className="py-16">
          <Container size="lg">
            <div className="text-center">
              <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-64 mx-auto"></div>
            </div>
          </Container>
        </div>
        
        {/* Tabs skeleton */}
        <div className="border-b border-gray-200">
          <Container size="lg">
            <div className="flex space-x-8">
              <div className="h-8 bg-gray-200 rounded w-32"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          </Container>
        </div>
        
        {/* Collections grid skeleton */}
        <div className="py-16">
          <Container size="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded"></div>
              ))}
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}