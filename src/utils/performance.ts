/**
 * Performance optimization utilities for the Jean Prouvé website
 */

import { useEffect, useState, useCallback, useMemo } from 'react';

// Lazy loading utilities
export const useLazyLoading = (threshold = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, threshold]);

  return { isIntersecting, setElement };
};

// Debounced search hook
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Image preloading utility
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Batch image preloading
export const preloadImages = async (sources: string[]): Promise<void> => {
  const promises = sources.map(preloadImage);
  await Promise.allSettled(promises);
};

// Virtual scrolling hook for large lists
export const useVirtualScrolling = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex + 1),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    ...visibleItems,
    handleScroll,
  };
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  } else {
    fn();
  }
};

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Track Largest Contentful Paint (LCP)
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Fallback for browsers that don't support LCP
      console.log('LCP not supported');
    }

    // Track First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        // Cast to PerformanceEventTiming for first-input entries
        const eventEntry = entry as any;
        if (eventEntry.processingStart) {
          console.log('FID:', eventEntry.processingStart - entry.startTime);
        }
      });
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // Fallback for browsers that don't support FID
      console.log('FID not supported');
    }

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log('CLS:', clsValue);
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // Fallback for browsers that don't support CLS
      console.log('CLS not supported');
    }
  }
};

// Resource hints for critical resources
export const addResourceHints = (resources: Array<{ href: string; as: string; type?: string }>) => {
  if (typeof document !== 'undefined') {
    resources.forEach(({ href, as, type }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      document.head.appendChild(link);
    });
  }
};

// Critical CSS inlining utility
export const inlineCriticalCSS = (css: string) => {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
};

// Service Worker registration
export const registerServiceWorker = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (window.performance as any)) {
    const memory = (window.performance as any).memory;
    console.log('Memory usage:', {
      used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
    });
  }
};

// Efficient event listener management
export const useEventListener = (
  eventName: string,
  handler: (event: Event) => void,
  element: Element | Window | null = null
) => {
  useEffect(() => {
    const targetElement = element || window;
    if (!targetElement?.addEventListener) return;

    targetElement.addEventListener(eventName, handler);

    return () => {
      targetElement.removeEventListener(eventName, handler);
    };
  }, [eventName, handler, element]);
};

// Throttled scroll handler
export const useThrottledScroll = (callback: () => void, delay = 16) => {
  const [isThrottled, setIsThrottled] = useState(false);

  const throttledCallback = useCallback(() => {
    if (!isThrottled) {
      callback();
      setIsThrottled(true);
      setTimeout(() => setIsThrottled(false), delay);
    }
  }, [callback, delay, isThrottled]);

  return throttledCallback;
};

// Progressive image loading component props
export interface ProgressiveImageProps {
  src: string;
  placeholder?: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Image optimization utilities
export const getOptimizedImageUrl = (
  src: string,
  width: number,
  quality = 75,
  format: 'webp' | 'avif' | 'jpeg' = 'webp'
) => {
  // This would integrate with your image optimization service
  // For now, return the original src
  return src;
};

// Prefetch utilities for Next.js
export const prefetchRoute = (href: string) => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
};

// Bundle size analyzer utility
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis available in production build with ANALYZE=true');
  }
};

// Critical resource loading priority
export const setCriticalResourcePriority = (selector: string, priority: 'high' | 'low' | 'auto' = 'high') => {
  if (typeof document !== 'undefined') {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      if (element instanceof HTMLImageElement || element instanceof HTMLLinkElement) {
        element.fetchPriority = priority;
      }
    });
  }
};