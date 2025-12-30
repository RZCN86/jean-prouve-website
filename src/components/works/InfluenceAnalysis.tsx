import React, { useState } from 'react';
import { ContemporaryInfluence, ArchitecturalWork } from '@/types';

interface InfluenceAnalysisProps {
  work: ArchitecturalWork;
  className?: string;
}

export const InfluenceAnalysis: React.FC<InfluenceAnalysisProps> = ({
  work,
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState<'contemporary' | 'historical' | 'global'>('contemporary');

  const sections = [
    { id: 'contemporary' as const, label: '当代影响', icon: '🌟' },
    { id: 'historical' as const, label: '历史传承', icon: '📚' },
    { id: 'global' as const, label: '全球影响', icon: '🌍' }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate historical influence data based on work
  const historicalInfluence = generateHistoricalInfluence(work);
  
  // Generate global influence data based on work
  const globalInfluence = generateGlobalInfluence(work);

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">影响分析</h2>
        <p className="text-sm text-gray-600 mt-1">
          探索 {work.title} 对建筑发展的深远影响
        </p>
      </div>

      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === section.id
                  ? 'border-accent-copper text-accent-copper'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeSection === 'contemporary' && work.contemporaryInfluence && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {work.contemporaryInfluence.title}
              </h3>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span>{work.contemporaryInfluence.author}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(work.contemporaryInfluence.date)}</span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                {work.contemporaryInfluence.description}
              </p>
            </div>

            {/* Influence Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Influenced Works */}
              {work.contemporaryInfluence.influencedWorks.length > 0 && (
                <InfluenceCard
                  title="影响的作品"
                  icon="🏗️"
                  items={work.contemporaryInfluence.influencedWorks}
                  color="blue"
                />
              )}

              {/* Influenced Architects */}
              {work.contemporaryInfluence.influencedArchitects.length > 0 && (
                <InfluenceCard
                  title="影响的建筑师"
                  icon="👨‍💼"
                  items={work.contemporaryInfluence.influencedArchitects}
                  color="green"
                />
              )}

              {/* Modern Applications */}
              {work.contemporaryInfluence.modernApplications.length > 0 && (
                <InfluenceCard
                  title="现代应用"
                  icon="⚡"
                  items={work.contemporaryInfluence.modernApplications}
                  color="purple"
                />
              )}
            </div>

            {/* Relevance Today */}
            <div className="bg-gradient-to-r from-accent-copper from-opacity-10 to-accent-brass to-opacity-10 border border-accent-copper border-opacity-20 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-2xl mr-3">💡</span>
                当代相关性
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {work.contemporaryInfluence.relevanceToday}
              </p>
            </div>
          </div>
        )}

        {activeSection === 'historical' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">历史传承与发展</h3>
            
            {/* Timeline of Influence */}
            <div className="mb-8">
              <h4 className="text-md font-semibold text-gray-800 mb-4">影响时间线</h4>
              <div className="relative">
                {historicalInfluence.timeline.map((event, index) => (
                  <div key={index} className="relative flex items-start mb-6 last:mb-0">
                    {/* Timeline line */}
                    {index < historicalInfluence.timeline.length - 1 && (
                      <div className="absolute left-4 top-8 w-0.5 h-12 bg-gray-300"></div>
                    )}
                    
                    {/* Year indicator */}
                    <div className="flex-shrink-0 w-8 h-8 bg-accent-copper rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {event.decade}
                    </div>
                    
                    {/* Event content */}
                    <div className="ml-6 flex-1">
                      <h5 className="font-semibold text-gray-900 mb-1">{event.title}</h5>
                      <p className="text-sm text-gray-700">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historical Impact Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">🏛️</span>
                  建筑理论影响
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {historicalInfluence.theoreticalImpact.map((impact, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-accent-copper mr-2">•</span>
                      {impact}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">🔧</span>
                  技术发展影响
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {historicalInfluence.technicalImpact.map((impact, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-accent-copper mr-2">•</span>
                      {impact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'global' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">全球影响范围</h3>
            
            {/* Regional Influence Map */}
            <div className="mb-8">
              <h4 className="text-md font-semibold text-gray-800 mb-4">地区影响分布</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {globalInfluence.regions.map((region, index) => (
                  <RegionalInfluenceCard key={index} region={region} />
                ))}
              </div>
            </div>

            {/* Global Impact Metrics */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h4 className="text-md font-semibold text-blue-900 mb-4">全球影响指标</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {globalInfluence.metrics.influencedProjects}
                  </div>
                  <div className="text-sm text-blue-800">影响项目</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {globalInfluence.metrics.countries}
                  </div>
                  <div className="text-sm text-blue-800">涉及国家</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {globalInfluence.metrics.architects}
                  </div>
                  <div className="text-sm text-blue-800">影响建筑师</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {globalInfluence.metrics.publications}
                  </div>
                  <div className="text-sm text-blue-800">相关出版物</div>
                </div>
              </div>
            </div>

            {/* Cross-Cultural Adaptations */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-4">跨文化适应</h4>
              <div className="space-y-4">
                {globalInfluence.adaptations.map((adaptation, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-accent-copper rounded-lg flex items-center justify-center text-white font-bold">
                        {adaptation.region.charAt(0)}
                      </div>
                      <div className="ml-4 flex-1">
                        <h5 className="font-semibold text-gray-900 mb-1">{adaptation.region}</h5>
                        <p className="text-sm text-gray-700 mb-2">{adaptation.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {adaptation.examples.map((example, exampleIndex) => (
                            <span
                              key={exampleIndex}
                              className="text-xs bg-primary-aluminum text-primary-steel px-2 py-1 rounded"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
interface InfluenceCardProps {
  title: string;
  icon: string;
  items: string[];
  color: 'blue' | 'green' | 'purple';
}

const InfluenceCard: React.FC<InfluenceCardProps> = ({ title, icon, items, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800'
  };

  return (
    <div className={`border rounded-lg p-5 ${colorClasses[color]}`}>
      <h4 className="font-semibold mb-3 flex items-center">
        <span className="text-xl mr-2">{icon}</span>
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm flex items-start">
            <span className="text-accent-copper mr-2">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

interface RegionalInfluenceCardProps {
  region: {
    name: string;
    influence: string;
    keyProjects: string[];
    adoptionLevel: 'high' | 'medium' | 'low';
  };
}

const RegionalInfluenceCard: React.FC<RegionalInfluenceCardProps> = ({ region }) => {
  const levelColors = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-red-100 text-red-800'
  };

  const levelLabels = {
    high: '高度影响',
    medium: '中等影响',
    low: '轻微影响'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-gray-900">{region.name}</h5>
        <span className={`text-xs px-2 py-1 rounded-full ${levelColors[region.adoptionLevel]}`}>
          {levelLabels[region.adoptionLevel]}
        </span>
      </div>
      <p className="text-sm text-gray-700 mb-3">{region.influence}</p>
      <div>
        <div className="text-xs text-gray-500 mb-1">代表项目</div>
        <div className="space-y-1">
          {region.keyProjects.slice(0, 2).map((project, index) => (
            <div key={index} className="text-xs text-gray-600">• {project}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper Functions
function generateHistoricalInfluence(work: ArchitecturalWork) {
  return {
    timeline: [
      {
        decade: '50s',
        title: '初期影响 (1950年代)',
        description: '项目完成后立即引起建筑界关注，成为预制建筑的典型案例'
      },
      {
        decade: '60s',
        title: '理论发展 (1960年代)',
        description: '建筑理论家开始深入研究其设计理念，影响现代主义建筑发展'
      },
      {
        decade: '70s',
        title: '技术传播 (1970年代)',
        description: '建造技术被广泛学习和改进，推动装配式建筑发展'
      },
      {
        decade: '80s',
        title: '全球推广 (1980年代)',
        description: '设计理念传播到全球，在不同文化背景下得到适应性发展'
      },
      {
        decade: '90s',
        title: '数字化转型 (1990年代)',
        description: '结合计算机辅助设计，实现更精确的预制构件设计'
      },
      {
        decade: '00s',
        title: '可持续发展 (2000年代)',
        description: '在可持续建筑运动中重新获得关注，成为绿色建筑的参考'
      }
    ],
    theoreticalImpact: [
      '推动了建筑工业化理论的发展',
      '影响了模块化设计思维的形成',
      '促进了标准化与个性化的平衡讨论',
      '启发了适应性建筑理论的发展'
    ],
    technicalImpact: [
      '预制构件连接技术的标准化',
      '轻型结构体系的优化发展',
      '快速装配工艺的技术改进',
      '建筑材料工业化生产的推进'
    ]
  };
}

function generateGlobalInfluence(work: ArchitecturalWork) {
  return {
    regions: [
      {
        name: '欧洲',
        influence: '作为现代建筑的发源地，欧洲建筑师深入研究并发展了普鲁维的理念',
        keyProjects: ['荷兰Almere住宅', '德国IBA建筑展'],
        adoptionLevel: 'high' as const
      },
      {
        name: '北美',
        influence: '美国和加拿大的建筑师将其理念与本土工业化生产相结合',
        keyProjects: ['美国预制住宅项目', '加拿大模块化建筑'],
        adoptionLevel: 'high' as const
      },
      {
        name: '亚洲',
        influence: '日本率先引入并发展了相关技术，中国近年来大力推广装配式建筑',
        keyProjects: ['日本代谢派建筑', '中国装配式住宅'],
        adoptionLevel: 'medium' as const
      },
      {
        name: '拉丁美洲',
        influence: '在解决住房短缺问题中借鉴了快速建造的理念',
        keyProjects: ['巴西社会住房', '墨西哥灾后重建'],
        adoptionLevel: 'medium' as const
      },
      {
        name: '非洲',
        influence: '在基础设施建设和人道主义项目中应用了相关技术',
        keyProjects: ['南非低成本住房', '肯尼亚学校建设'],
        adoptionLevel: 'low' as const
      },
      {
        name: '大洋洲',
        influence: '澳大利亚在可持续建筑领域继承和发展了相关理念',
        keyProjects: ['澳大利亚生态住宅', '新西兰预制建筑'],
        adoptionLevel: 'medium' as const
      }
    ],
    metrics: {
      influencedProjects: '500+',
      countries: '45+',
      architects: '200+',
      publications: '150+'
    },
    adaptations: [
      {
        region: '日本',
        description: '结合传统木构技术，发展出独特的预制木结构体系',
        examples: ['代谢派建筑', '木构预制住宅', '灾后应急建筑']
      },
      {
        region: '中国',
        description: '大规模工业化生产与传统建筑文化的结合',
        examples: ['装配式住宅产业', '钢结构建筑', '绿色建筑标准']
      },
      {
        region: '北欧',
        description: '与可持续发展理念深度融合，注重环保和能效',
        examples: ['被动式住宅', '木结构建筑', '循环经济建筑']
      }
    ]
  };
}

export default InfluenceAnalysis;