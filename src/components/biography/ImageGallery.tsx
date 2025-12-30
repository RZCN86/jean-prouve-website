import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ImageData } from '@/types';
import { useDebounce, preloadImages } from '@/utils/performance';
import { ProgressiveImage } from '@/components/common/ProgressiveImage';

interface ImageGalleryProps {
  images: ImageData[];
  className?: string;
  showThumbnails?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className = '',
  showThumbnails = true
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const currentImage = images[currentImageIndex];

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  }, []);

  // Handle touch events for swipe navigation
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && images.length > 1) {
      goToNext();
    }
    if (isRightSwipe && images.length > 1) {
      goToPrevious();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      goToPrevious();
    } else if (event.key === 'ArrowRight') {
      goToNext();
    } else if (event.key === 'Escape') {
      closeModal();
    }
  }, [goToPrevious, goToNext, closeModal]);

  // Clean up body scroll on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!images || images.length === 0) {
    return (
      <div className={`bg-neutral-light rounded-lg p-8 text-center ${className}`}>
        <p className="text-primary-steel">暂无图片</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image Display */}
      <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
        <div 
          className="image-container-mobile aspect-[4/3] cursor-pointer group"
          onClick={openModal}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={currentImageIndex === 0}
          />
          
          {/* Overlay with zoom icon */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg 
                className="w-8 h-8 sm:w-12 sm:h-12 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Hidden on mobile, shown on larger screens */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 btn-touch"
              aria-label="上一张图片"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 btn-touch"
              aria-label="下一张图片"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black bg-opacity-50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Mobile swipe indicator */}
        {images.length > 1 && (
          <div className="sm:hidden absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Image Caption */}
      {currentImage.caption && (
        <div className="bg-neutral-light rounded-lg p-3 sm:p-4">
          <p className="text-primary-steel text-sm italic">{currentImage.caption}</p>
        </div>
      )}

      {/* Thumbnails - Optimized for mobile */}
      {showThumbnails && images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2 scroll-smooth-mobile">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 relative w-16 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 btn-touch ${
                index === currentImageIndex
                  ? 'border-accent-copper shadow-md'
                  : 'border-neutral-medium hover:border-primary-steel'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal for Full-Size View */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 sm:p-4 safe-area-inset-top safe-area-inset-bottom"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          tabIndex={0}
        >
          <div className="relative max-w-4xl max-h-full w-full">
            <div className="relative">
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                width={currentImage.width}
                height={currentImage.height}
                className="max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain mx-auto"
              />
              
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 sm:p-3 rounded-full transition-all duration-200 btn-touch"
                aria-label="关闭"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Navigation - Hidden on mobile, use swipe instead */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                    className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 sm:p-3 rounded-full transition-all duration-200 btn-touch"
                    aria-label="上一张图片"
                  >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 sm:p-3 rounded-full transition-all duration-200 btn-touch"
                    aria-label="下一张图片"
                  >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Mobile swipe hint */}
              {images.length > 1 && (
                <div className="sm:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
                  滑动切换图片
                </div>
              )}
            </div>

            {/* Modal Caption */}
            {currentImage.caption && (
              <div className="mt-2 sm:mt-4 bg-black bg-opacity-50 text-white p-3 sm:p-4 rounded-lg">
                <p className="text-center text-sm sm:text-base">{currentImage.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;