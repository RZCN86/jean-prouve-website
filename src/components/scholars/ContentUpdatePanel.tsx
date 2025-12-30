import React, { useState } from 'react';
import { Scholar } from '@/types';
import { ContentValidator, contentUpdateManager } from '@/utils/contentUpdates';

interface ContentUpdatePanelProps {
  scholars: Scholar[];
  onUpdate?: (updatedScholars: Scholar[]) => void;
}

export const ContentUpdatePanel: React.FC<ContentUpdatePanelProps> = ({ 
  scholars, 
  onUpdate 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'add' | 'updates' | 'versions'>('add');
  const [newScholar, setNewScholar] = useState<Partial<Scholar>>({
    name: '',
    institution: '',
    country: '',
    region: 'asia',
    specialization: [],
    biography: '',
    contact: {},
    publications: [],
    exhibitions: []
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const regions = ['europe', 'northAmerica', 'asia', 'africa', 'oceania', 'southAmerica'];
  const specializations = ['architecturalHistory', 'industrialDesign', 'prefabricatedConstruction', 'modernism', 'materialStudies'];

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

  const handleAddScholar = () => {
    const validation = ContentValidator.validateScholar(newScholar);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    const scholar: Scholar = {
      id: `scholar-${Date.now()}`,
      name: newScholar.name!,
      institution: newScholar.institution!,
      country: newScholar.country!,
      region: newScholar.region!,
      specialization: newScholar.specialization!,
      biography: newScholar.biography!,
      contact: newScholar.contact || {},
      publications: [],
      exhibitions: []
    };

    contentUpdateManager.addScholar(scholar, 'Content Manager');
    
    // Reset form
    setNewScholar({
      name: '',
      institution: '',
      country: '',
      region: 'asia',
      specialization: [],
      biography: '',
      contact: {},
      publications: [],
      exhibitions: []
    });
    setValidationErrors([]);

    // Notify parent component
    if (onUpdate) {
      onUpdate([...scholars, scholar]);
    }
  };

  const handleSpecializationChange = (spec: string, checked: boolean) => {
    const currentSpecs = newScholar.specialization || [];
    if (checked) {
      setNewScholar({
        ...newScholar,
        specialization: [...currentSpecs, spec]
      });
    } else {
      setNewScholar({
        ...newScholar,
        specialization: currentSpecs.filter(s => s !== spec)
      });
    }
  };

  const recentUpdates = contentUpdateManager.getRecentUpdates(30);
  const versions = contentUpdateManager.getVersions();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-accent-copper text-white p-4 rounded-full shadow-lg hover:bg-accent-copper/90 transition-colors duration-200 z-50"
        title="内容管理"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary-iron">内容管理面板</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { key: 'add', label: '添加学者' },
              { key: 'updates', label: '更新记录' },
              { key: 'versions', label: '版本历史' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.key
                    ? 'border-accent-copper text-accent-copper'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Add Scholar Tab */}
          {activeTab === 'add' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary-iron">添加新学者</h3>
              
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-red-800 font-medium mb-2">请修正以下错误：</h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    value={newScholar.name || ''}
                    onChange={(e) => setNewScholar({ ...newScholar, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-copper focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    机构 *
                  </label>
                  <input
                    type="text"
                    value={newScholar.institution || ''}
                    onChange={(e) => setNewScholar({ ...newScholar, institution: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-copper focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    国家 *
                  </label>
                  <input
                    type="text"
                    value={newScholar.country || ''}
                    onChange={(e) => setNewScholar({ ...newScholar, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-copper focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    地区 *
                  </label>
                  <select
                    value={newScholar.region || 'asia'}
                    onChange={(e) => setNewScholar({ ...newScholar, region: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-copper focus:border-transparent"
                  >
                    {regions.map(region => (
                      <option key={region} value={region}>
                        {regionLabels[region] || region}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  研究领域 *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {specializations.map(spec => (
                    <label key={spec} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newScholar.specialization?.includes(spec) || false}
                        onChange={(e) => handleSpecializationChange(spec, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{specializationLabels[spec] || spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  学者简介 *
                </label>
                <textarea
                  value={newScholar.biography || ''}
                  onChange={(e) => setNewScholar({ ...newScholar, biography: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-copper focus:border-transparent"
                />
              </div>

              <button
                onClick={handleAddScholar}
                className="w-full bg-accent-copper text-white py-3 rounded-lg font-medium hover:bg-accent-copper/90 transition-colors duration-200"
              >
                添加学者
              </button>
            </div>
          )}

          {/* Updates Tab */}
          {activeTab === 'updates' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary-iron">最近更新记录</h3>
              {recentUpdates.length > 0 ? (
                <div className="space-y-3">
                  {recentUpdates.map(update => (
                    <div key={update.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-primary-iron">
                          {update.description}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(update.timestamp).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {update.type}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {update.action}
                        </span>
                        {update.author && (
                          <span className="text-gray-600">
                            by {update.author}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">暂无更新记录</p>
              )}
            </div>
          )}

          {/* Versions Tab */}
          {activeTab === 'versions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary-iron">版本历史</h3>
              {versions.length > 0 ? (
                <div className="space-y-3">
                  {versions.map(version => (
                    <div key={version.version} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-primary-iron">
                          {version.version}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(version.timestamp).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{version.description}</p>
                      <span className="text-sm text-gray-600">
                        {version.changes.length} 个更改
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">暂无版本记录</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};