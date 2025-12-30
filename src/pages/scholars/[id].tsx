import React, { useState } from 'react';
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { Layout, Breadcrumb } from '@/components';
import RecommendationSection from '@/components/common/RecommendationSection';
import { scholars, getScholarById } from '@/data/scholars';
import { getScholarRecommendations } from '@/utils/recommendations';
import { Scholar } from '@/types';

interface ScholarDetailPageProps {
  scholar: Scholar;
  recommendations: ReturnType<typeof getScholarRecommendations>;
}

const ScholarDetail: NextPage<ScholarDetailPageProps> = ({ scholar, recommendations }) => {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState<'overview' | 'publications' | 'exhibitions'>('overview');

  const breadcrumbItems = [
    { label: t('navigation.home'), href: '/' },
    { label: t('navigation.scholars'), href: '/scholars' },
    { label: scholar.name, href: `/scholars/${scholar.id}` }
  ];

  const tabs = [
    { id: 'overview', label: '概览', icon: '👤' },
    { id: 'publications', label: '出版物', icon: '📚' },
    { id: 'exhibitions', label: '展览', icon: '🎨' }
  ];

  // Get region display name
  const getRegionDisplayName = (regionId: string): string => {
    const regionNames: Record<string, string> = {
      'europe': '欧洲',
      'northAmerica': '北美洲',
      'asia': '亚洲',
      'africa': '非洲',
      'oceania': '大洋洲',
      'southAmerica': '南美洲'
    };
    return regionNames[regionId] || regionId;
  };

  // Get specialization display name
  const getSpecializationDisplayName = (spec: string): string => {
    const specNames: Record<string, string> = {
      'architecturalHistory': '建筑史',
      'industrialDesign': '工业设计',
      'prefabricatedConstruction': '预制建筑',
      'modernism': '现代主义',
      'materialStudies': '材料研究'
    };
    return specNames[spec] || spec;
  };

  // Get publication type display name
  const getPublicationTypeDisplayName = (type: string): string => {
    const typeNames: Record<string, string> = {
      'book': '书籍',
      'article': '文章',
      'thesis': '论文',
      'conference': '会议论文'
    };
    return typeNames[type] || type;
  };

  return (
    <Layout>
      <Head>
        <title>{scholar.name} - 让·普鲁维研究网站</title>
        <meta name="description" content={`${scholar.name} - ${scholar.institution}的让·普鲁维研究专家`} />
        <meta name="keywords" content={`Jean Prouvé, ${scholar.name}, ${scholar.institution}, research, scholar`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${scholar.name} - 让·普鲁维研究网站`} />
        <meta property="og:description" content={scholar.biography} />
        <meta property="og:type" content="profile" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": scholar.name,
              "description": scholar.biography,
              "affiliation": {
                "@type": "Organization",
                "name": scholar.institution
              },
              "nationality": scholar.country,
              "knowsAbout": scholar.specialization,
              "email": scholar.contact.email,
              "url": scholar.contact.website
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Scholar Avatar/Info */}
              <div className="lg:col-span-1">
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{scholar.name}</h1>
                  <p className="text-gray-600 mb-4">{scholar.institution}</p>
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {scholar.country} · {getRegionDisplayName(scholar.region)}
                  </div>
                  
                  {/* Contact Info */}
                  <div className="space-y-2">
                    {scholar.contact.email && (
                      <a 
                        href={`mailto:${scholar.contact.email}`}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        邮箱联系
                      </a>
                    )}
                    {scholar.contact.website && (
                      <a 
                        href={scholar.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        个人网站
                      </a>
                    )}
                  </div>
                </div>

                {/* Specializations */}
                <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">研究领域</h3>
                  <div className="flex flex-wrap gap-2">
                    {scholar.specialization.map((spec, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {getSpecializationDisplayName(spec)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">学术统计</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">出版物</span>
                      <span className="font-semibold text-gray-900">{scholar.publications.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">展览</span>
                      <span className="font-semibold text-gray-900">{scholar.exhibitions.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">学者简介</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {scholar.biography}
                  </p>
                </div>

                {/* Content Tabs */}
                <div>
                  {/* Tab Navigation */}
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600'
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
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">研究概述</h3>
                          <p className="text-gray-700 leading-relaxed mb-6">
                            {scholar.biography}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">主要研究领域</h4>
                              <ul className="space-y-2">
                                {scholar.specialization.map((spec, index) => (
                                  <li key={index} className="flex items-center text-gray-700">
                                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {getSpecializationDisplayName(spec)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">学术贡献</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">发表论文</span>
                                  <span className="font-medium">{scholar.publications.filter(p => p.type === 'article').length} 篇</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">出版著作</span>
                                  <span className="font-medium">{scholar.publications.filter(p => p.type === 'book').length} 本</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">会议论文</span>
                                  <span className="font-medium">{scholar.publications.filter(p => p.type === 'conference').length} 篇</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">策展经历</span>
                                  <span className="font-medium">{scholar.exhibitions.length} 次</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'publications' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">学术出版物</h3>
                          {scholar.publications.length > 0 ? (
                            <div className="space-y-6">
                              {scholar.publications
                                .sort((a, b) => b.year - a.year)
                                .map((publication) => (
                                <article key={publication.id} className="border border-gray-200 rounded-lg p-6">
                                  <header className="mb-4">
                                    <div className="flex items-start justify-between mb-2">
                                      <h4 className="text-lg font-semibold text-gray-900 flex-1">
                                        {publication.url ? (
                                          <a 
                                            href={publication.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-blue-600 transition-colors"
                                          >
                                            {publication.title}
                                          </a>
                                        ) : (
                                          publication.title
                                        )}
                                      </h4>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-4 ${
                                        publication.type === 'book' ? 'bg-blue-100 text-blue-800' :
                                        publication.type === 'article' ? 'bg-green-100 text-green-800' :
                                        publication.type === 'thesis' ? 'bg-purple-100 text-purple-800' :
                                        'bg-orange-100 text-orange-800'
                                      }`}>
                                        {getPublicationTypeDisplayName(publication.type)}
                                      </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                                      <span>{publication.year}年</span>
                                      {publication.publisher && <span>出版社：{publication.publisher}</span>}
                                    </div>
                                  </header>
                                  
                                  <div className="mb-4">
                                    <p className="text-gray-700 leading-relaxed">{publication.abstract}</p>
                                  </div>
                                  
                                  {publication.keywords.length > 0 && (
                                    <footer>
                                      <div className="flex flex-wrap gap-2">
                                        {publication.keywords.map((keyword, index) => (
                                          <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                            {keyword}
                                          </span>
                                        ))}
                                      </div>
                                    </footer>
                                  )}
                                </article>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-600">暂无出版物信息。</p>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'exhibitions' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">展览经历</h3>
                          {scholar.exhibitions.length > 0 ? (
                            <div className="space-y-6">
                              {scholar.exhibitions
                                .sort((a, b) => b.year - a.year)
                                .map((exhibition) => (
                                <div key={exhibition.id} className="border border-gray-200 rounded-lg p-6">
                                  <header className="mb-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{exhibition.title}</h4>
                                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                                      <span>{exhibition.year}年</span>
                                      <span>场馆：{exhibition.venue}</span>
                                      <span>角色：{exhibition.role}</span>
                                    </div>
                                  </header>
                                  
                                  <div>
                                    <p className="text-gray-700 leading-relaxed">{exhibition.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-600">暂无展览经历。</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Content Recommendations */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RecommendationSection
            title="相关推荐"
            subtitle="探索与此学者研究相关的其他内容"
            recommendations={recommendations}
            cardSize="medium"
            showReason={true}
            maxVisible={6}
          />
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = scholars.map((scholar) => ({
    params: { id: scholar.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const scholarId = params?.id as string;
  const scholar = getScholarById(scholarId);

  if (!scholar) {
    return {
      notFound: true,
    };
  }

  // Get recommendations for this scholar
  const recommendations = getScholarRecommendations(scholarId, {
    maxResults: 6,
    includeTypes: ['work', 'scholar', 'biography']
  });

  return {
    props: {
      scholar,
      recommendations,
      ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
    },
  };
};

export default ScholarDetail;