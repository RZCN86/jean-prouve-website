import React from 'react';
import Link from 'next/link';
import { ArchitecturalWork } from '@/types';
import { ProgressiveImage } from '@/components/common/ProgressiveImage';

interface WorksListProps {
  works: ArchitecturalWork[];
  className?: string;
}

export const WorksList: React.FC<WorksListProps> = ({ works, className = '' }) => {
  if (works.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500 text-lg">暂无作品数据</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 ${className}`}>
      {works.map((work) => (
        <WorkCard key={work.id} work={work} />
      ))}
    </div>
  );
};

interface WorkCardProps {
  work: ArchitecturalWork;
}

const WorkCard: React.FC<WorkCardProps> = ({ work }) => {
  const primaryImage = work.images[0];
  const statusColors = {
    existing: 'bg-green-100 text-green-800',
    demolished: 'bg-red-100 text-red-800',
    reconstructed: 'bg-blue-100 text-blue-800'
  };

  const statusLabels = {
    existing: '现存',
    demolished: '已拆除',
    reconstructed: '重建'
  };

  return (
    <Link href={`/works/${work.id}`} className="group block touch-manipulation tap-highlight-none">
      <div className="card-mobile overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image */}
        <div className="image-container-mobile h-48 sm:h-56 lg:h-64 bg-gray-200 mb-4">
          {primaryImage ? (
            <ProgressiveImage
              src={primaryImage.src}
              alt={primaryImage.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
              quality={80}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          {/* Status badge */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[work.status]}`}>
              {statusLabels[work.status]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">{work.year}</span>
            <span className="text-xs sm:text-sm text-primary-steel bg-primary-aluminum px-2 py-1 rounded">
              {work.category.name}
            </span>
          </div>
          
          <h3 className="text-lg sm:text-xl font-semibold text-primary-iron group-hover:text-accent-copper transition-colors line-clamp-2">
            {work.title}
          </h3>
          
          <p className="text-gray-600 text-sm sm:text-base line-clamp-3 leading-relaxed">
            {work.description}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 pt-2">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{work.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorksList;