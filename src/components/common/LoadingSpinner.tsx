import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent' | 'white';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const colorClasses = {
    primary: 'border-primary-aluminum border-t-primary-steel',
    accent: 'border-neutral-medium border-t-accent-copper',
    white: 'border-gray-300 border-t-white'
  };

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
        role="status"
        aria-label="加载中"
      >
        <span className="sr-only">加载中...</span>
      </div>
      
      {text && (
        <div className="text-sm text-primary-steel font-medium">
          {text}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;