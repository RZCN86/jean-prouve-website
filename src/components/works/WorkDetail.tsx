import React, { useState } from 'react';
import Image from 'next/image';
import { ArchitecturalWork } from '@/types';
import { ImageGallery } from './ImageGallery';
import { ExpertCommentary } from './ExpertCommentary';
import { InfluenceAnalysis } from './InfluenceAnalysis';
import { MaterialAnalysis } from './MaterialAnalysis';

interface WorkDetailProps {
  work: ArchitecturalWork;
}

export const WorkDetail: React.FC<WorkDetailProps> = ({ work }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'commentary' | 'influence' | 'materials'>('overview');
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const statusColors = {
    existing: 'bg-green-100 text-green-800',
    demolished: 'bg-red-100 text-red-800',
    reconstructed: 'bg-blue-100 text-blue-800'
  };

  const statusLabels = {
    existing: '现存',
    demolished: '已拆除',
    reconstructed: '重建'
  };

  const tabs = [
    { id: 'overview' as const, label: '概览', icon: '📋' },
    { id: 'technical' as const, label: '技术规格', icon: '🔧' },
    { id: 'commentary' as const, label: '专家评论', icon: '💬' },
    { id: 'influence' as const, label: '影响分析', icon: '🌟' },
    { id: 'materials' as const, label: '材料分析', icon: '🧱' }
  ];

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowGallery(true);
  };

  const allImages = [...work.images, ...work.technicalDrawings];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-lg text-gray-500">{work.year}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[work.status]}`}>
              {statusLabels[work.status]}
            </span>
          </div>
          <span className="text-sm text-primary-steel bg-primary-aluminum px-3 py-1 rounded-full">
            {work.category.name}
          </span>
        </div>
        
        <h1 className="text-4xl font-bold text-primary-iron mb-4">
          {work.title}
        </h1>
        
        <div className="flex items-center text-gray-600 mb-6">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {work.location}
        </div>
        
        <p className="text-xl text-gray-700 leading-relaxed">
          {work.description}
        </p>
      </div>

      {/* Main Image Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-primary-iron mb-4">项目图像</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {work.images.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM12 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM12 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" clipRule="evenodd" />
                </svg>
              </div>
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-sm">
                  {image.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-accent-copper text-accent-copper'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold mb-4">项目概述</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {work.description}
              </p>
              
              <h4 className="text-lg font-semibold mb-3">基本信息</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="font-medium text-gray-900">建造年份</dt>
                  <dd className="text-gray-700">{work.year}</dd>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="font-medium text-gray-900">项目位置</dt>
                  <dd className="text-gray-700">{work.location}</dd>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="font-medium text-gray-900">项目类型</dt>
                  <dd className="text-gray-700">{work.category.name}</dd>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="font-medium text-gray-900">当前状态</dt>
                  <dd className="text-gray-700">{statusLabels[work.status]}</dd>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'technical' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">技术规格</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">规格参数</h4>
                  <div className="space-y-3">
                    {work.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-900">{spec.property}</span>
                        <span className="text-gray-700">
                          {spec.value} {spec.unit || ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {work.technicalDrawings.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3">技术图纸</h4>
                    <div className="space-y-4">
                      {work.technicalDrawings.map((drawing, index) => (
                        <div
                          key={drawing.id}
                          className="relative aspect-[3/2] bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                          onClick={() => handleImageClick(work.images.length + index)}
                        >
                          <Image
                            src={drawing.src}
                            alt={drawing.alt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          {drawing.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-sm">
                              {drawing.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'commentary' && (
            <ExpertCommentary
              workId={work.id}
              expertAnalyses={work.expertAnalyses}
              technicalAnalysis={work.technicalAnalysis}
              historicalContext={work.historicalContext}
              contemporaryInfluence={work.contemporaryInfluence}
            />
          )}

          {activeTab === 'influence' && (
            <InfluenceAnalysis work={work} />
          )}

          {activeTab === 'materials' && (
            <MaterialAnalysis work={work} />
          )}
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showGallery && (
        <ImageGallery
          images={allImages}
          initialIndex={selectedImageIndex}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
};

export default WorkDetail;