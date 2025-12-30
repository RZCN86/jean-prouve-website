import React from 'react';
import { Scholar } from '@/types';

interface ScholarCardProps {
  scholar: Scholar;
  onClick?: (scholar: Scholar) => void;
}

export const ScholarCard: React.FC<ScholarCardProps> = ({ scholar, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(scholar);
    }
  };

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

  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 ${
        onClick ? 'cursor-pointer hover:bg-gray-50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-primary-iron mb-2">
            {scholar.name}
          </h3>
          <p className="text-primary-steel font-medium">
            {scholar.institution}
          </p>
          <p className="text-sm text-gray-600">
            {scholar.country} • {regionLabels[scholar.region] || scholar.region}
          </p>
        </div>

        {/* Specializations */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {scholar.specialization.map((spec, index) => (
              <span
                key={index}
                className="inline-block bg-accent-copper/10 text-accent-copper px-3 py-1 rounded-full text-sm font-medium"
              >
                {specializationLabels[spec] || spec}
              </span>
            ))}
          </div>
        </div>

        {/* Biography excerpt */}
        <div className="mb-4 flex-grow">
          <p className="text-gray-700 text-sm line-clamp-3">
            {scholar.biography}
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm text-gray-600 pt-4 border-t border-gray-200">
          <span>{scholar.publications.length} 篇出版物</span>
          <span>{scholar.exhibitions.length} 个展览</span>
        </div>
      </div>
    </div>
  );
};