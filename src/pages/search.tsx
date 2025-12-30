import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Layout from '@/components/common/Layout';
import GlobalSearch from '@/components/common/GlobalSearch';
import { SearchQuery, SearchResult, SearchFilters } from '@/types';
import { performGlobalSearch, getGlobalSearchFilters } from '@/utils/search';

interface SearchPageProps {
  initialQuery?: string;
  initialResults: SearchResult[];
  filterOptions: ReturnType<typeof getGlobalSearchFilters>;
}

const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = '',
  initialResults,
  filterOptions
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>(initialResults);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<SearchQuery['sortBy']>('relevance');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
  const resultsPerPage = 20;
  const totalPages = Math.ceil(results.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  // Update URL when search parameters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.type?.length) params.set('type', filters.type.join(','));
    if (filters.category?.length) params.set('category', filters.category.join(','));
    if (filters.region?.length) params.set('region', filters.region.join(','));
    if (filters.year) params.set('year', `${filters.year[0]}-${filters.year[1]}`);
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ''}`;
    if (router.asPath !== newUrl) {
      router.replace(newUrl, undefined, { shallow: true });
    }
  }, [query, filters, sortBy, currentPage, router]);

  // Perform search when parameters change
  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      const searchQuery: SearchQuery = {
        term: query,
        filters,
        sortBy
      };
      
      const searchResults = performGlobalSearch(searchQuery);
      setResults(searchResults);
      setCurrentPage(1);
      setIsLoading(false);
    }
  }, [query, filters, sortBy]);

  // Handle filter changes
  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
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
        return;
    }
    router.push(path);
  };

  // Get result type display name
  const getResultTypeDisplay = (type: SearchResult['type']) => {
    const typeNames = {
      work: '建筑作品',
      scholar: '学者研究',
      biography: '传记内容',
      publication: '出版物'
    };
    return typeNames[type] || type;
  };

  // Get result type color
  const getResultTypeColor = (type: SearchResult['type']) => {
    const colors = {
      work: 'bg-blue-100 text-blue-800',
      scholar: 'bg-green-100 text-green-800',
      biography: 'bg-purple-100 text-purple-800',
      publication: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
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
    <Layout>
      <Head>
        <title>{query ? `搜索: ${query}` : '全站搜索'} - 让·普鲁维研究网站</title>
        <meta name="description" content={`搜索让·普鲁维的建筑作品、学者研究和传记内容${query ? `: ${query}` : ''}`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              全站搜索
            </h1>
            <p className="text-lg text-gray-600">
              搜索让·普鲁维的建筑作品、学者研究和传记内容
            </p>
          </div>

          {/* Search Interface */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <GlobalSearch
              className="mb-6"
              placeholder="搜索作品、学者、传记..."
              showFilters={true}
              onResultClick={handleResultClick}
            />
          </div>

          {/* Search Results */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">筛选条件</h3>
                
                {/* Content Type Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">内容类型</h4>
                  <div className="space-y-2">
                    {filterOptions.types.map(type => (
                      <label key={type.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.type?.includes(type.id) || false}
                          onChange={(e) => {
                            const currentTypes = filters.type || [];
                            const newTypes = e.target.checked
                              ? [...currentTypes, type.id]
                              : currentTypes.filter(t => t !== type.id);
                            handleFilterChange('type', newTypes.length > 0 ? newTypes : undefined);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {type.name} ({type.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">作品分类</h4>
                  <div className="space-y-2">
                    {filterOptions.categories.map(category => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.category?.includes(category.id) || false}
                          onChange={(e) => {
                            const currentCategories = filters.category || [];
                            const newCategories = e.target.checked
                              ? [...currentCategories, category.id]
                              : currentCategories.filter(c => c !== category.id);
                            handleFilterChange('category', newCategories.length > 0 ? newCategories : undefined);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {category.name} ({category.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Region Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">学者地区</h4>
                  <div className="space-y-2">
                    {filterOptions.regions.map(region => (
                      <label key={region.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.region?.includes(region.id) || false}
                          onChange={(e) => {
                            const currentRegions = filters.region || [];
                            const newRegions = e.target.checked
                              ? [...currentRegions, region.id]
                              : currentRegions.filter(r => r !== region.id);
                            handleFilterChange('region', newRegions.length > 0 ? newRegions : undefined);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {region.name} ({region.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Year Range Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">年份范围</h4>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min={filterOptions.yearRange[0]}
                      max={filterOptions.yearRange[1]}
                      value={filters.year?.[0] || filterOptions.yearRange[0]}
                      onChange={(e) => {
                        const minYear = parseInt(e.target.value);
                        const maxYear = filters.year?.[1] || filterOptions.yearRange[1];
                        handleFilterChange('year', [minYear, maxYear]);
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{filters.year?.[0] || filterOptions.yearRange[0]}</span>
                      <span>{filters.year?.[1] || filterOptions.yearRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setFilters({});
                    setSortBy('relevance');
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  清除所有筛选
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    搜索结果
                  </h2>
                  {query && (
                    <span className="text-sm text-gray-600">
                      &quot;{query}&quot; 的搜索结果 ({results.length} 个)
                    </span>
                  )}
                </div>
                
                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SearchQuery['sortBy'])}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="relevance">按相关性排序</option>
                  <option value="year">按年份排序</option>
                  <option value="title">按标题排序</option>
                  <option value="author">按作者排序</option>
                </select>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">搜索中...</span>
                </div>
              )}

              {/* Results List */}
              {!isLoading && (
                <div className="space-y-6">
                  {currentResults.length > 0 ? (
                    currentResults.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 ${getResultTypeColor(result.type)}`}>
                                {getResultTypeDisplay(result.type)}
                              </span>
                              {result.metadata.year && (
                                <span className="text-sm text-gray-500">
                                  {result.metadata.year}年
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {highlightSearchTerm(result.title, query)}
                            </h3>
                            <p className="text-gray-600 mb-3 line-clamp-3">
                              {highlightSearchTerm(result.excerpt, query)}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              {result.metadata.location && (
                                <span className="mr-4">📍 {result.metadata.location}</span>
                              )}
                              {result.metadata.institution && (
                                <span className="mr-4">🏛️ {result.metadata.institution}</span>
                              )}
                              {result.metadata.categoryName && (
                                <span className="mr-4">🏗️ {result.metadata.categoryName}</span>
                              )}
                            </div>
                          </div>
                          <div className="ml-6 flex-shrink-0">
                            <div className="w-3 h-3 bg-blue-500 rounded-full opacity-60"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关结果</h3>
                      <p className="text-gray-600">尝试使用不同的关键词或调整筛选条件</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    显示第 {startIndex + 1} - {Math.min(endIndex, results.length)} 个结果，共 {results.length} 个
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      上一页
                    </button>
                    <span className="px-3 py-2 text-sm text-gray-700">
                      第 {currentPage} 页，共 {totalPages} 页
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      下一页
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const searchQuery = query.q as string || '';
  const filterOptions = getGlobalSearchFilters();
  
  let initialResults: SearchResult[] = [];
  if (searchQuery) {
    const searchParams: SearchQuery = {
      term: searchQuery,
      filters: {},
      sortBy: 'relevance'
    };
    initialResults = performGlobalSearch(searchParams);
  }

  return {
    props: {
      initialQuery: searchQuery,
      initialResults,
      filterOptions,
      ...(await serverSideTranslations(locale ?? 'zh', ['common']))
    }
  };
};

export default SearchPage;