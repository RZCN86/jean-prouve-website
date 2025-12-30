import React, { useState, useRef, useEffect } from 'react';
import { useLazyLoading } from '@/utils/performance';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  once?: boolean;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = null,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  once = true,
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isIntersecting, setElement } = useLazyLoading(threshold);

  useEffect(() => {
    if (containerRef.current) {
      setElement(containerRef.current);
    }
  }, [setElement]);

  useEffect(() => {
    if (isIntersecting && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isIntersecting, hasLoaded]);

  const shouldRender = once ? hasLoaded : isIntersecting;

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? children : fallback}
    </div>
  );
};

export default LazyWrapper;