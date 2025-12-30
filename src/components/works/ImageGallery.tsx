import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ImageData } from '@/types';

interface ImageGalleryProps {
  images: ImageData[];
  initialIndex?: number;
  onClose: () => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  initialIndex = 0,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const currentImage = images[currentIndex];

  // Memoized navigation functions to fix ESLint warning
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  }, [images.length]);

  const toggleZoom = useCallback(() => {
    setIsZoomed(prev => !prev);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          toggleZoom();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToNext, goToPrevious, toggleZoom]);

  // Prevent body scroll when gallery is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Touch handling for mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const minSwipeDistance = 50;

    // Horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
    
    // Vertical swipe down to close
    if (deltaY < -minSwipeDistance && Math.abs(deltaX) < minSwipeDistance) {
      onClose();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleZoom();
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
  };

  // Preload adjacent images for better performance
  useEffect(() => {
    const preloadImages = () => {
      const nextIndex = (currentIndex + 1) % images.length;
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      
      [nextIndex, prevIndex].forEach(index => {
        if (index !== currentIndex) {
          const img = new window.Image();
          img.src = images[index].src;
        }
      });
    };

    preloadImages();
  }, [currentIndex, images]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
        aria-label="关闭图库"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-3 rounded-full hover:bg-white hover:bg-opacity-20"
            aria-label="上一张图片"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-3 rounded-full hover:bg-white hover:bg-opacity-20"
            aria-label="下一张图片"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Main image container */}
      <div className="relative w-full h-full flex items-center justify-center p-8">
        <div
          className={`relative max-w-full max-h-full cursor-${isZoomed ? 'zoom-out' : 'zoom-in'} overflow-hidden transition-all duration-300`}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
          style={{ opacity: isLoading ? 0 : 1 }}
        >
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            width={currentImage.width}
            height={currentImage.height}
            className={`max-w-full max-h-full object-contain transition-transform duration-500 ease-out ${
              isZoomed ? 'scale-200' : 'scale-100'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : {}
            }
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority
            quality={90}
          />
        </div>
      </div>

      {/* Image info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between">
            <div className="flex-1 mr-4">
              <h3 className="text-lg font-semibold mb-1">{currentImage.alt}</h3>
              {currentImage.caption && (
                <p className="text-gray-300 text-sm leading-relaxed">{currentImage.caption}</p>
              )}
            </div>
            <div className="flex items-center space-x-6 text-sm">
              {/* Zoom indicator */}
              <div className="flex items-center space-x-2 text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>{isZoomed ? '点击缩小' : '点击放大'}</span>
              </div>
              
              {/* Image counter */}
              {images.length > 1 && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300">
                    {currentIndex + 1} / {images.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-24 left-0 right-0">
          <div className="flex justify-center space-x-2 px-4 overflow-x-auto scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsZoomed(false);
                  setIsLoading(true);
                }}
                className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? 'border-accent-copper scale-110'
                    : 'border-transparent hover:border-gray-400 hover:scale-105'
                }`}
                aria-label={`查看图片 ${index + 1}: ${image.alt}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard shortcuts help */}
      <div className="absolute top-4 left-4 text-white text-xs opacity-70 bg-black bg-opacity-50 rounded-lg p-3">
        <div className="space-y-1">
          <div>ESC: 关闭</div>
          <div>←→: 导航</div>
          <div>空格: 缩放</div>
          <div className="md:hidden">滑动: 导航/关闭</div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;