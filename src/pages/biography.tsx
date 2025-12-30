import type { NextPage, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Layout, FadeIn } from '@/components';
import { Timeline, BiographyContent, ImageGallery } from '@/components/biography';
import RecommendationSection from '@/components/common/RecommendationSection';
import { BiographyContent as BiographyContentType, TimelineEvent, ImageData } from '@/types';
import { loadAllBiographyData } from '@/utils/biographyData';
import { getBiographyRecommendations } from '@/utils/recommendations';
import { generateBiographySEO } from '@/utils/seo';

interface BiographyPageProps {
  biographyData: {
    content: BiographyContentType;
    timeline: TimelineEvent[];
    images: ImageData[];
  };
  recommendations: ReturnType<typeof getBiographyRecommendations>;
  seoData: ReturnType<typeof generateBiographySEO>;
}

const Biography: NextPage<BiographyPageProps> = ({ biographyData, recommendations, seoData }) => {
  const { t } = useTranslation('common');
  const { content, timeline, images } = biographyData;

  return (
    <Layout
      title={seoData.title}
      description={seoData.description}
      keywords={seoData.keywords}
      structuredData={seoData.structuredData}
    >
      <div className="container-custom py-16">
        <div className="max-w-6xl mx-auto">
          <FadeIn delay={100}>
            <h1 className="text-4xl font-bold text-primary-iron mb-8">
              {t('navigation.biography')}
            </h1>
            <p className="text-xl text-primary-steel mb-12">
              {t('home.biography_description')}
            </p>
          </FadeIn>
          
          {/* Biography Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <FadeIn delay={200} direction="up">
                <BiographyContent 
                  content={content}
                  images={images.slice(0, 1)} // Use first image as portrait
                />
              </FadeIn>
              
              {/* Image Gallery Section */}
              {images.length > 1 && (
                <FadeIn delay={400} direction="up">
                  <section className="bg-white rounded-lg shadow-md p-8">
                    <h3 className="text-2xl font-heading font-bold text-primary-iron mb-6">
                      历史图片
                    </h3>
                    <ImageGallery 
                      images={images.slice(1)} // Skip the first image (used as portrait)
                      showThumbnails={true}
                    />
                  </section>
                </FadeIn>
              )}
            </div>
            
            {/* Timeline Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <FadeIn delay={300} direction="left">
                  <h2 className="text-2xl font-heading font-bold text-primary-iron mb-6">
                    生平时间轴
                  </h2>
                  <Timeline events={timeline} />
                </FadeIn>
              </div>
            </div>
          </div>

          {/* Related Content Recommendations */}
          <div className="mt-16">
            <FadeIn delay={500} direction="up">
              <RecommendationSection
                title="相关推荐"
                subtitle="探索与让·普鲁维生平相关的作品和研究"
                recommendations={recommendations}
                cardSize="medium"
                showReason={true}
                maxVisible={6}
              />
            </FadeIn>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    // Load all biography data
    const biographyData = await loadAllBiographyData();
    
    // Get recommendations for biography content
    const recommendations = getBiographyRecommendations('overview', {
      maxResults: 6,
      includeTypes: ['work', 'scholar', 'biography']
    });

    // Generate SEO data
    const seoData = generateBiographySEO(biographyData.content, locale);
    
    return {
      props: {
        biographyData,
        recommendations,
        seoData,
        ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
      },
      // Revalidate every hour (3600 seconds)
      revalidate: 3600,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading biography data:', error);
    }
    
    // Return empty data structure if loading fails
    const emptyContent = {
      personalInfo: {
        fullName: "",
        birthDate: "",
        deathDate: "",
        birthPlace: "",
        nationality: "",
        family: []
      },
      education: [],
      career: [],
      philosophy: [],
      collaborations: [],
      legacy: []
    };

    return {
      props: {
        biographyData: {
          content: emptyContent,
          timeline: [],
          images: []
        },
        recommendations: [],
        seoData: generateBiographySEO(emptyContent, locale),
        ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
      },
    };
  }
};

export default Biography;