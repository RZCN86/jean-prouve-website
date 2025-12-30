import type { NextPage, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { Layout, ScholarsList, ScholarSearch, ResearchSummary } from '@/components';
// import { ContentUpdatePanel } from '@/components/scholars/ContentUpdatePanel';
import { scholars } from '@/data/scholars';
import { Scholar } from '@/types';

type ViewMode = 'overview' | 'browse' | 'search';

const Scholars: NextPage = () => {
  const { t } = useTranslation('common');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [currentScholars, setCurrentScholars] = useState<Scholar[]>(scholars);

  const viewModeLabels: Record<ViewMode, string> = {
    overview: '研究概览',
    browse: '浏览学者',
    search: '搜索研究'
  };

  const handleScholarsUpdate = (updatedScholars: Scholar[]) => {
    setCurrentScholars(updatedScholars);
  };

  // Suppress unused variable warning for now
  void handleScholarsUpdate;

  return (
    <Layout
      title={t('navigation.scholars')}
      description="Discover global scholarly research on Jean Prouvé"
      keywords={['Jean Prouvé', 'scholars', 'research', 'academic', 'publications', 'studies']}
    >
      <div className="container-custom py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary-iron mb-4">
              {t('navigation.scholars')}
            </h1>
            <p className="text-xl text-primary-steel max-w-3xl mx-auto mb-8">
              {t('home.scholars_description')}
            </p>

            {/* View Mode Selector */}
            <div className="flex justify-center">
              <div className="bg-white rounded-lg shadow-sm p-2 inline-flex">
                {(Object.keys(viewModeLabels) as ViewMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      viewMode === mode
                        ? 'bg-accent-copper text-white'
                        : 'text-gray-600 hover:text-primary-iron hover:bg-gray-50'
                    }`}
                  >
                    {viewModeLabels[mode]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content based on view mode */}
          {viewMode === 'overview' && <ResearchSummary scholars={currentScholars} />}
          {viewMode === 'browse' && <ScholarsList scholars={currentScholars} />}
          {viewMode === 'search' && <ScholarSearch scholars={currentScholars} />}
        </div>
      </div>

      {/* Content Update Panel (only in development) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <ContentUpdatePanel 
          scholars={currentScholars} 
          onUpdate={handleScholarsUpdate}
        />
      )} */}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
    },
  };
};

export default Scholars;