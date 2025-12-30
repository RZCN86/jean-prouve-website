import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useLazyLoading } from '@/utils/performance';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+',
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority); // If priority, load immediately
  const imgRef = useRef<HTMLDivElement>(null);
  
  // Use intersection observer for lazy loading (unless priority is set)
  const { isIntersecting, setElement } = useLazyLoading(0.1);

  useEffect(() => {
    if (imgRef.current && !priority) {
      setElement(imgRef.current);
    }
  }, [setElement, priority]);

  useEffect(() => {
    if (isIntersecting && !priority) {
      setIsInView(true);
    }
  }, [isIntersecting, priority]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  const shouldLoad = priority || isInView;

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={!fill && width && height ? { width, height } : undefined}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{
            backgroundImage: `url(${placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg 
              className="w-8 h-8 mx-auto mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <p className="text-xs">图片加载失败</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {shouldLoad && (
        <Image
          src={src}
          alt={alt}
          {...(fill ? { fill: true } : { width: width!, height: height! })}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          quality={quality}
          priority={priority}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          placeholder="blur"
          blurDataURL={placeholder}
        />
      )}
    </div>
  );
};

export default ProgressiveImage;