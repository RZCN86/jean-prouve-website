import React, { useState } from 'react';
import Image from 'next/image';
import { ArchitecturalWork, TechnicalSpec } from '@/types';

interface ConstructionDetailsProps {
  work: ArchitecturalWork;
  className?: string;
}

export const ConstructionDetails: React.FC<ConstructionDetailsProps> = ({
  work,
  className = ''
}) => {
  const [activeDetail, setActiveDetail] = useState<'process' | 'techniques' | 'innovations'>('process');

  const detailSections = [
    { id: 'process' as const, label: '建造过程', icon: '🏗️' },
    { id: 'techniques' as const, label: '建造技术', icon: '⚙️' },
    { id: 'innovations' as const, label: '技术创新', icon: '💡' }
  ];

  // Construction process steps based on work type and year
  const constructionProcess = getConstructionProcess(work);
  
  // Construction techniques used
  const constructionTechniques = getConstructionTechniques(work);
  
  // Technical innovations
  const technicalInnovations = getTechnicalInnovations(work);

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">建造信息详情</h2>
        <p className="text-sm text-gray-600 mt-1">
          了解 {work.title} 的建造过程、技术特点和创新要点
        </p>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {detailSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveDetail(section.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeDetail === section.id
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
        {activeDetail === 'process' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">建造过程</h3>
            
            {/* Timeline */}
            <div className="relative">
              {constructionProcess.map((step, index) => (
                <div key={index} className="relative flex items-start mb-8 last:mb-0">
                  {/* Timeline line */}
                  {index < constructionProcess.length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-300"></div>
                  )}
                  
                  {/* Step indicator */}
                  <div className="flex-shrink-0 w-8 h-8 bg-accent-copper rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  
                  {/* Step content */}
                  <div className="ml-6 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-md font-semibold text-gray-900">{step.title}</h4>
                      <span className="text-sm text-gray-500">{step.duration}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{step.description}</p>
                    
                    {step.keyPoints && (
                      <ul className="space-y-1">
                        {step.keyPoints.map((point, pointIndex) => (
                          <li key={pointIndex} className="text-sm text-gray-600 flex items-start">
                            <span className="text-accent-copper mr-2">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Process Summary */}
            <div className="mt-8 bg-primary-aluminum rounded-lg p-6">
              <h4 className="font-semibold text-primary-iron mb-3">建造特点总结</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-copper mb-1">
                    {getConstructionDuration(work)}
                  </div>
                  <div className="text-primary-steel">建造周期</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-copper mb-1">
                    {getPreFabPercentage(work)}%
                  </div>
                  <div className="text-primary-steel">预制化程度</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-copper mb-1">
                    {getWorkerCount(work)}
                  </div>
                  <div className="text-primary-steel">施工人员</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDetail === 'techniques' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">建造技术</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {constructionTechniques.map((technique, index) => (
                <TechniqueCard key={index} technique={technique} />
              ))}
            </div>

            {/* Technical Drawings Section */}
            {work.technicalDrawings.length > 0 && (
              <div className="mt-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">技术图纸</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {work.technicalDrawings.map((drawing, index) => (
                    <div key={drawing.id} className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden group cursor-pointer">
                      <Image
                        src={drawing.src}
                        alt={drawing.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {drawing.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3 text-sm">
                          {drawing.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeDetail === 'innovations' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">技术创新</h3>
            
            <div className="space-y-6">
              {technicalInnovations.map((innovation, index) => (
                <InnovationCard key={index} innovation={innovation} />
              ))}
            </div>

            {/* Innovation Impact */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-md font-semibold text-blue-900 mb-4">创新影响</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
                <div>
                  <h5 className="font-medium mb-2">对当时的影响</h5>
                  <ul className="space-y-1">
                    <li>• 推动了预制建筑技术的发展</li>
                    <li>• 影响了战后重建的建造方式</li>
                    <li>• 为工业化建筑奠定了基础</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">对现代的启发</h5>
                  <ul className="space-y-1">
                    <li>• 现代装配式建筑的先驱</li>
                    <li>• 可持续建筑设计理念</li>
                    <li>• 标准化与个性化的平衡</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper components
interface ConstructionStep {
  title: string;
  description: string;
  duration: string;
  keyPoints?: string[];
}

interface Technique {
  name: string;
  description: string;
  advantages: string[];
  application: string;
}

interface Innovation {
  title: string;
  description: string;
  significance: string;
  impact: string[];
}

const TechniqueCard: React.FC<{ technique: Technique }> = ({ technique }) => (
  <div className="bg-gray-50 rounded-lg p-5 hover:shadow-md transition-shadow">
    <h5 className="font-semibold text-gray-900 mb-2">{technique.name}</h5>
    <p className="text-sm text-gray-700 mb-3">{technique.description}</p>
    
    <div className="mb-3">
      <div className="text-xs text-gray-500 mb-2">技术优势</div>
      <div className="space-y-1">
        {technique.advantages.map((advantage, index) => (
          <div key={index} className="text-sm text-gray-600 flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            {advantage}
          </div>
        ))}
      </div>
    </div>
    
    <div>
      <div className="text-xs text-gray-500 mb-1">应用范围</div>
      <div className="text-sm font-medium text-accent-copper">{technique.application}</div>
    </div>
  </div>
);

const InnovationCard: React.FC<{ innovation: Innovation }> = ({ innovation }) => (
  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start">
      <div className="flex-shrink-0 w-10 h-10 bg-accent-copper rounded-lg flex items-center justify-center text-white font-bold text-lg">
        💡
      </div>
      <div className="ml-4 flex-1">
        <h5 className="font-semibold text-gray-900 mb-2">{innovation.title}</h5>
        <p className="text-gray-700 mb-3">{innovation.description}</p>
        
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-800 mb-1">重要意义</div>
          <p className="text-sm text-gray-600">{innovation.significance}</p>
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-800 mb-2">影响范围</div>
          <div className="flex flex-wrap gap-2">
            {innovation.impact.map((item, index) => (
              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Helper functions
function getConstructionProcess(work: ArchitecturalWork): ConstructionStep[] {
  const baseProcess: ConstructionStep[] = [
    {
      title: '设计与规划',
      description: '完成建筑设计、结构计算和施工图纸绘制',
      duration: '3-6个月',
      keyPoints: [
        '模块化设计方案确定',
        '预制构件标准化设计',
        '施工工艺流程规划'
      ]
    },
    {
      title: '预制构件生产',
      description: '在工厂内批量生产标准化建筑构件',
      duration: '2-4个月',
      keyPoints: [
        '钢结构构件加工',
        '围护板材预制',
        '质量检验与包装'
      ]
    },
    {
      title: '现场基础施工',
      description: '完成地基处理和基础结构建设',
      duration: '1-2个月',
      keyPoints: [
        '地基勘察与处理',
        '基础混凝土浇筑',
        '预埋件安装'
      ]
    },
    {
      title: '结构装配',
      description: '现场快速装配预制构件形成主体结构',
      duration: '2-3个月',
      keyPoints: [
        '钢结构框架安装',
        '围护系统装配',
        '连接节点处理'
      ]
    },
    {
      title: '设备安装与装修',
      description: '完成机电设备安装和室内外装修',
      duration: '2-3个月',
      keyPoints: [
        '水电管线安装',
        '室内装修完成',
        '外立面处理'
      ]
    }
  ];

  return baseProcess;
}

function getConstructionTechniques(work: ArchitecturalWork): Technique[] {
  return [
    {
      name: '预制装配技术',
      description: '采用工厂预制、现场装配的建造方式，提高建造效率和质量控制',
      advantages: ['缩短建造周期', '提高施工质量', '减少现场作业'],
      application: '主体结构与围护系统'
    },
    {
      name: '轻型钢结构',
      description: '使用轻质高强钢材构建建筑框架，实现大跨度空间',
      advantages: ['结构轻质', '跨度灵活', '抗震性能好'],
      application: '承重结构系统'
    },
    {
      name: '标准化连接',
      description: '设计标准化的构件连接方式，便于装配和维护',
      advantages: ['安装便捷', '连接可靠', '维护简单'],
      application: '构件连接节点'
    },
    {
      name: '模块化设计',
      description: '将建筑分解为标准模块，实现灵活组合和批量生产',
      advantages: ['设计灵活', '生产高效', '成本控制'],
      application: '整体建筑系统'
    }
  ];
}

function getTechnicalInnovations(work: ArchitecturalWork): Innovation[] {
  return [
    {
      title: '工业化建造体系',
      description: '首次将工业生产理念完整应用于建筑建造，实现了从设计到生产的全流程工业化',
      significance: '开创了现代装配式建筑的先河，为后续建筑工业化发展奠定了基础',
      impact: ['建筑工业化', '装配式建筑', '标准化设计']
    },
    {
      title: '轻型构造系统',
      description: '发展了轻质高效的建筑构造体系，在保证结构性能的同时大幅减轻建筑自重',
      significance: '突破了传统厚重建造方式的限制，为现代轻型建筑技术发展指明方向',
      impact: ['轻型建筑', '材料创新', '结构优化']
    },
    {
      title: '快速装配工艺',
      description: '创新了建筑装配工艺，实现了构件的快速精确安装，大幅提高建造效率',
      significance: '解决了传统建造周期长、效率低的问题，为现代快速建造技术提供了范例',
      impact: ['施工工艺', '建造效率', '质量控制']
    }
  ];
}

function getConstructionDuration(work: ArchitecturalWork): string {
  // Estimate based on work type and size
  const specs = work.specifications;
  const areaSpec = specs.find(s => s.property.includes('面积'));
  
  if (areaSpec) {
    const area = parseInt(areaSpec.value);
    if (area > 2000) return '12-18个月';
    if (area > 500) return '6-12个月';
    return '3-6个月';
  }
  
  return '6-12个月';
}

function getPreFabPercentage(work: ArchitecturalWork): number {
  // Estimate prefabrication percentage based on work characteristics
  if (work.category.id === 'industrial') return 85;
  if (work.category.id === 'residential') return 75;
  if (work.category.id === 'educational') return 70;
  return 80;
}

function getWorkerCount(work: ArchitecturalWork): string {
  // Estimate worker count based on project size
  const specs = work.specifications;
  const areaSpec = specs.find(s => s.property.includes('面积'));
  
  if (areaSpec) {
    const area = parseInt(areaSpec.value);
    if (area > 2000) return '50-80人';
    if (area > 500) return '20-40人';
    return '10-20人';
  }
  
  return '20-40人';
}

export default ConstructionDetails;