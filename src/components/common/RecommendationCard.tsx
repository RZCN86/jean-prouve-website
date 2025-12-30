import React from 'react';
import Link from 'next/link';
import { RecommendationItem } from '@/utils/recommendations';

interface RecommendationCardProps {
  item: RecommendationItem;
  className?: string;
  showReason?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  item,
  className = '',
  showReason = true,
  size = 'medium'
}) => {
  // Get the appropriate link for the item
  const getItemLink = (item: RecommendationItem): string => {
    switch (item.type) {
      case 'work':
        return `/works/${item.id}`;
      case 'scholar':
        return `/scholars/${item.id}`;
      case 'biography':
        return `/biography#${item.metadata.section || ''}`;
      default:
        return '#';
    }
  };

  // Get the type display name and color
  const getTypeInfo = (type: RecommendationItem['type']) => {
    const typeInfo = {
      work: { name: '作品', color: 'bg-blue-100 text-blue-800' },
      scholar: { name: '学者', color: 'bg-green-100 text-green-800' },
      biography: { name: '传记', color: 'bg-purple-100 text-purple-800' }
    };
    return typeInfo[type] || { name: type, color: 'bg-gray-100 text-gray-800' };
  };

  // Get size-specific classes
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          card: 'p-4',
          title: 'text-sm font-medium',
          excerpt: 'text-xs text-gray-600 line-clamp-2',
          badge: 'text-xs px-2 py-1',
          reason: 'text-xs text-gray-500'
        };
      case 'large':
        return {
          card: 'p-6',
          title: 'text-lg font-semibold',
          excerpt: 'text-sm text-gray-600 line-clamp-3',
          badge: 'text-sm px-3 py-1',
          reason: 'text-sm text-gray-500'
        };
      default: // medium
        return {
          card: 'p-5',
          title: 'text-base font-medium',
          excerpt: 'text-sm text-gray-600 line-clamp-2',
          badge: 'text-xs px-2.5 py-1',
          reason: 'text-xs text-gray-500'
        };
    }
  };

  const typeInfo = getTypeInfo(item.type);
  const sizeClasses = getSizeClasses();

  return (
    <Link href={getItemLink(item)} className={`block ${className}`}>
      <div className={`bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer ${sizeClasses.card}`}>
        {/* Header with type badge and metadata */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center rounded-full font-medium ${typeInfo.color} ${sizeClasses.badge}`}>
              {typeInfo.name}
            </span>
            {item.metadata.year && (
              <span className="text-xs text-gray-500">
                {item.metadata.year}年
              </span>
            )}
          </div>
          {/* Relevance indicator */}
          <div className="flex items-center">
            <div 
              className="w-2 h-2 rounded-full bg-blue-500"
              style={{ opacity: item.relevanceScore }}
              title={`相关度: ${Math.round(item.relevanceScore * 100)}%`}
            />
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-gray-900 mb-2 hover:text-blue-600 transition-colors ${sizeClasses.title}`}>
          {item.title}
        </h3>

        {/* Excerpt */}
        <p className={`mb-3 ${sizeClasses.excerpt}`}>
          {item.excerpt}
        </p>

        {/* Metadata */}
        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-3">
          {item.metadata.location && (
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {item.metadata.location}
            </span>
          )}
          {item.metadata.institution && (
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {item.metadata.institution}
            </span>
          )}
          {item.metadata.category && (
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {item.metadata.category}
            </span>
          )}
        </div>

        {/* Recommendation reason */}
        {showReason && (
          <div className={`flex items-center ${sizeClasses.reason}`}>
            <svg className="w-3 h-3 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {item.reason}
          </div>
        )}
      </div>
    </Link>
  );
};

export default RecommendationCard;