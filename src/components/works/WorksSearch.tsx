import React, { useState, useEffect } from 'react';
import { SearchQuery, SearchFilters, SortOption, ArchitecturalWork } from '@/types';
import { workCategories } from '@/data/works';

interface WorksSearchProps {
  onSearch: (query: SearchQuery) => void;
  onReset: () => void;
  totalResults: number;
  className?: string;
}

export const WorksSearch: React.FC<WorksSearchProps> = ({
  onSearch,
  onReset,
  totalResults,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    year: undefined,
    type: ['work']
  });
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [yearRange, setYearRange] = useState<[number, number]>([1930, 1980]);

  // Available filter options
  const sortOptions = [
    { value: 'relevance' as const, label: '相关性' },
    { value: 'year' as const, label: '年份' },
    { value: 'title' as const, label: '标题' }
  ];

  // Handle search
  useEffect(() => {
    const query: SearchQuery = {
      term: searchTerm,
      filters: {
        ...filters,
        year: filters.year || yearRange
      },
      sortBy
    };
    onSearch(query);
  }, [searchTerm, filters, sortBy, yearRange, onSearch]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      category: checked
        ? [...(prev.category || []), categoryId]
        : (prev.category || []).filter(id => id !== categoryId)
    }));
  };

  const handleYearRangeChange = (min: number, max: number) => {
    setYearRange([min, max]);
    setFilters(prev => ({
      ...prev,
      year: [min, max]
    }));
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilters({
      category: [],
      year: undefined,
      type: ['work']
    });
    setSortBy('relevance');
    setYearRange([1930, 1980]);
    onReset();
  };

  const hasActiveFilters = searchTerm || 
    (filters.category && filters.category.length > 0) ||
    (filters.year && (filters.year[0] !== 1930 || filters.year[1] !== 1980));

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="搜索作品标题、描述或位置..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-accent-copper focus:border-accent-copper"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-accent-copper focus:border-accent-copper"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                排序: {option.label}
              </option>
            ))}
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`flex items-center px-4 py-2 border rounded-md transition-colors ${
              isFiltersOpen || hasActiveFilters
                ? 'border-accent-copper text-accent-copper bg-accent-copper bg-opacity-10'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            筛选
            {hasActiveFilters && (
              <span className="ml-2 bg-accent-copper text-white text-xs rounded-full px-2 py-1">
                {(filters.category?.length || 0) + (filters.year ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          找到 <span className="font-semibold text-gray-900">{totalResults}</span> 个作品
        </p>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-sm text-accent-copper hover:text-accent-copper/80 transition-colors"
          >
            清除所有筛选
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {isFiltersOpen && (
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">作品类型</h3>
              <div className="space-y-2">
                {workCategories.map(category => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.category?.includes(category.id) || false}
                      onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                      className="rounded border-gray-300 text-accent-copper focus:ring-accent-copper"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Year Range Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">建造年份</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">从</label>
                    <input
                      type="number"
                      min="1920"
                      max="1980"
                      value={yearRange[0]}
                      onChange={(e) => handleYearRangeChange(parseInt(e.target.value), yearRange[1])}
                      className="w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent-copper focus:border-accent-copper"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">到</label>
                    <input
                      type="number"
                      min="1920"
                      max="1980"
                      value={yearRange[1]}
                      onChange={(e) => handleYearRangeChange(yearRange[0], parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent-copper focus:border-accent-copper"
                    />
                  </div>
                </div>
                
                {/* Year Range Slider */}
                <div className="relative">
                  <input
                    type="range"
                    min="1920"
                    max="1980"
                    value={yearRange[0]}
                    onChange={(e) => handleYearRangeChange(parseInt(e.target.value), yearRange[1])}
                    className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="1920"
                    max="1980"
                    value={yearRange[1]}
                    onChange={(e) => handleYearRangeChange(yearRange[0], parseInt(e.target.value))}
                    className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1920</span>
                  <span>1980</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent-copper text-white">
                搜索: &quot;{searchTerm}&quot;
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 hover:text-gray-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {filters.category?.map(categoryId => {
              const category = workCategories.find(c => c.id === categoryId);
              return category ? (
                <span key={categoryId} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-aluminum text-primary-steel">
                  {category.name}
                  <button
                    onClick={() => handleCategoryChange(categoryId, false)}
                    className="ml-2 hover:text-primary-iron"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ) : null;
            })}
            
            {filters.year && (filters.year[0] !== 1930 || filters.year[1] !== 1980) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-aluminum text-primary-steel">
                {filters.year[0]} - {filters.year[1]}
                <button
                  onClick={() => {
                    setYearRange([1930, 1980]);
                    setFilters(prev => ({ ...prev, year: undefined }));
                  }}
                  className="ml-2 hover:text-primary-iron"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorksSearch;