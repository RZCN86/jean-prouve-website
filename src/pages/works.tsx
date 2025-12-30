import type { NextPage, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Layout } from '@/components';
import { FilteredWorksList } from '@/components/works';
import { getAllWorks } from '@/data/works';
import { ArchitecturalWork } from '@/types';
import { generateStructuredData } from '@/utils/seo';

interface WorksPageProps {
  works: ArchitecturalWork[];
  structuredData: any;
}

const Works: NextPage<WorksPageProps> = ({ works, structuredData }) => {
  const { t } = useTranslation('common');

  return (
    <Layout
      title={t('navigation.works')}
      description="Explore Jean Prouvé's major architectural works and design innovations"
      keywords={['Jean Prouvé', 'works', 'architecture', 'buildings', 'design', 'portfolio']}
      structuredData={structuredData}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-iron mb-6">
              建筑作品集
            </h1>
            <p className="text-xl text-primary-steel max-w-3xl mx-auto leading-relaxed">
              探索让·普鲁维的主要建筑作品，了解他在轻型建筑和预制构件领域的创新贡献。
              每个项目都展现了他对功能性、美学和工业化建造的独特理解。
            </p>
          </div>

          {/* Works Grid with Search and Filters */}
          <FilteredWorksList works={works} />

          {/* Additional Info */}
          <div className="mt-16 bg-primary-aluminum rounded-lg p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-semibold text-primary-iron mb-4">
                关于作品集
              </h2>
              <p className="text-primary-steel leading-relaxed">
                这些作品展现了让·普鲁维在1930年代至1970年代期间的建筑实践。
                从早期的金属工艺探索到后期的大型建筑项目，每个作品都体现了他对材料、
                结构和空间的深刻理解。点击任意作品可查看详细信息、技术规格和专家评论。
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const works = getAllWorks();
  
  // Generate structured data for works collection
  const structuredData = generateStructuredData({
    type: 'article',
    data: {
      title: 'Jean Prouvé Architectural Works Collection',
      description: 'Comprehensive collection of Jean Prouvé\'s major architectural works and design innovations',
      keywords: ['Jean Prouvé', 'architecture', 'works', 'buildings', 'design'],
      language: locale || 'zh',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jean-prouve.vercel.app'}${locale === 'zh' ? '' : `/${locale}`}/works`
    }
  });
  
  return {
    props: {
      works,
      structuredData,
      ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
    },
  };
};

export default Works;