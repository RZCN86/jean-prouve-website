import React from 'react';
import { Publication } from '@/types';

interface PublicationCardProps {
  publication: Publication;
  showAuthor?: boolean;
  authorName?: string;
}

export const PublicationCard: React.FC<PublicationCardProps> = ({ 
  publication, 
  showAuthor = false, 
  authorName 
}) => {
  const publicationTypeLabels: Record<string, string> = {
    book: '书籍',
    article: '文章',
    thesis: '论文',
    conference: '会议论文'
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'book':
        return 'bg-blue-100 text-blue-800';
      case 'article':
        return 'bg-green-100 text-green-800';
      case 'thesis':
        return 'bg-purple-100 text-purple-800';
      case 'conference':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-primary-iron text-lg leading-tight flex-1 pr-4">
          {publication.title}
        </h3>
        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
          {publication.year}
        </span>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTypeColor(publication.type)}`}>
          {publicationTypeLabels[publication.type] || publication.type}
        </span>
        {publication.publisher && (
          <span className="text-sm text-gray-600">
            {publication.publisher}
          </span>
        )}
      </div>

      {/* Author (if showing) */}
      {showAuthor && authorName && (
        <div className="mb-3">
          <span className="text-sm text-gray-600">作者: </span>
          <span className="text-sm font-medium text-primary-steel">{authorName}</span>
        </div>
      )}

      {/* Abstract */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
        {publication.abstract}
      </p>

      {/* Keywords */}
      {publication.keywords.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {publication.keywords.slice(0, 5).map((keyword, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
              >
                {keyword}
              </span>
            ))}
            {publication.keywords.length > 5 && (
              <span className="text-xs text-gray-500">
                +{publication.keywords.length - 5} 更多
              </span>
            )}
          </div>
        </div>
      )}

      {/* Link */}
      {publication.url && (
        <div className="pt-3 border-t border-gray-100">
          <a
            href={publication.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-accent-copper hover:text-accent-copper/80 text-sm font-medium transition-colors duration-200"
          >
            查看出版物
            <svg 
              className="ml-1 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};