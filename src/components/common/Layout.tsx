import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import MainNavigation from '@/components/navigation/MainNavigation';
import { Breadcrumb } from './Breadcrumb';
import { PageTransition } from './PageTransition';
import { PerformanceMonitor } from './PerformanceMonitor';
import SkipLinks from './SkipLinks';
import AccessibilityProvider from './AccessibilityProvider';
import { LayoutProps } from '@/types';
import { generateStructuredData } from '@/utils/seo';

interface LayoutComponentProps extends LayoutProps {
  children: React.ReactNode;
  structuredData?: any;
  canonicalUrl?: string;
  ogImage?: string;
  alternateUrls?: { [locale: string]: string };
}

const Layout: React.FC<LayoutComponentProps> = ({
  children,
  title,
  description,
  keywords = [],
  className = '',
  structuredData,
  canonicalUrl,
  ogImage,
  alternateUrls,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale, asPath } = router;

  // Default meta information
  const defaultTitle = t('site.title');
  const defaultDescription = t('site.description');
  const pageTitle = title ? `${title} - ${defaultTitle}` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jean-prouve.vercel.app';
  const fullUrl = canonicalUrl || `${baseUrl}${asPath}`;
  const defaultOgImage = `${baseUrl}/images/og-default.jpg`;
  const pageOgImage = ogImage || defaultOgImage;

  // Generate default structured data for website
  const defaultStructuredData = generateStructuredData({
    type: 'website',
    data: {
      name: defaultTitle,
      description: defaultDescription,
      url: baseUrl,
      languages: ['zh', 'fr', 'en']
    }
  });

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <AccessibilityProvider>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="Jean Prouvé Research Website" />
        <meta name="generator" content="Next.js" />
        <meta httpEquiv="Content-Language" content={locale} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={fullUrl} />
        
        {/* Keywords */}
        {keywords.length > 0 && (
          <meta name="keywords" content={keywords.join(', ')} />
        )}
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:site_name" content={defaultTitle} />
        <meta property="og:image" content={pageOgImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={pageTitle} />
        <meta property="og:locale" content={locale === 'zh' ? 'zh_CN' : locale === 'fr' ? 'fr_FR' : 'en_US'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={fullUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageOgImage} />
        <meta name="twitter:image:alt" content={pageTitle} />
        <meta name="twitter:site" content="@jeanprouve" />
        <meta name="twitter:creator" content="@jeanprouve" />
        
        {/* Language alternates */}
        {alternateUrls ? (
          Object.entries(alternateUrls).map(([lang, url]) => (
            <link key={lang} rel="alternate" hrefLang={lang} href={url} />
          ))
        ) : (
          <>
            <link rel="alternate" hrefLang="zh" href={`${baseUrl}/zh${asPath}`} />
            <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr${asPath}`} />
            <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${asPath}`} />
            <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${asPath}`} />
          </>
        )}
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(finalStructuredData)
          }}
        />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#4A5568" />
        <meta name="msapplication-TileColor" content="#4A5568" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Performance hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Additional SEO meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={defaultTitle} />
      </Head>

      {/* Performance monitoring */}
      <PerformanceMonitor 
        enableWebVitals={true}
        enableMemoryMonitoring={process.env.NODE_ENV === 'development'}
      />

      {/* Skip Links for keyboard navigation */}
      <SkipLinks />

      <div className={`min-h-screen bg-neutral-light ${className}`} lang={locale}>
        {/* Main Navigation */}
        <nav id="main-navigation" role="navigation" aria-label={t('accessibility.main_navigation') || '主导航'}>
          <MainNavigation 
            currentPath={asPath} 
            locale={locale || 'zh'} 
          />
        </nav>

        {/* Main Content */}
        <PageTransition>
          <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
            {/* Breadcrumb Navigation */}
            <nav 
              className="bg-white border-b border-neutral-medium" 
              role="navigation" 
              aria-label={t('accessibility.breadcrumb_navigation') || '面包屑导航'}
            >
              <div className="container-custom py-3">
                <Breadcrumb />
              </div>
            </nav>
            
            {children}
          </main>
        </PageTransition>

        {/* Footer */}
        <footer id="footer" className="bg-primary-iron text-white mt-16" role="contentinfo">
          <div className="container-custom py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About Section */}
              <div>
                <h3 className="text-lg font-heading font-semibold mb-4">
                  Jean Prouvé
                </h3>
                <p className="text-sm text-neutral-medium leading-relaxed">
                  {t('site.description')}
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-heading font-semibold mb-4">
                  {t('navigation.home')}
                </h3>
                <ul className="space-y-2" role="list">
                  <li>
                    <Link 
                      href="/biography" 
                      className="text-sm text-neutral-medium hover:text-white transition-fast focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-iron rounded"
                      aria-describedby="biography-desc"
                    >
                      {t('navigation.biography')}
                    </Link>
                    <span id="biography-desc" className="sr-only">
                      {t('accessibility.biography_description') || '了解让·普鲁维的生平和职业生涯'}
                    </span>
                  </li>
                  <li>
                    <Link 
                      href="/works" 
                      className="text-sm text-neutral-medium hover:text-white transition-fast focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-iron rounded"
                      aria-describedby="works-desc"
                    >
                      {t('navigation.works')}
                    </Link>
                    <span id="works-desc" className="sr-only">
                      {t('accessibility.works_description') || '探索让·普鲁维的建筑作品'}
                    </span>
                  </li>
                  <li>
                    <Link 
                      href="/scholars" 
                      className="text-sm text-neutral-medium hover:text-white transition-fast focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-iron rounded"
                      aria-describedby="scholars-desc"
                    >
                      {t('navigation.scholars')}
                    </Link>
                    <span id="scholars-desc" className="sr-only">
                      {t('accessibility.scholars_description') || '了解全球学者的研究成果'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Language & Copyright */}
              <div>
                <h3 className="text-lg font-heading font-semibold mb-4">
                  {t('navigation.language')}
                </h3>
                <div className="flex space-x-4 mb-4" role="group" aria-label={t('accessibility.language_switcher') || '语言切换'}>
                  <Link 
                    href="/zh" 
                    className="text-sm text-neutral-medium hover:text-white transition-fast focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-iron rounded"
                    aria-current={locale === 'zh' ? 'page' : undefined}
                    lang="zh"
                  >
                    中文
                  </Link>
                  <Link 
                    href="/fr" 
                    className="text-sm text-neutral-medium hover:text-white transition-fast focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-iron rounded"
                    aria-current={locale === 'fr' ? 'page' : undefined}
                    lang="fr"
                  >
                    Français
                  </Link>
                  <Link 
                    href="/en" 
                    className="text-sm text-neutral-medium hover:text-white transition-fast focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-iron rounded"
                    aria-current={locale === 'en' ? 'page' : undefined}
                    lang="en"
                  >
                    English
                  </Link>
                </div>
                <p className="text-xs text-neutral-medium">
                  © 2024 Jean Prouvé Research Website
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AccessibilityProvider>
  );
};

export default Layout;