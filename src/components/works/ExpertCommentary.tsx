import React, { useState } from 'react';
import { ExpertAnalysis, TechnicalAnalysis, HistoricalContext, ContemporaryInfluence } from '@/types';

interface ExpertCommentaryProps {
  workId: string;
  expertAnalyses?: ExpertAnalysis[];
  technicalAnalysis?: TechnicalAnalysis;
  historicalContext?: HistoricalContext;
  contemporaryInfluence?: ContemporaryInfluence;
}

export const ExpertCommentary: React.FC<ExpertCommentaryProps> = ({
  workId,
  expertAnalyses = [],
  technicalAnalysis,
  historicalContext,
  contemporaryInfluence
}) => {
  const [activeSection, setActiveSection] = useState<'analyses' | 'technical' | 'historical' | 'contemporary'>('analyses');

  const sections = [
    { id: 'analyses' as const, label: '专家分析', icon: '👥', count: expertAnalyses.length },
    { id: 'technical' as const, label: '技术分析', icon: '🔧', available: !!technicalAnalysis },
    { id: 'historical' as const, label: '历史背景', icon: '📚', available: !!historicalContext },
    { id: 'contemporary' as const, label: '当代影响', icon: '🌟', available: !!contemporaryInfluence }
  ];

  const getAnalysisTypeLabel = (type: string) => {
    const labels = {
      technical: '技术分析',
      historical: '历史研究',
      cultural: '文化意义',
      contemporary: '当代影响',
      material: '材料研究'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white">
      {/* Section Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {sections.map((section) => {
            const isAvailable = section.id === 'analyses' || section.available;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => isAvailable && setActiveSection(section.id)}
                disabled={!isAvailable}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  isActive
                    ? 'border-accent-copper text-accent-copper'
                    : isAvailable
                    ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    : 'border-transparent text-gray-300 cursor-not-allowed'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
                {section.count !== undefined && (
                  <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                    isActive ? 'bg-accent-copper text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {section.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {activeSection === 'analyses' && (
          <div>
            <h3 className="text-xl font-semibold text-primary-iron mb-4">专家分析</h3>
            {expertAnalyses.length > 0 ? (
              <div className="space-y-6">
                {expertAnalyses.map((analysis) => (
                  <div key={analysis.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    {/* Author Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-accent-copper rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {analysis.author.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{analysis.author}</h4>
                          {analysis.institution && (
                            <p className="text-sm text-gray-600">{analysis.institution}</p>
                          )}
                          <p className="text-xs text-gray-500">{formatDate(analysis.date)}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {getAnalysisTypeLabel(analysis.type)}
                      </span>
                    </div>

                    {/* Analysis Content */}
                    <div className="mb-4">
                      <h5 className="text-lg font-medium text-gray-900 mb-2">{analysis.title}</h5>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed">{analysis.content}</p>
                      </div>
                    </div>

                    {/* Author Bio */}
                    {analysis.authorBio && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 italic">{analysis.authorBio}</p>
                      </div>
                    )}

                    {/* Tags */}
                    {analysis.tags && analysis.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {analysis.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary-aluminum text-primary-steel text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* References */}
                    {analysis.references && analysis.references.length > 0 && (
                      <div className="border-t border-gray-200 pt-4">
                        <h6 className="text-sm font-medium text-gray-900 mb-2">参考文献</h6>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {analysis.references.map((ref, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-gray-400 mr-2">{index + 1}.</span>
                              <span>{ref}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>暂无专家分析内容</p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'technical' && technicalAnalysis && (
          <div>
            <h3 className="text-xl font-semibold text-primary-iron mb-4">技术分析</h3>
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">{technicalAnalysis.title}</h4>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <span>{technicalAnalysis.author}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(technicalAnalysis.date)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Construction Method */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">建造方法</h5>
                  <p className="text-gray-700 leading-relaxed">{technicalAnalysis.constructionMethod}</p>
                </div>

                {/* Materials Analysis */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">材料分析</h5>
                  <div className="space-y-3">
                    {technicalAnalysis.materials.map((material, index) => (
                      <div key={index} className="border-l-4 border-accent-copper pl-4">
                        <h6 className="font-medium text-gray-800">{material.material}</h6>
                        <p className="text-sm text-gray-600 mb-2">{material.usage}</p>
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">特性：</span>
                          {material.properties.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Innovations */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">技术创新</h5>
                  <ul className="space-y-2">
                    {technicalAnalysis.innovations.map((innovation, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-4 h-4 text-accent-copper mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{innovation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Challenges */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">技术挑战</h5>
                  <ul className="space-y-2">
                    {technicalAnalysis.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-4 h-4 text-yellow-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Impact */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h5 className="font-medium text-gray-900 mb-3">技术影响</h5>
                <p className="text-gray-700 leading-relaxed">{technicalAnalysis.impact}</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'historical' && historicalContext && (
          <div>
            <h3 className="text-xl font-semibold text-primary-iron mb-4">历史背景</h3>
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="mb-6">
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <span>{historicalContext.author}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(historicalContext.date)}</span>
                  <span className="mx-2">•</span>
                  <span className="font-medium">{historicalContext.period}</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Social Context */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-accent-copper" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                    社会背景
                  </h5>
                  <p className="text-gray-700 leading-relaxed">{historicalContext.socialContext}</p>
                </div>

                {/* Political Context */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-accent-copper" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    政治环境
                  </h5>
                  <p className="text-gray-700 leading-relaxed">{historicalContext.politicalContext}</p>
                </div>

                {/* Economic Context */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-accent-copper" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    经济条件
                  </h5>
                  <p className="text-gray-700 leading-relaxed">{historicalContext.economicContext}</p>
                </div>

                {/* Cultural Significance */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-accent-copper" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                    文化意义
                  </h5>
                  <p className="text-gray-700 leading-relaxed">{historicalContext.culturalSignificance}</p>
                </div>

                {/* Influences */}
                {historicalContext.influences.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">历史影响因素</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {historicalContext.influences.map((influence, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <svg className="w-4 h-4 text-accent-copper mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{influence}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'contemporary' && contemporaryInfluence && (
          <div>
            <h3 className="text-xl font-semibold text-primary-iron mb-4">当代影响</h3>
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">{contemporaryInfluence.title}</h4>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <span>{contemporaryInfluence.author}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(contemporaryInfluence.date)}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{contemporaryInfluence.description}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Influenced Works */}
                {contemporaryInfluence.influencedWorks.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">影响的作品</h5>
                    <ul className="space-y-2">
                      {contemporaryInfluence.influencedWorks.map((work, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-4 h-4 text-accent-copper mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{work}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Influenced Architects */}
                {contemporaryInfluence.influencedArchitects.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">影响的建筑师</h5>
                    <ul className="space-y-2">
                      {contemporaryInfluence.influencedArchitects.map((architect, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-4 h-4 text-accent-copper mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{architect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Modern Applications */}
                {contemporaryInfluence.modernApplications.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">现代应用</h5>
                    <ul className="space-y-2">
                      {contemporaryInfluence.modernApplications.map((application, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-4 h-4 text-accent-copper mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{application}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Relevance Today */}
                <div className="lg:col-span-2">
                  <h5 className="font-medium text-gray-900 mb-3">当代相关性</h5>
                  <div className="p-4 bg-accent-copper bg-opacity-10 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{contemporaryInfluence.relevanceToday}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertCommentary;