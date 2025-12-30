import React, { useState } from 'react';
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Image from 'next/image';
import { Layout, Breadcrumb } from '@/components';
import { ImageGallery } from '@/components/biography';
import RecommendationSection from '@/components/common/RecommendationSection';
import { getAllWorks, getWorkById } from '@/data/works';
import { getWorkRecommendations } from '@/utils/recommendations';
import { ArchitecturalWork } from '@/types';

interface WorkDetailPageProps {
  work: ArchitecturalWork;
  recommendations: ReturnType<typeof getWorkRecommendations>;
}

const WorkDetail: NextPage<WorkDetailPageProps> = ({ work, recommendations }) => {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'analysis' | 'history'>('overview');

  const breadcrumbItems = [
    { label: t('navigation.home'), href: '/' },
    { label: t('navigation.works'), href: '/works' },
    { label: work.title, href: `/works/${work.id}` }
  ];

  const tabs = [
    { id: 'overview', label: '概览', icon: '🏗️' },
    { id: 'technical', label: '技术分析', icon: '⚙️' },
    { id: 'analysis', label: '专家评论', icon: '📝' },
    { id: 'history', label: '历史背景', icon: '📚' }
  ];

  return (
    <Layout>
      <Head>
        <title>{work.title} - 让·普鲁维研究网站</title>
        <meta name="description" content={work.description} />
        <meta name="keywords" content={`Jean Prouvé, ${work.title}, ${work.category.name}, architecture, ${work.year}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${work.title} - 让·普鲁维研究网站`} />
        <meta property="og:description" content={work.description} />
        <meta property="og:type" content="article" />
        {work.images[0] && (
          <meta property="og:image" content={work.images[0].src} />
        )}
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ArchitecturalStructure",
              "name": work.title,
              "description": work.description,
              "architect": {
                "@type": "Person",
                "name": "Jean Prouvé"
              },
              "dateCreated": work.year.toString(),
              "location": {
                "@type": "Place",
                "name": work.location
              },
              "image": work.images.map(img => img.src)
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                {work.images.length > 0 && (
                  <ImageGallery 
                    images={work.images}
                    className="rounded-lg overflow-hidden"
                  />
                )}
              </div>

              {/* Work Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {work.category.name}
                    </span>
                    <span className="text-sm text-gray-500">{work.year}年</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      work.status === 'existing' ? 'bg-green-100 text-green-800' :
                      work.status === 'demolished' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {work.status === 'existing' ? '现存' : 
                       work.status === 'demolished' ? '已拆除' : '重建'}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {work.title}
                  </h1>
                  
                  <div className="flex items-center text-gray-600 mb-6">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {work.location}
                  </div>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {work.description}
                  </p>
                </div>

                {/* Quick Specs */}
                {work.specifications.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {work.specifications.slice(0, 6).map((spec, index) => (
                        <div key={index}>
                          <dt className="text-sm font-medium text-gray-500">{spec.property}</dt>
                          <dd className="text-sm text-gray-900">
                            {spec.value}{spec.unit && ` ${spec.unit}`}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">项目概览</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {work.description}
                  </p>
                  
                  {/* Full Specifications */}
                  {work.specifications.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">技术规格</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {work.specifications.map((spec, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <dt className="text-sm font-medium text-gray-500 mb-1">{spec.property}</dt>
                            <dd className="text-lg font-semibold text-gray-900">
                              {spec.value}{spec.unit && ` ${spec.unit}`}
                            </dd>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Technical Drawings */}
                {work.technicalDrawings.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">技术图纸</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {work.technicalDrawings.map((drawing) => (
                        <div key={drawing.id} className="space-y-2">
                          <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={drawing.src}
                              alt={drawing.alt}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {drawing.caption && (
                            <p className="text-sm text-gray-600">{drawing.caption}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'technical' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">技术分析</h2>
                  {work.technicalAnalysis ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">建造方法</h3>
                        <p className="text-gray-700 leading-relaxed">{work.technicalAnalysis.constructionMethod}</p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">材料分析</h3>
                        <div className="space-y-4">
                          {work.technicalAnalysis.materials.map((material, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-2">{material.material}</h4>
                              <p className="text-gray-700 mb-3">{material.usage}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">优势</h5>
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {material.advantages.map((advantage, i) => (
                                      <li key={i}>{advantage}</li>
                                    ))}
                                  </ul>
                                </div>
                                {material.limitations && (
                                  <div>
                                    <h5 className="font-medium text-gray-900 mb-2">限制</h5>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                      {material.limitations.map((limitation, i) => (
                                        <li key={i}>{limitation}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">技术创新</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                          {work.technicalAnalysis.innovations.map((innovation, index) => (
                            <li key={index}>{innovation}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">技术挑战</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                          {work.technicalAnalysis.challenges.map((challenge, index) => (
                            <li key={index}>{challenge}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">技术影响</h3>
                        <p className="text-gray-700 leading-relaxed">{work.technicalAnalysis.impact}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">暂无详细技术分析。</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">专家评论</h2>
                  {work.expertAnalyses && work.expertAnalyses.length > 0 ? (
                    <div className="space-y-8">
                      {work.expertAnalyses.map((analysis) => (
                        <article key={analysis.id} className="border border-gray-200 rounded-lg p-6">
                          <header className="mb-4">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{analysis.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 space-x-4">
                              <span>作者：{analysis.author}</span>
                              {analysis.institution && <span>机构：{analysis.institution}</span>}
                              <span>日期：{analysis.date}</span>
                            </div>
                          </header>
                          <div className="prose prose-gray max-w-none">
                            <p className="text-gray-700 leading-relaxed">{analysis.content}</p>
                          </div>
                          {analysis.tags && analysis.tags.length > 0 && (
                            <footer className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex flex-wrap gap-2">
                                {analysis.tags.map((tag, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </footer>
                          )}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{work.commentary.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <span>作者：{work.commentary.author}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{work.commentary.content}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">历史背景</h2>
                  {work.historicalContext ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">历史时期</h3>
                        <p className="text-gray-700 leading-relaxed">{work.historicalContext.period}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">社会背景</h3>
                          <p className="text-gray-700 leading-relaxed">{work.historicalContext.socialContext}</p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">政治背景</h3>
                          <p className="text-gray-700 leading-relaxed">{work.historicalContext.politicalContext}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">经济背景</h3>
                        <p className="text-gray-700 leading-relaxed">{work.historicalContext.economicContext}</p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">文化意义</h3>
                        <p className="text-gray-700 leading-relaxed">{work.historicalContext.culturalSignificance}</p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">影响因素</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                          {work.historicalContext.influences.map((influence, index) => (
                            <li key={index}>{influence}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">暂无详细历史背景信息。</p>
                  )}
                </div>

                {/* Contemporary Influence */}
                {work.contemporaryInfluence && (
                  <div className="border-t border-gray-200 pt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">当代影响</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{work.contemporaryInfluence.title}</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">{work.contemporaryInfluence.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">影响的作品</h4>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {work.contemporaryInfluence.influencedWorks.map((workName, index) => (
                              <li key={index}>{workName}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">影响的建筑师</h4>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {work.contemporaryInfluence.influencedArchitects.map((architect, index) => (
                              <li key={index}>{architect}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">现代应用</h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {work.contemporaryInfluence.modernApplications.map((application, index) => (
                            <li key={index}>{application}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">当代意义</h4>
                        <p className="text-gray-700 leading-relaxed">{work.contemporaryInfluence.relevanceToday}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Content Recommendations */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RecommendationSection
            title="相关推荐"
            subtitle="探索与此作品相关的其他内容"
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
  const works = getAllWorks();
  const paths = works.map((work) => ({
    params: { id: work.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const workId = params?.id as string;
  const work = getWorkById(workId);

  if (!work) {
    return {
      notFound: true,
    };
  }

  // Get recommendations for this work
  const recommendations = getWorkRecommendations(workId, {
    maxResults: 6,
    includeTypes: ['work', 'scholar', 'biography']
  });

  return {
    props: {
      work,
      recommendations,
      ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
    },
  };
};

export default WorkDetail;