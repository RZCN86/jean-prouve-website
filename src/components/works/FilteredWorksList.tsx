import React, { useState, useMemo } from 'react';
import { ArchitecturalWork, SearchQuery } from '@/types';
import { WorksList } from './WorksList';
import { WorksSearch } from './WorksSearch';

interface FilteredWorksListProps {
  works: ArchitecturalWork[];
  className?: string;
}

export const FilteredWorksList: React.FC<FilteredWorksListProps> = ({
  works,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    term: '',
    filters: {
      category: [],
      type: ['work']
    },
    sortBy: 'relevance'
  });

  // Filter and sort works based on search query
  const filteredWorks = useMemo(() => {
    let filtered = [...works];

    // Filter by search term
    if (searchQuery.term.trim()) {
      const searchTerm = searchQuery.term.toLowerCase();
      filtered = filtered.filter(work =>
        work.title.toLowerCase().includes(searchTerm) ||
        work.description.toLowerCase().includes(searchTerm) ||
        work.location.toLowerCase().includes(searchTerm) ||
        work.category.name.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by category
    if (searchQuery.filters.category && searchQuery.filters.category.length > 0) {
      filtered = filtered.filter(work =>
        searchQuery.filters.category!.includes(work.category.id)
      );
    }

    // Filter by year range
    if (searchQuery.filters.year) {
      const [minYear, maxYear] = searchQuery.filters.year;
      filtered = filtered.filter(work =>
        work.year >= minYear && work.year <= maxYear
      );
    }

    // Sort results
    switch (searchQuery.sortBy) {
      case 'year':
        filtered.sort((a, b) => b.year - a.year);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
        break;
      case 'relevance':
      default:
        // For relevance, prioritize matches in title, then description
        if (searchQuery.term.trim()) {
          const searchTerm = searchQuery.term.toLowerCase();
          filtered.sort((a, b) => {
            const aScore = calculateRelevanceScore(a, searchTerm);
            const bScore = calculateRelevanceScore(b, searchTerm);
            return bScore - aScore;
          });
        } else {
          // Default sort by year when no search term
          filtered.sort((a, b) => b.year - a.year);
        }
        break;
    }

    return filtered;
  }, [works, searchQuery]);

  const calculateRelevanceScore = (work: ArchitecturalWork, searchTerm: string): number => {
    let score = 0;
    
    // Title matches get highest score
    if (work.title.toLowerCase().includes(searchTerm)) {
      score += 10;
    }
    
    // Category matches get medium score
    if (work.category.name.toLowerCase().includes(searchTerm)) {
      score += 5;
    }
    
    // Location matches get medium score
    if (work.location.toLowerCase().includes(searchTerm)) {
      score += 5;
    }
    
    // Description matches get lower score
    if (work.description.toLowerCase().includes(searchTerm)) {
      score += 2;
    }
    
    return score;
  };

  const handleSearch = (query: SearchQuery) => {
    setSearchQuery(query);
  };

  const handleReset = () => {
    setSearchQuery({
      term: '',
      filters: {
        category: [],
        type: ['work']
      },
      sortBy: 'relevance'
    });
  };

  return (
    <div className={className}>
      {/* Search Interface */}
      <WorksSearch
        onSearch={handleSearch}
        onReset={handleReset}
        totalResults={filteredWorks.length}
        className="mb-8"
      />

      {/* Results */}
      {filteredWorks.length > 0 ? (
        <WorksList works={filteredWorks} />
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">未找到匹配的作品</h3>
            <p className="mt-1 text-sm text-gray-500">
              尝试调整搜索条件或清除筛选器来查看更多结果。
            </p>
            <div className="mt-6">
              <button
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-copper hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-copper"
              >
                清除所有筛选
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Tips */}
      {searchQuery.term && filteredWorks.length === 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">搜索提示</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>尝试使用更通用的关键词</li>
                  <li>检查拼写是否正确</li>
                  <li>尝试搜索作品的位置或年份</li>
                  <li>使用筛选器按类型或年份范围查找</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilteredWorksList;