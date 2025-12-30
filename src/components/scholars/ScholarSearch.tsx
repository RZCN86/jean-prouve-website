import React, { useState, useMemo } from 'react';
import { Scholar, Publication, Exhibition } from '@/types';
import { ScholarCard } from './ScholarCard';
import { PublicationCard } from './PublicationCard';
import { ExhibitionCard } from './ExhibitionCard';
import { ScholarDetail } from './ScholarDetail';

interface ScholarSearchProps {
  scholars: Scholar[];
}

type SearchType = 'all' | 'scholars' | 'publications' | 'exhibitions';

interface SearchResult {
  type: 'scholar' | 'publication' | 'exhibition';
  scholar?: Scholar;
  publication?: Publication;
  exhibition?: Exhibition;
  authorName?: string;
  relevanceScore: number;
}

export const ScholarSearch: React.FC<ScholarSearchProps> = ({ scholars }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [selectedScholar, setSelectedScholar] = useState<Scholar | null>(null);

  // Perform search across all content types
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    scholars.forEach(scholar => {
      // Search in scholar information
      if (searchType === 'all' || searchType === 'scholars') {
        let scholarScore = 0;
        
        if (scholar.name.toLowerCase().includes(query)) scholarScore += 10;
        if (scholar.institution.toLowerCase().includes(query)) scholarScore += 8;
        if (scholar.biography.toLowerCase().includes(query)) scholarScore += 5;
        if (scholar.specialization.some(spec => spec.toLowerCase().includes(query))) scholarScore += 7;
        if (scholar.country.toLowerCase().includes(query)) scholarScore += 3;

        if (scholarScore > 0) {
          results.push({
            type: 'scholar',
            scholar,
            relevanceScore: scholarScore
          });
        }
      }

      // Search in publications
      if (searchType === 'all' || searchType === 'publications') {
        scholar.publications.forEach(publication => {
          let pubScore = 0;
          
          if (publication.title.toLowerCase().includes(query)) pubScore += 10;
          if (publication.abstract.toLowerCase().includes(query)) pubScore += 6;
          if (publication.keywords.some(keyword => keyword.toLowerCase().includes(query))) pubScore += 8;
          if (publication.publisher?.toLowerCase().includes(query)) pubScore += 4;

          if (pubScore > 0) {
            results.push({
              type: 'publication',
              publication,
              authorName: scholar.name,
              scholar,
              relevanceScore: pubScore
            });
          }
        });
      }

      // Search in exhibitions
      if (searchType === 'all' || searchType === 'exhibitions') {
        scholar.exhibitions.forEach(exhibition => {
          let exhScore = 0;
          
          if (exhibition.title.toLowerCase().includes(query)) exhScore += 10;
          if (exhibition.description.toLowerCase().includes(query)) exhScore += 6;
          if (exhibition.venue.toLowerCase().includes(query)) exhScore += 7;
          if (exhibition.role.toLowerCase().includes(query)) exhScore += 5;

          if (exhScore > 0) {
            results.push({
              type: 'exhibition',
              exhibition,
              authorName: scholar.name,
              scholar,
              relevanceScore: exhScore
            });
          }
        });
      }
    });

    // Sort by relevance score
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [searchQuery, searchType, scholars]);

  const searchTypeLabels: Record<SearchType, string> = {
    all: '全部内容',
    scholars: '学者',
    publications: '出版物',
    exhibitions: '展览'
  };

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-primary-iron mb-4">搜索学者研究</h3>
        
        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索学者、出版物、展览..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-copper focus:border-transparent text-lg"
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
        </div>

        {/* Search Type Filter */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(searchTypeLabels) as SearchType[]).map(type => (
            <button
              key={type}
              onClick={() => setSearchType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                searchType === type
                  ? 'bg-accent-copper text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {searchTypeLabels[type]}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="mt-4 text-sm text-gray-600">
            找到 {searchResults.length} 个结果
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div key={index}>
                {result.type === 'scholar' && result.scholar && (
                  <ScholarCard
                    scholar={result.scholar}
                    onClick={setSelectedScholar}
                  />
                )}
                {result.type === 'publication' && result.publication && (
                  <PublicationCard
                    publication={result.publication}
                    showAuthor={true}
                    authorName={result.authorName}
                  />
                )}
                {result.type === 'exhibition' && result.exhibition && (
                  <ExhibitionCard
                    exhibition={result.exhibition}
                    showAuthor={true}
                    authorName={result.authorName}
                  />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <svg 
                className="mx-auto w-12 h-12 text-gray-400 mb-4"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <p className="text-gray-500 text-lg">未找到相关结果</p>
              <p className="text-gray-400 text-sm mt-2">请尝试使用不同的关键词</p>
            </div>
          )}
        </div>
      )}

      {/* Default state when no search */}
      {!searchQuery && (
        <div className="text-center py-12">
          <svg 
            className="mx-auto w-16 h-16 text-gray-300 mb-4"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          <p className="text-gray-500 text-lg">开始搜索学者研究内容</p>
          <p className="text-gray-400 text-sm mt-2">输入关键词搜索学者、出版物或展览</p>
        </div>
      )}

      {/* Scholar Detail Modal */}
      {selectedScholar && (
        <ScholarDetail
          scholar={selectedScholar}
          onClose={() => setSelectedScholar(null)}
        />
      )}
    </div>
  );
};