/**
 * Error Boundary Component
 * 
 * Catches React errors and displays fallback UI.
 * Provides recovery options and error reporting.
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Typography } from './Typography';
import { Button } from './Button';
import { Container } from './Container';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Report to error monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Add your error reporting service here (e.g., Sentry, LogRocket)
      console.error('Production error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Container className="py-16 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            
            <div className="space-y-2">
              <Typography variant="h3" className="text-gray-900">
                Something went wrong
              </Typography>
              <Typography variant="body" className="text-gray-600">
                We apologize for the inconvenience. Please try again or reload the page.
              </Typography>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 p-4 bg-red-50 rounded-lg text-left">
                <summary className="font-medium cursor-pointer text-red-800">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                variant="primary"
              >
                Try Again
              </Button>
              <Button
                onClick={this.handleReload}
                variant="outline"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Lightweight error boundary for specific sections
 */
interface SectionErrorBoundaryProps {
  children: ReactNode;
  sectionName: string;
  className?: string;
}

export function SectionErrorBoundary({ 
  children, 
  sectionName, 
  className = '' 
}: SectionErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className={`py-8 text-center ${className}`}>
          <Typography variant="body" className="text-gray-600">
            Unable to load {sectionName}. Please refresh the page.
          </Typography>
        </div>
      }
      onError={(error) => {
        console.error(`Error in ${sectionName}:`, error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}