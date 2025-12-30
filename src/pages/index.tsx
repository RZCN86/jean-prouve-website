import type { NextPage, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { Layout } from '@/components';

const Home: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <Layout
      title={t('navigation.home')}
      description={t('site.description')}
      keywords={['Jean Prouvé', 'architecture', 'lightweight construction', 'prefabricated', 'industrial design']}
    >
      <div className="container-custom py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-primary-iron mb-6">
            Jean Prouvé
          </h1>
          <p className="text-xl text-primary-steel mb-8 max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Link href="/biography" className="card hover:shadow-xl transition-standard group">
              <h3 className="text-xl font-semibold mb-4 group-hover:text-accent-copper transition-fast">
                {t('navigation.biography')}
              </h3>
              <p className="text-gray-600">{t('home.biography_description')}</p>
            </Link>
            <Link href="/works" className="card hover:shadow-xl transition-standard group">
              <h3 className="text-xl font-semibold mb-4 group-hover:text-accent-copper transition-fast">
                {t('navigation.works')}
              </h3>
              <p className="text-gray-600">{t('home.works_description')}</p>
            </Link>
            <Link href="/scholars" className="card hover:shadow-xl transition-standard group">
              <h3 className="text-xl font-semibold mb-4 group-hover:text-accent-copper transition-fast">
                {t('navigation.scholars')}
              </h3>
              <p className="text-gray-600">{t('home.scholars_description')}</p>
            </Link>
          </div>
        </div>
      </div>
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

export default Home;