import React from 'react';
import { Exhibition } from '@/types';

interface ExhibitionCardProps {
  exhibition: Exhibition;
  showAuthor?: boolean;
  authorName?: string;
}

export const ExhibitionCard: React.FC<ExhibitionCardProps> = ({ 
  exhibition, 
  showAuthor = false, 
  authorName 
}) => {
  const getRoleColor = (role: string): string => {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes('curator') || lowerRole.includes('策展')) {
      return 'bg-purple-100 text-purple-800';
    } else if (lowerRole.includes('advisor') || lowerRole.includes('顾问')) {
      return 'bg-blue-100 text-blue-800';
    } else if (lowerRole.includes('contributor') || lowerRole.includes('贡献')) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-primary-iron text-lg leading-tight flex-1 pr-4">
          {exhibition.title}
        </h3>
        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
          {exhibition.year}
        </span>
      </div>

      {/* Venue and Role */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <svg 
            className="w-4 h-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
          <span className="text-sm font-medium text-primary-steel">
            {exhibition.venue}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getRoleColor(exhibition.role)}`}>
            {exhibition.role}
          </span>
        </div>
      </div>

      {/* Author (if showing) */}
      {showAuthor && authorName && (
        <div className="mb-3">
          <span className="text-sm text-gray-600">参与学者: </span>
          <span className="text-sm font-medium text-primary-steel">{authorName}</span>
        </div>
      )}

      {/* Description */}
      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
        {exhibition.description}
      </p>

      {/* Exhibition icon indicator */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <svg 
            className="w-4 h-4 mr-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
            />
          </svg>
          展览项目
        </div>
      </div>
    </div>
  );
};