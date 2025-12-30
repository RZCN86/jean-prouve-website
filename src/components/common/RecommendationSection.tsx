import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { RecommendationItem, RecommendationOptions } from '@/utils/recommendations';
import RecommendationCard from './RecommendationCard';

interface RecommendationSectionProps {
  title?: string;
  subtitle?: string;
  recommendations: RecommendationItem[];
  loading?: boolean;
  error?: string;
  className?: string;
  cardSize?: 'small' | 'medium' | 'large';
  showReason?: boolean;
  maxVisible?: number;
  layout?: 'grid' | 'carousel';
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  title = '相关推荐',
  subtitle,
  recommendations,
  loading = false,
  error,
  className = '',
  cardSize = 'medium',
  showReason = true,
  maxVisible,
  layout = 'grid',
  onLoadMore,
  hasMore = false
}) => {
  const { t } = useTranslation('common');
  const [visibleCount, setVisibleCount] = useState(maxVisible || recommendations.length);
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleRecommendations = maxVisible 
    ? recommendations.slice(0, visibleCount)
    : recommendations;

  // Auto-scroll for carousel layout
  useEffect(() => {
    if (layout === 'carousel' && recommendations.length > 3) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => 
          prev >= recommendations.length - 3 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [layout, recommendations.length]);

  // Handle load more
  const handleLoadMore = () => {
    if (onLoadMore) {
      onLoadMore();
    } else if (maxVisible) {
      setVisibleCount(prev => Math.min(prev + (maxVisible || 6), recommendations.length));
    }
  };

  // Get grid classes based on card size
  const getGridClasses = () => {
    switch (cardSize) {
      case 'small':
        return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4';
      case 'large':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
      default: // medium
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5';
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className={`grid ${getGridClasses()}`}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-12 h-5 bg-gray-200 rounded-full"></div>
            <div className="w-8 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-3/4 h-5 bg-gray-200 rounded mb-2"></div>
          <div className="w-full h-4 bg-gray-200 rounded mb-1"></div>
          <div className="w-2/3 h-4 bg-gray-200 rounded mb-3"></div>
          <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && recommendations.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-600">暂无推荐内容</p>
        </div>
      </div>
    );
  }

  return (
    <section className={`${className}`}>
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && (
          <p className="text-gray-600">{subtitle}</p>
        )}
      </div>

      {/* Loading State */}
      {loading && <LoadingSkeleton />}

      {/* Content */}
      {!loading && (
        <>
          {layout === 'grid' ? (
            /* Grid Layout */
            <div className={`grid ${getGridClasses()}`}>
              {visibleRecommendations.map((item) => (
                <RecommendationCard
                  key={item.id}
                  item={item}
                  size={cardSize}
                  showReason={showReason}
                />
              ))}
            </div>
          ) : (
            /* Carousel Layout */
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
                >
                  {recommendations.map((item) => (
                    <div key={item.id} className="w-1/3 flex-shrink-0 px-2">
                      <RecommendationCard
                        item={item}
                        size={cardSize}
                        showReason={showReason}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Controls */}
              {recommendations.length > 3 && (
                <>
                  <button
                    onClick={() => setCurrentIndex(prev => 
                      prev <= 0 ? recommendations.length - 3 : prev - 1
                    )}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    aria-label="Previous"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentIndex(prev => 
                      prev >= recommendations.length - 3 ? 0 : prev + 1
                    )}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    aria-label="Next"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Indicators */}
                  <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: recommendations.length - 2 }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Load More Button */}
          {(hasMore || (maxVisible && visibleCount < recommendations.length)) && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                加载更多
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default RecommendationSection;