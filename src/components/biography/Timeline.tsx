import React from 'react';
import { TimelineEvent } from '@/types';

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ events, className = '' }) => {
  const getCategoryColor = (category: TimelineEvent['category']) => {
    switch (category) {
      case 'education':
        return 'bg-accent-brass text-primary-iron';
      case 'career':
        return 'bg-accent-copper text-white';
      case 'achievement':
        return 'bg-primary-steel text-white';
      case 'collaboration':
        return 'bg-primary-aluminum text-primary-iron';
      default:
        return 'bg-neutral-medium text-primary-iron';
    }
  };

  const getCategoryIcon = (category: TimelineEvent['category']) => {
    switch (category) {
      case 'education':
        return '🎓';
      case 'career':
        return '🏢';
      case 'achievement':
        return '🏆';
      case 'collaboration':
        return '🤝';
      default:
        return '📅';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-neutral-medium"></div>
      
      <div className="space-y-8">
        {events.map((event, index) => (
          <div key={index} className="relative flex items-start">
            {/* Timeline dot */}
            <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-neutral-medium shadow-md">
              <span className="text-2xl" role="img" aria-label={event.category}>
                {getCategoryIcon(event.category)}
              </span>
            </div>
            
            {/* Content */}
            <div className="ml-6 flex-1">
              <div className="bg-white rounded-lg shadow-md p-6 border border-neutral-medium">
                {/* Year and category */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-primary-iron">
                    {event.year}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-heading font-semibold text-primary-iron mb-3">
                  {event.title}
                </h3>
                
                {/* Description */}
                <p className="text-primary-steel leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;