import React, { useState, useMemo } from 'react';
import { Scholar } from '@/types';
import { ScholarCard } from './ScholarCard';
import { ScholarDetail } from './ScholarDetail';

interface ScholarsListProps {
  scholars: Scholar[];
}

export const ScholarsList: React.FC<ScholarsListProps> = ({ scholars }) => {
  const [selectedScholar, setSelectedScholar] = useState<Scholar | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Get unique regions and specializations
  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(scholars.map(s => s.region)));
    return uniqueRegions.sort();
  }, [scholars]);

  const specializations = useMemo(() => {
    const allSpecs = scholars.flatMap(s => s.specialization);
    const uniqueSpecs = Array.from(new Set(allSpecs));
    return uniqueSpecs.sort();
  }, [scholars]);

  // Filter scholars based on selected criteria
  const filteredScholars = useMemo(() => {
    return scholars.filter(scholar => {
      // Region filter
      if (selectedRegion !== 'all' && scholar.region !== selectedRegion) {
        return false;
      }

      // Specialization filter
      if (selectedSpecialization !== 'all' && !scholar.specialization.includes(selectedSpecialization)) {
        return false;
      }

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          scholar.name.toLowerCase().includes(query) ||
          scholar.institution.toLowerCase().includes(query) ||
          scholar.biography.toLowerCase().includes(query) ||
          scholar.specialization.some(spec => spec.toLowerCase().includes(query)) ||
          scholar.publications.some(pub => 
            pub.title.toLowerCase().includes(query) ||
            pub.abstract.toLowerCase().includes(query) ||
            pub.keywords.some(keyword => keyword.toLowerCase().includes(query))
          )
        );
      }

      return true;
    });
  }, [scholars, selectedRegion, selectedSpecialization, searchQuery]);

  const regionLabels: Record<string, string> = {
    europe: '欧洲',
    northAmerica: '北美',
    asia: '亚洲',
    africa: '非洲',
    oceania: '大洋洲',
    southAmerica: '南美'
  };

  const specializationLabels: Record<string, string> = {
    architecturalHistory: '建筑史',
    industrialDesign: '工业设计',
    prefabricatedConstruction: '预制建筑',
    modernism: '现代主义',
    materialStudies: '材料研究'
  };

  const clearFilters = () => {
    setSelectedRegion('all');
    setSelectedSpecialization('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedRegion !== 'all' || selectedSpecialization !== 'all' || searchQuery !== '';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-optimized Filters and Search */}
      <div className="card-mobile">
        {/* Search - Always visible */}
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            搜索学者
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索姓名、机构、研究领域..."
            className="input-mobile"
          />
        </div>

        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-4 sm:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-primary-steel hover:text-primary-iron transition-colors btn-touch"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm font-medium">筛选条件</span>
            {hasActiveFilters && (
              <span className="bg-accent-copper text-white text-xs px-2 py-1 rounded-full">
                {[selectedRegion !== 'all', selectedSpecialization !== 'all', searchQuery !== ''].filter(Boolean).length}
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors btn-touch"
            >
              清除筛选
            </button>
          )}
        </div>

        {/* Filters - Collapsible on mobile, always visible on desktop */}
        <div className={`${showFilters ? 'block' : 'hidden'} sm:block space-y-4`}>
          <h3 className="text-lg font-semibold text-primary-iron hidden sm:block">筛选学者</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Region Filter */}
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                按地区筛选
              </label>
              <select
                id="region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="input-mobile"
              >
                <option value="all">所有地区</option>
                {regions.map(region => (
                  <option key={region} value={region}>
                    {regionLabels[region] || region}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialization Filter */}
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                按专业领域筛选
              </label>
              <select
                id="specialization"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="input-mobile"
              >
                <option value="all">所有领域</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>
                    {specializationLabels[spec] || spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear filters button for desktop */}
          {hasActiveFilters && (
            <div className="hidden sm:block">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                清除所有筛选条件
              </button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-neutral-medium text-sm text-gray-600">
          显示 <span className="font-medium">{filteredScholars.length}</span> 位学者
          {filteredScholars.length !== scholars.length && (
            <span className="text-gray-400">（共 {scholars.length} 位）</span>
          )}
        </div>
      </div>

      {/* Scholars Grid - Mobile optimized */}
      {filteredScholars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredScholars.map(scholar => (
            <ScholarCard
              key={scholar.id}
              scholar={scholar}
              onClick={setSelectedScholar}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-lg mb-2">未找到符合条件的学者</p>
            <p className="text-gray-400 text-sm">请尝试调整筛选条件或搜索关键词</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 btn-secondary text-sm"
              >
                清除筛选条件
              </button>
            )}
          </div>
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