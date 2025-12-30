import React, { useState } from 'react';
import { TechnicalSpec, ArchitecturalWork } from '@/types';

interface TechnicalSpecsProps {
  work: ArchitecturalWork;
  className?: string;
}

export const TechnicalSpecs: React.FC<TechnicalSpecsProps> = ({
  work,
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState<'specs' | 'construction' | 'materials'>('specs');

  const sections = [
    { id: 'specs' as const, label: '技术参数', icon: '📐' },
    { id: 'construction' as const, label: '建造信息', icon: '🏗️' },
    { id: 'materials' as const, label: '材料分析', icon: '🧱' }
  ];

  // Group specifications by category
  const groupedSpecs = work.specifications.reduce((groups, spec) => {
    const category = getSpecCategory(spec.property);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(spec);
    return groups;
  }, {} as Record<string, TechnicalSpec[]>);

  // Construction information derived from work data
  const constructionInfo = [
    { property: '建造年份', value: work.year.toString() },
    { property: '项目位置', value: work.location },
    { property: '项目状态', value: getStatusLabel(work.status) },
    { property: '建筑类型', value: work.category.name },
    { property: '设计师', value: '让·普鲁维 (Jean Prouvé)' }
  ];

  // Material analysis based on specifications
  const materialAnalysis = extractMaterialInfo(work.specifications);

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Section Tabs */}
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
        {activeSection === 'specs' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">技术规格参数</h3>
            
            {Object.keys(groupedSpecs).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(groupedSpecs).map(([category, specs]) => (
                  <div key={category}>
                    <h4 className="text-md font-medium text-gray-800 mb-3 pb-2 border-b border-gray-100">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {specs.map((spec, index) => (
                        <SpecItem key={index} spec={spec} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
                <p>暂无详细技术规格数据</p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'construction' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">建造信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-800 mb-3">基本信息</h4>
                <div className="space-y-3">
                  {constructionInfo.map((info, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{info.property}</span>
                      <span className="text-gray-900">{info.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-800 mb-3">建造特点</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-accent-copper mr-2">•</span>
                      采用工业化预制构件系统
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent-copper mr-2">•</span>
                      轻型钢结构框架体系
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent-copper mr-2">•</span>
                      标准化模块化设计理念
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent-copper mr-2">•</span>
                      快速装配建造工艺
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Construction Timeline */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-800 mb-3">建造时间线</h4>
              <div className="bg-gradient-to-r from-primary-aluminum to-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-accent-copper rounded-full mx-auto mb-2"></div>
                    <div className="text-xs text-gray-600">设计阶段</div>
                    <div className="text-sm font-medium">{work.year - 1}</div>
                  </div>
                  <div className="flex-1 h-0.5 bg-accent-copper mx-4"></div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-accent-copper rounded-full mx-auto mb-2"></div>
                    <div className="text-xs text-gray-600">建造完成</div>
                    <div className="text-sm font-medium">{work.year}</div>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mx-auto mb-2"></div>
                    <div className="text-xs text-gray-600">当前状态</div>
                    <div className="text-sm font-medium">{getStatusLabel(work.status)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'materials' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">材料分析</h3>
            
            {materialAnalysis.length > 0 ? (
              <div className="space-y-6">
                {materialAnalysis.map((material, index) => (
                  <MaterialCard key={index} material={material} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MaterialCard material={{
                  name: '钢结构',
                  description: '主要承重结构采用轻型钢材，体现工业美学',
                  properties: ['高强度', '轻质化', '可预制'],
                  usage: '框架结构'
                }} />
                <MaterialCard material={{
                  name: '铝合金板',
                  description: '外墙围护系统，具有良好的耐候性',
                  properties: ['耐腐蚀', '轻质', '易加工'],
                  usage: '外墙面板'
                }} />
                <MaterialCard material={{
                  name: '玻璃',
                  description: '大面积采光窗户，增强空间通透性',
                  properties: ['透明', '采光', '现代感'],
                  usage: '门窗系统'
                }} />
              </div>
            )}

            {/* Material Innovation */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-md font-semibold text-blue-900 mb-3">材料创新特点</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <h5 className="font-medium mb-2">工业化生产</h5>
                  <p>采用标准化工业生产的建筑材料，确保质量一致性和成本控制。</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">轻型化设计</h5>
                  <p>选用轻质高强材料，减少结构自重，提高建造效率。</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">模块化组合</h5>
                  <p>材料设计考虑模块化组合，便于运输、安装和维护。</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">环境适应</h5>
                  <p>根据不同气候条件选择合适材料，确保建筑耐久性。</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for individual specification items
const SpecItem: React.FC<{ spec: TechnicalSpec }> = ({ spec }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex justify-between items-center">
      <span className="font-medium text-gray-900">{spec.property}</span>
      <span className="text-lg font-semibold text-accent-copper">
        {spec.value} {spec.unit || ''}
      </span>
    </div>
  </div>
);

// Helper component for material cards
interface Material {
  name: string;
  description: string;
  properties: string[];
  usage: string;
}

const MaterialCard: React.FC<{ material: Material }> = ({ material }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <h5 className="font-semibold text-gray-900 mb-2">{material.name}</h5>
    <p className="text-sm text-gray-600 mb-3">{material.description}</p>
    
    <div className="mb-3">
      <div className="text-xs text-gray-500 mb-1">特性</div>
      <div className="flex flex-wrap gap-1">
        {material.properties.map((prop, index) => (
          <span key={index} className="text-xs bg-primary-aluminum text-primary-steel px-2 py-1 rounded">
            {prop}
          </span>
        ))}
      </div>
    </div>
    
    <div>
      <div className="text-xs text-gray-500 mb-1">应用</div>
      <div className="text-sm font-medium text-gray-800">{material.usage}</div>
    </div>
  </div>
);

// Helper functions
function getSpecCategory(property: string): string {
  const dimensionKeywords = ['面积', '长度', '宽度', '高度', '跨度', '厚度'];
  const structureKeywords = ['结构', '材料', '体系', '框架'];
  const performanceKeywords = ['荷载', '强度', '性能', '效率'];
  
  if (dimensionKeywords.some(keyword => property.includes(keyword))) {
    return '尺寸参数';
  }
  if (structureKeywords.some(keyword => property.includes(keyword))) {
    return '结构系统';
  }
  if (performanceKeywords.some(keyword => property.includes(keyword))) {
    return '性能指标';
  }
  return '其他参数';
}

function getStatusLabel(status: string): string {
  const labels = {
    existing: '现存',
    demolished: '已拆除',
    reconstructed: '重建'
  };
  return labels[status as keyof typeof labels] || status;
}

function extractMaterialInfo(specs: TechnicalSpec[]): Material[] {
  const materials: Material[] = [];
  
  specs.forEach(spec => {
    if (spec.property.includes('材料')) {
      materials.push({
        name: spec.value,
        description: `项目中使用的${spec.value}材料`,
        properties: ['工业化', '标准化', '高质量'],
        usage: '建筑构件'
      });
    }
  });
  
  return materials;
}

export default TechnicalSpecs;