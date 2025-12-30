import React from 'react';
import { Scholar } from '@/types';

interface ResearchSummaryProps {
  scholars: Scholar[];
}

interface ResearchInsight {
  title: string;
  description: string;
  count: number;
  icon: React.ReactNode;
}

export const ResearchSummary: React.FC<ResearchSummaryProps> = ({ scholars }) => {
  // Calculate research statistics
  const totalPublications = scholars.reduce((sum, scholar) => sum + scholar.publications.length, 0);
  const totalExhibitions = scholars.reduce((sum, scholar) => sum + scholar.exhibitions.length, 0);
  const uniqueRegions = new Set(scholars.map(s => s.region)).size;
  const uniqueInstitutions = new Set(scholars.map(s => s.institution)).size;

  // Get most common specializations
  const specializationCounts = scholars.reduce((acc, scholar) => {
    scholar.specialization.forEach(spec => {
      acc[spec] = (acc[spec] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topSpecializations = Object.entries(specializationCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Get recent publications (last 5 years)
  const currentYear = new Date().getFullYear();
  const recentPublications = scholars.flatMap(s => s.publications)
    .filter(p => p.year >= currentYear - 5)
    .length;

  const specializationLabels: Record<string, string> = {
    architecturalHistory: '建筑史',
    industrialDesign: '工业设计',
    prefabricatedConstruction: '预制建筑',
    modernism: '现代主义',
    materialStudies: '材料研究'
  };

  const insights: ResearchInsight[] = [
    {
      title: '全球学者网络',
      description: `来自 ${uniqueRegions} 个地区的 ${scholars.length} 位学者`,
      count: scholars.length,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: '学术出版物',
      description: `总计 ${totalPublications} 篇出版物，其中 ${recentPublications} 篇为近五年发表`,
      count: totalPublications,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: '展览项目',
      description: `参与 ${totalExhibitions} 个展览项目，推广普鲁维研究成果`,
      count: totalExhibitions,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: '研究机构',
      description: `分布在 ${uniqueInstitutions} 个知名学术机构`,
      count: uniqueInstitutions,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Research Overview */}
      <div className="bg-gradient-to-r from-primary-steel to-primary-iron text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">让·普鲁维全球研究概览</h2>
        <p className="text-lg opacity-90 leading-relaxed">
          全球学者正在深入研究让·普鲁维的建筑创新和设计哲学，通过跨学科的方法探索他在预制建筑、
          工业设计和现代主义建筑方面的贡献。这些研究不仅揭示了普鲁维作品的历史价值，
          也为当代可持续建筑和工业设计提供了重要启示。
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-accent-copper mb-4 flex justify-center">
              {insight.icon}
            </div>
            <h3 className="text-lg font-semibold text-primary-iron mb-2">
              {insight.title}
            </h3>
            <p className="text-3xl font-bold text-accent-copper mb-2">
              {insight.count}
            </p>
            <p className="text-sm text-gray-600">
              {insight.description}
            </p>
          </div>
        ))}
      </div>

      {/* Research Focus Areas */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-xl font-semibold text-primary-iron mb-6">主要研究领域</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topSpecializations.map(([spec, count]) => (
            <div key={spec} className="text-center">
              <div className="w-16 h-16 bg-accent-copper/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-copper">
                  {count}
                </span>
              </div>
              <h4 className="font-semibold text-primary-iron mb-2">
                {specializationLabels[spec] || spec}
              </h4>
              <p className="text-sm text-gray-600">
                {count} 位学者专注于此领域
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Research Impact */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-xl font-semibold text-primary-iron mb-6">研究影响与贡献</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-primary-steel mb-3">学术贡献</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-copper rounded-full mt-2 mr-3 flex-shrink-0"></span>
                深入分析普鲁维的预制建筑技术及其对现代建筑的影响
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-copper rounded-full mt-2 mr-3 flex-shrink-0"></span>
                探索工业设计与建筑的融合，推动跨学科研究
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-copper rounded-full mt-2 mr-3 flex-shrink-0"></span>
                材料创新研究为可持续建筑提供新思路
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary-steel mb-3">当代意义</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-copper rounded-full mt-2 mr-3 flex-shrink-0"></span>
                为现代预制建筑和模块化设计提供理论基础
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-copper rounded-full mt-2 mr-3 flex-shrink-0"></span>
                启发当代建筑师重新思考材料与结构的关系
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-copper rounded-full mt-2 mr-3 flex-shrink-0"></span>
                推动可持续建筑和循环经济理念的发展
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};