import { UtilityBanner, Header, MinimalFooter } from '@/components/layout';

interface PublicPageTemplateProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function PublicPageTemplate({ 
  children, 
  className = '',
  containerClassName = ''
}: PublicPageTemplateProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Utility Banner */}
      <UtilityBanner />
      
      {/* Header */}
      <Header />
      
      
      {/* Main Content */}
      <main className={`flex-1 ${containerClassName}`}>
        {children}
      </main>
      
      {/* Footer */}
      <MinimalFooter />
    </div>
  );
} 