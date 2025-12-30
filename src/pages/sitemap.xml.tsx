import { GetServerSideProps } from 'next';
import { generateSitemapUrls } from '@/utils/seo';
import { getAllWorks } from '@/data/works';
import { getAllScholars } from '@/data/scholars';

function generateSiteMap(urls: Array<{
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
  alternateUrls?: { [locale: string]: string };
}>) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(({ url, lastModified, changeFrequency, priority, alternateUrls }) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
    ${alternateUrls ? Object.entries(alternateUrls).map(([locale, altUrl]) => 
      `<xhtml:link rel="alternate" hreflang="${locale}" href="${altUrl}" />`
    ).join('\n    ') : ''}
  </url>`).join('')}
</urlset>`;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jean-prouve.vercel.app';
  const locales = ['zh', 'fr', 'en'];
  
  try {
    // Get static pages
    const staticUrls = generateSitemapUrls(baseUrl, locales);
    
    // Get dynamic pages - works
    const works = getAllWorks();
    const workUrls: Array<{
      url: string;
      lastModified: string;
      changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
      priority: number;
      alternateUrls?: { [locale: string]: string };
    }> = [];
    
    works.forEach(work => {
      locales.forEach(locale => {
        const url = `${baseUrl}${locale === 'zh' ? '' : `/${locale}`}/works/${work.id}`;
        const alternateUrls: { [locale: string]: string } = {};
        
        locales.forEach(altLocale => {
          alternateUrls[altLocale] = `${baseUrl}${altLocale === 'zh' ? '' : `/${altLocale}`}/works/${work.id}`;
        });

        workUrls.push({
          url,
          lastModified: new Date().toISOString(),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternateUrls
        });
      });
    });

    // Get dynamic pages - scholars
    const scholars = getAllScholars();
    const scholarUrls: Array<{
      url: string;
      lastModified: string;
      changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
      priority: number;
      alternateUrls?: { [locale: string]: string };
    }> = [];
    
    scholars.forEach(scholar => {
      locales.forEach(locale => {
        const url = `${baseUrl}${locale === 'zh' ? '' : `/${locale}`}/scholars/${scholar.id}`;
        const alternateUrls: { [locale: string]: string } = {};
        
        locales.forEach(altLocale => {
          alternateUrls[altLocale] = `${baseUrl}${altLocale === 'zh' ? '' : `/${altLocale}`}/scholars/${scholar.id}`;
        });

        scholarUrls.push({
          url,
          lastModified: new Date().toISOString(),
          changeFrequency: 'monthly',
          priority: 0.6,
          alternateUrls
        });
      });
    });

    // Combine all URLs
    const allUrls = [...staticUrls, ...workUrls, ...scholarUrls];
    
    // Generate the XML sitemap
    const sitemap = generateSiteMap(allUrls);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return minimal sitemap on error
    const minimalSitemap = generateSiteMap(generateSitemapUrls(baseUrl, locales));
    res.setHeader('Content-Type', 'text/xml');
    res.write(minimalSitemap);
    res.end();

    return {
      props: {},
    };
  }
};

export default SiteMap;