import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { SearchQuery, SearchResult, SearchFilters } from '@/types';
import { performGlobalSearch, getGlobalSearchFilters, getSearchSuggestions } from '@/utils/search';
import { useDebounce } from '@/utils/performance';

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
  showFilters?: boolean;
  onResultClick?: (result: SearchResult) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  className = '',
  placeholder,
  showFilters = true,
  onResultClick
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<SearchQuery['sortBy']>('relevance');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);
  const debouncedSuggestionQuery = useDebounce(query, 150);

  // Get filter options
  const filterOptions = getGlobalSearchFilters();

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsSearching(true);
      const searchQuery: SearchQuery = {
        term: debouncedQuery,
        filters,
        sortBy
      };
      
      const searchResults = performGlobalSearch(searchQuery);
      setResults(searchResults);
      setShowResults(true);
      setShowSuggestions(false);
      setIsSearching(false);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [debouncedQuery, filters, sortBy]);

  // Get suggestions when query changes
  useEffect(() => {
    if (debouncedSuggestionQuery.trim() && debouncedSuggestionQuery.length >= 2) {
      const searchSuggestions = getSearchSuggestions(debouncedSuggestionQuery);
      setSuggestions(searchSuggestions);
      setShowSuggestions(searchSuggestions.length > 0 && !showResults);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSuggestionQuery, showResults]);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults && !showSuggestions) return;

    const items = showSuggestions ? suggestions : results;
    const maxIndex = items.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (showSuggestions) {
            setQuery(suggestions[selectedIndex]);
            setShowSuggestions(false);
          } else {
            handleResultClick(results[selectedIndex]);
          }
        }
        break;
      case 'Escape':
        setShowResults(false);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    } else {
      // Default navigation logic
      let path = '';
      switch (result.type) {
        case 'work':
          path = `/works/${result.id}`;
          break;
        case 'scholar':
          path = `/scholars/${result.id}`;
          break;
        case 'biography':
          path = `/biography#${result.metadata.section || ''}`;
          break;
        default:
          path = `/search?q=${encodeURIComponent(query)}`;
      }
      router.push(path);
    }
    setShowResults(false);
    setShowSuggestions(false);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle filter change
  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Get result type display name
  const getResultTypeDisplay = (type: SearchResult['type']) => {
    const typeNames = {
      work: '作品',
      scholar: '学者',
      biography: '传记',
      publication: '出版物'
    };
    return typeNames[type] || type;
  };

  // Highlight search term in text
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setShowResults(true);
            if (suggestions.length > 0 && !results.length) setShowSuggestions(true);
          }}
          placeholder={placeholder || t('search.placeholder', '搜索作品、学者、传记...')}
          className="w-full px-4 py-3 pl-12 pr-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Loading Indicator */}
        {isSearching && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 flex flex-wrap gap-4">
          {/* Content Type Filter */}
          <select
            value={filters.type?.[0] || ''}
            onChange={(e) => handleFilterChange('type', e.target.value ? [e.target.value] : undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">所有类型</option>
            {filterOptions.types.map(type => (
              <option key={type.id} value={type.id}>
                {type.name} ({type.count})
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filters.category?.[0] || ''}
            onChange={(e) => handleFilterChange('category', e.target.value ? [e.target.value] : undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">所有分类</option>
            {filterOptions.categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>

          {/* Region Filter */}
          <select
            value={filters.region?.[0] || ''}
            onChange={(e) => handleFilterChange('region', e.target.value ? [e.target.value] : undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">所有地区</option>
            {filterOptions.regions.map(region => (
              <option key={region.id} value={region.id}>
                {region.name} ({region.count})
              </option>
            ))}
          </select>

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SearchQuery['sortBy'])}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="relevance">相关性</option>
            <option value="year">年份</option>
            <option value="title">标题</option>
            <option value="author">作者</option>
          </select>
        </div>
      )}

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                index === selectedIndex ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {suggestion}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <>
              <div className="px-4 py-2 border-b border-gray-100 text-sm text-gray-600">
                找到 {results.length} 个结果
              </div>
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    index === selectedIndex ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                          {getResultTypeDisplay(result.type)}
                        </span>
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {highlightSearchTerm(result.title, query)}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {highlightSearchTerm(result.excerpt, query)}
                      </p>
                      {result.metadata.year && (
                        <p className="text-xs text-gray-500 mt-1">
                          {result.metadata.year}年
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full opacity-60"></div>
                    </div>
                  </div>
                </button>
              ))}
              {results.length > 10 && (
                <div className="px-4 py-3 border-t border-gray-100 text-center">
                  <button
                    onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    查看所有 {results.length} 个结果 →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm">未找到相关结果</p>
              <p className="text-xs mt-1">尝试使用不同的关键词</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;