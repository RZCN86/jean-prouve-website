import React from 'react';
import { Scholar } from '@/types';

interface ScholarDetailProps {
  scholar: Scholar;
  onClose?: () => void;
}

export const ScholarDetail: React.FC<ScholarDetailProps> = ({ scholar, onClose }) => {
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

  const publicationTypeLabels: Record<string, string> = {
    book: '书籍',
    article: '文章',
    thesis: '论文',
    conference: '会议论文'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-primary-iron mb-2">
              {scholar.name}
            </h2>
            <p className="text-lg text-primary-steel font-medium">
              {scholar.institution}
            </p>
            <p className="text-gray-600">
              {scholar.country} • {regionLabels[scholar.region] || scholar.region}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-light"
              aria-label="关闭"
            >
              ×
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Specializations */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-primary-iron mb-3">研究领域</h3>
            <div className="flex flex-wrap gap-2">
              {scholar.specialization.map((spec, index) => (
                <span
                  key={index}
                  className="inline-block bg-accent-copper/10 text-accent-copper px-4 py-2 rounded-full font-medium"
                >
                  {specializationLabels[spec] || spec}
                </span>
              ))}
            </div>
          </div>

          {/* Biography */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-primary-iron mb-3">学者简介</h3>
            <p className="text-gray-700 leading-relaxed">
              {scholar.biography}
            </p>
          </div>

          {/* Contact Information */}
          {(scholar.contact.email || scholar.contact.website || scholar.contact.phone) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-primary-iron mb-3">联系方式</h3>
              <div className="space-y-2">
                {scholar.contact.email && (
                  <div className="flex items-center">
                    <span className="text-gray-600 w-16">邮箱:</span>
                    <a 
                      href={`mailto:${scholar.contact.email}`}
                      className="text-accent-copper hover:underline"
                    >
                      {scholar.contact.email}
                    </a>
                  </div>
                )}
                {scholar.contact.website && (
                  <div className="flex items-center">
                    <span className="text-gray-600 w-16">网站:</span>
                    <a 
                      href={scholar.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-copper hover:underline"
                    >
                      {scholar.contact.website}
                    </a>
                  </div>
                )}
                {scholar.contact.phone && (
                  <div className="flex items-center">
                    <span className="text-gray-600 w-16">电话:</span>
                    <span className="text-gray-700">{scholar.contact.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Publications */}
          {scholar.publications.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-primary-iron mb-3">
                主要出版物 ({scholar.publications.length})
              </h3>
              <div className="space-y-4">
                {scholar.publications.map((publication) => (
                  <div key={publication.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-primary-iron flex-1">
                        {publication.title}
                      </h4>
                      <span className="text-sm text-gray-500 ml-4">
                        {publication.year}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-2 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {publicationTypeLabels[publication.type] || publication.type}
                      </span>
                      {publication.publisher && (
                        <span>{publication.publisher}</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-3">
                      {publication.abstract}
                    </p>
                    {publication.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {publication.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                    {publication.url && (
                      <div className="mt-2">
                        <a
                          href={publication.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-copper hover:underline text-sm"
                        >
                          查看出版物 →
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exhibitions */}
          {scholar.exhibitions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-primary-iron mb-3">
                参与展览 ({scholar.exhibitions.length})
              </h3>
              <div className="space-y-4">
                {scholar.exhibitions.map((exhibition) => (
                  <div key={exhibition.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-primary-iron flex-1">
                        {exhibition.title}
                      </h4>
                      <span className="text-sm text-gray-500 ml-4">
                        {exhibition.year}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">{exhibition.venue}</span>
                      <span className="mx-2">•</span>
                      <span>{exhibition.role}</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      {exhibition.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};