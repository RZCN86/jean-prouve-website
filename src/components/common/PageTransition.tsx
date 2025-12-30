import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
      setIsVisible(false);
    };

    const handleRouteChangeComplete = () => {
      setIsLoading(false);
      // Delay showing content to allow for smooth transition
      setTimeout(() => {
        setIsVisible(true);
      }, 150);
    };

    const handleRouteChangeError = () => {
      setIsLoading(false);
      setIsVisible(true);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  return (
    <>
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-90 flex items-center justify-center transition-opacity duration-300">
          <div className="flex flex-col items-center space-y-4">
            {/* Loading spinner */}
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary-aluminum rounded-full animate-spin border-t-accent-copper"></div>
            </div>
            
            {/* Loading text */}
            <div className="text-primary-steel text-sm font-medium">
              加载中...
            </div>
          </div>
        </div>
      )}

      {/* Page content with transition */}
      <div
        className={`transition-all duration-500 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        } ${className}`}
      >
        {children}
      </div>
    </>
  );
};

export default PageTransition;