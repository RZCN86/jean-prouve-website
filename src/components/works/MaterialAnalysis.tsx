import React, { useState } from 'react';
import { ArchitecturalWork, MaterialAnalysis as MaterialAnalysisType } from '@/types';

interface MaterialAnalysisProps {
  work: ArchitecturalWork;
  className?: string;
}

export const MaterialAnalysis: React.FC<MaterialAnalysisProps> = ({
  work,
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'detailed' | 'innovation'>('overview');

  const sections = [
    { id: 'overview' as const, label: '材料概览', icon: '📋' },
    { id: 'detailed' as const, label: '详细分析', icon: '🔬' },
    { id: 'innovation' as const, label: '材料创新', icon: '💡' }
  ];

  // Generate material analysis data based on work specifications
  const materialData = generateMaterialAnalysis(work);

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">材料分析</h2>
        <p className="text-sm text-gray-600 mt-1">
          深入分析 {work.title} 中使用的建筑材料及其特性
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
        {activeSection === 'overview' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">材料组成概览</h3>
            
            {/* Material Distribution Chart */}
            <div className="mb-8">
              <h4 className="text-md font-semibold text-gray-800 mb-4">材料使用分布</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materialData.materials.map((material, index) => (
                  <MaterialOverviewCard key={index} material={material} />
                ))}
              </div>
            </div>

            {/* Material Properties Summary */}
            <div className="bg-gradient-to-r from-primary-aluminum to-white rounded-lg p-6 mb-6">
              <h4 className="text-md font-semibold text-primary-iron mb-4">整体材料特性</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-accent-copper mb-1">
                    {materialData.summary.weightReduction}%
                  </div>
                  <div className="text-sm text-primary-steel">重量减轻</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-copper mb-1">
                    {materialData.summary.durability}
                  </div>
                  <div className="text-sm text-primary-steel">耐久性等级</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-copper mb-1">
                    {materialData.summary.sustainability}%
                  </div>
                  <div className="text-sm text-primary-steel">可持续性</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-copper mb-1">
                    {materialData.summary.prefabLevel}%
                  </div>
                  <div className="text-sm text-primary-steel">预制化程度</div>
                </div>
              </div>
            </div>

            {/* Material Selection Principles */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-4">材料选择原则</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materialData.principles.map((principle, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent-copper rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <h5 className="font-semibold text-gray-900 mb-1">{principle.title}</h5>
                        <p className="text-sm text-gray-700">{principle.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'detailed' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">详细材料分析</h3>
            
            <div className="space-y-6">
              {materialData.materials.map((material, index) => (
                <DetailedMaterialCard key={index} material={material} />
              ))}
            </div>

            {/* Material Compatibility Analysis */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-md font-semibold text-blue-900 mb-4">材料兼容性分析</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-blue-800 mb-3">良好兼容性</h5>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      钢结构与铝合金板材的热膨胀系数匹配
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      玻璃与金属框架的密封性能优良
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      各材料的耐候性能协调一致
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-800 mb-3">注意事项</h5>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">⚠</span>
                      不同金属间的电化学腐蚀防护
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">⚠</span>
                      温度变化引起的材料变形控制
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">⚠</span>
                      长期使用中的材料老化同步性
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'innovation' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">材料创新特点</h3>
            
            {/* Innovation Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {materialData.innovations.map((innovation, index) => (
                <InnovationCard key={index} innovation={innovation} />
              ))}
            </div>

            {/* Historical Context */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 mb-6">
              <h4 className="text-md font-semibold text-amber-900 mb-4">历史背景下的材料创新</h4>
              <div className="space-y-4 text-sm text-amber-800">
                <div>
                  <h5 className="font-medium mb-2">战后材料工业发展</h5>
                  <p>二战后，钢铁和铝材工业的快速发展为新型建筑材料的应用提供了条件。普鲁维敏锐地捕捉到了这一机遇，将工业材料引入建筑领域。</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">技术转移与创新</h5>
                  <p>从航空工业和汽车工业借鉴轻量化技术，将精密制造工艺应用于建筑构件生产，实现了建筑工业化的重大突破。</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">可持续发展先驱</h5>
                  <p>虽然当时尚未提出可持续发展概念，但普鲁维对材料效率和资源节约的追求，实际上体现了早期的可持续设计理念。</p>
                </div>
              </div>
            </div>

            {/* Modern Relevance */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-4">对现代材料科学的启发</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-3xl mb-2">🧬</div>
                  <h5 className="font-semibold text-gray-900 mb-2">复合材料</h5>
                  <p className="text-sm text-gray-600">启发了现代复合材料在建筑中的应用</p>
                </div>
                <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-3xl mb-2">🔬</div>
                  <h5 className="font-semibold text-gray-900 mb-2">智能材料</h5>
                  <p className="text-sm text-gray-600">为智能响应材料的发展提供了思路</p>
                </div>
                <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-3xl mb-2">♻️</div>
                  <h5 className="font-semibold text-gray-900 mb-2">循环材料</h5>
                  <p className="text-sm text-gray-600">影响了可回收建筑材料的发展方向</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
interface MaterialOverviewCardProps {
  material: {
    name: string;
    percentage: number;
    primaryUse: string;
    keyProperties: string[];
  };
}

const MaterialOverviewCard: React.FC<MaterialOverviewCardProps> = ({ material }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <h5 className="font-semibold text-gray-900">{material.name}</h5>
      <span className="text-lg font-bold text-accent-copper">{material.percentage}%</span>
    </div>
    <p className="text-sm text-gray-600 mb-3">{material.primaryUse}</p>
    <div className="flex flex-wrap gap-1">
      {material.keyProperties.map((property, index) => (
        <span key={index} className="text-xs bg-primary-aluminum text-primary-steel px-2 py-1 rounded">
          {property}
        </span>
      ))}
    </div>
  </div>
);

interface DetailedMaterialCardProps {
  material: {
    name: string;
    percentage: number;
    primaryUse: string;
    keyProperties: string[];
    technicalSpecs: {
      strength?: string;
      weight?: string;
      durability?: string;
      thermal?: string;
    };
    advantages: string[];
    limitations: string[];
  };
}

const DetailedMaterialCard: React.FC<DetailedMaterialCardProps> = ({ material }) => (
  <div className="border border-gray-200 rounded-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-lg font-semibold text-gray-900">{material.name}</h4>
      <div className="text-right">
        <div className="text-2xl font-bold text-accent-copper">{material.percentage}%</div>
        <div className="text-sm text-gray-500">使用比例</div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Technical Specifications */}
      <div>
        <h5 className="font-medium text-gray-800 mb-3">技术规格</h5>
        <div className="space-y-2">
          {Object.entries(material.technicalSpecs).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="text-sm text-gray-600 capitalize">{getSpecLabel(key)}</span>
              <span className="text-sm font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Advantages and Limitations */}
      <div>
        <div className="mb-4">
          <h5 className="font-medium text-gray-800 mb-2">优势特点</h5>
          <ul className="space-y-1">
            {material.advantages.map((advantage, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                {advantage}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h5 className="font-medium text-gray-800 mb-2">使用限制</h5>
          <ul className="space-y-1">
            {material.limitations.map((limitation, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="text-yellow-500 mr-2">⚠</span>
                {limitation}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

interface InnovationCardProps {
  innovation: {
    title: string;
    description: string;
    impact: string;
    examples: string[];
  };
}

const InnovationCard: React.FC<InnovationCardProps> = ({ innovation }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start mb-4">
      <div className="flex-shrink-0 w-10 h-10 bg-accent-copper rounded-lg flex items-center justify-center text-white font-bold text-lg">
        💡
      </div>
      <div className="ml-4">
        <h4 className="font-semibold text-gray-900 mb-2">{innovation.title}</h4>
        <p className="text-sm text-gray-700 mb-3">{innovation.description}</p>
      </div>
    </div>
    
    <div className="mb-4">
      <h5 className="text-sm font-medium text-gray-800 mb-1">创新影响</h5>
      <p className="text-sm text-gray-600">{innovation.impact}</p>
    </div>
    
    <div>
      <h5 className="text-sm font-medium text-gray-800 mb-2">应用实例</h5>
      <div className="flex flex-wrap gap-2">
        {innovation.examples.map((example, index) => (
          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {example}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// Helper Functions
function generateMaterialAnalysis(work: ArchitecturalWork) {
  // Extract material information from work specifications
  const materials = [
    {
      name: '轻型钢结构',
      percentage: 45,
      primaryUse: '主承重框架和结构支撑系统',
      keyProperties: ['高强度', '轻质化', '可预制', '耐久性'],
      technicalSpecs: {
        strength: '355 MPa',
        weight: '7.85 g/cm³',
        durability: '50+ 年',
        thermal: '50 W/m·K'
      },
      advantages: [
        '强度重量比优异',
        '工厂预制质量可控',
        '现场装配速度快',
        '结构形式灵活多样'
      ],
      limitations: [
        '需要防腐防火处理',
        '热桥效应需要处理',
        '对连接节点要求高'
      ]
    },
    {
      name: '铝合金板材',
      percentage: 30,
      primaryUse: '外墙围护和屋面系统',
      keyProperties: ['耐腐蚀', '轻质', '美观', '免维护'],
      technicalSpecs: {
        strength: '270 MPa',
        weight: '2.70 g/cm³',
        durability: '30+ 年',
        thermal: '237 W/m·K'
      },
      advantages: [
        '优异的耐候性能',
        '表面处理多样化',
        '回收利用价值高',
        '现代工业美感'
      ],
      limitations: [
        '初期投资成本较高',
        '热传导性能强',
        '需要专业安装技术'
      ]
    },
    {
      name: '玻璃材料',
      percentage: 20,
      primaryUse: '门窗系统和采光界面',
      keyProperties: ['透明', '采光', '密封', '现代感'],
      technicalSpecs: {
        strength: '50 MPa',
        weight: '2.50 g/cm³',
        durability: '25+ 年',
        thermal: '1.0 W/m·K'
      },
      advantages: [
        '最大化自然采光',
        '视觉空间延伸',
        '易于清洁维护',
        '现代建筑美学'
      ],
      limitations: [
        '隔热性能有限',
        '安全性需要考虑',
        '清洁维护频率高'
      ]
    },
    {
      name: '其他材料',
      percentage: 5,
      primaryUse: '密封、绝缘和装饰材料',
      keyProperties: ['功能性', '辅助性', '专用性'],
      technicalSpecs: {
        strength: '变化',
        weight: '变化',
        durability: '10-20 年',
        thermal: '变化'
      },
      advantages: [
        '功能针对性强',
        '安装便利',
        '成本相对较低'
      ],
      limitations: [
        '使用寿命相对较短',
        '需要定期更换',
        '环保性能待提升'
      ]
    }
  ];

  return {
    materials,
    summary: {
      weightReduction: 40,
      durability: 'A+',
      sustainability: 75,
      prefabLevel: 85
    },
    principles: [
      {
        title: '工业化生产',
        description: '选择适合大规模工业化生产的标准化材料，确保质量一致性和成本控制'
      },
      {
        title: '轻量化设计',
        description: '优先选用高强度轻质材料，减少结构自重，提高建造和运输效率'
      },
      {
        title: '耐久性考虑',
        description: '选择具有良好耐候性和耐久性的材料，减少维护成本和环境影响'
      },
      {
        title: '美学表达',
        description: '材料本身的质感和色彩成为建筑美学的重要组成部分，体现工业美学'
      }
    ],
    innovations: [
      {
        title: '工业材料建筑化',
        description: '将航空、汽车等工业领域的轻量化材料和技术引入建筑领域，开创了新的建筑材料应用方向',
        impact: '推动了建筑材料工业的发展，为现代高性能建筑材料奠定了基础',
        examples: ['航空铝材应用', '精密连接技术', '表面处理工艺']
      },
      {
        title: '标准化构件系统',
        description: '建立了完整的标准化构件体系，实现了材料的模块化生产和装配',
        impact: '为现代装配式建筑的发展提供了理论和实践基础',
        examples: ['标准化截面', '通用连接件', '模块化组合']
      },
      {
        title: '多材料协同设计',
        description: '统筹考虑不同材料的性能特点，实现材料间的优势互补和协同工作',
        impact: '影响了现代建筑材料的复合化和系统化发展趋势',
        examples: ['钢铝组合', '玻璃金属系统', '复合围护结构']
      },
      {
        title: '可拆卸设计理念',
        description: '考虑建筑全生命周期，设计可拆卸重复使用的材料连接方式',
        impact: '为现代循环经济和可持续建筑发展提供了早期实践案例',
        examples: ['可拆卸连接', '材料回收利用', '模块化重组']
      }
    ]
  };
}

function getSpecLabel(key: string): string {
  const labels: Record<string, string> = {
    strength: '强度',
    weight: '密度',
    durability: '耐久性',
    thermal: '导热系数'
  };
  return labels[key] || key;
}

export default MaterialAnalysis;