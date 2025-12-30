import { ArchitecturalWork, Scholar, BiographyContent } from '@/types';

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: any;
  alternateUrls?: { [locale: string]: string };
}

export interface StructuredDataConfig {
  type: 'website' | 'article' | 'person' | 'organization' | 'creativework';
  data: any;
}

/**
 * Generate structured data for different content types
 */
export function generateStructuredData(config: StructuredDataConfig): any {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': config.type === 'website' ? 'WebSite' : 
             config.type === 'article' ? 'Article' :
             config.type === 'person' ? 'Person' :
             config.type === 'organization' ? 'Organization' :
             'CreativeWork'
  };

  switch (config.type) {
    case 'website':
      return {
        ...baseData,
        name: config.data.name,
        description: config.data.description,
        url: config.data.url,
        inLanguage: config.data.languages || ['zh', 'fr', 'en'],
        potentialAction: {
          '@type': 'SearchAction',
          target: `${config.data.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      };

    case 'article':
      return {
        ...baseData,
        headline: config.data.title,
        description: config.data.description,
        author: {
          '@type': 'Organization',
          name: 'Jean Prouvé Research Website'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Jean Prouvé Research Website'
        },
        datePublished: config.data.datePublished || new Date().toISOString(),
        dateModified: config.data.dateModified || new Date().toISOString(),
        mainEntityOfPage: config.data.url,
        keywords: config.data.keywords?.join(', '),
        inLanguage: config.data.language || 'zh'
      };

    case 'person':
      return {
        ...baseData,
        name: config.data.name,
        description: config.data.description,
        birthDate: config.data.birthDate,
        deathDate: config.data.deathDate,
        birthPlace: config.data.birthPlace,
        nationality: config.data.nationality,
        jobTitle: config.data.jobTitle || 'Architect and Designer',
        knowsAbout: config.data.expertise || ['Architecture', 'Industrial Design', 'Prefabricated Construction'],
        sameAs: config.data.sameAs || [],
        ...(config.data.affiliation && {
          affiliation: {
            '@type': 'Organization',
            name: config.data.affiliation
          }
        })
      };

    case 'creativework':
      return {
        ...baseData,
        '@type': 'ArchitecturalStructure',
        name: config.data.name,
        description: config.data.description,
        architect: {
          '@type': 'Person',
          name: 'Jean Prouvé'
        },
        dateCreated: config.data.year,
        location: {
          '@type': 'Place',
          name: config.data.location
        },
        material: config.data.materials,
        category: config.data.category,
        image: config.data.images?.map((img: any) => img.src)
      };

    default:
      return baseData;
  }
}

/**
 * Generate SEO data for biography pages
 */
export function generateBiographySEO(content: BiographyContent, locale: string = 'zh'): SEOData {
  const titles = {
    zh: '让·普鲁维传记 - 法国建筑师和设计师的生平',
    fr: 'Biographie de Jean Prouvé - Architecte et Designer Français',
    en: 'Jean Prouvé Biography - French Architect and Designer'
  };

  const descriptions = {
    zh: '了解让·普鲁维(1901-1984)的生平故事，探索这位法国建筑师和工业设计师在轻型建筑和预制构件领域的开创性工作。',
    fr: 'Découvrez la vie de Jean Prouvé (1901-1984), architecte français et designer industriel pionnier dans la construction légère et les éléments préfabriqués.',
    en: 'Learn about the life of Jean Prouvé (1901-1984), French architect and industrial designer who pioneered lightweight construction and prefabricated elements.'
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.zh,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.zh,
    keywords: [
      'Jean Prouvé', 'biography', 'architect', 'designer', 'French architecture',
      'industrial design', 'prefabricated construction', 'lightweight construction',
      '让·普鲁维', '传记', '建筑师', '设计师', '法国建筑'
    ],
    structuredData: generateStructuredData({
      type: 'person',
      data: {
        name: content.personalInfo.fullName || 'Jean Prouvé',
        description: descriptions[locale as keyof typeof descriptions] || descriptions.zh,
        birthDate: content.personalInfo.birthDate,
        deathDate: content.personalInfo.deathDate,
        birthPlace: content.personalInfo.birthPlace,
        nationality: content.personalInfo.nationality,
        jobTitle: 'Architect and Industrial Designer',
        expertise: ['Architecture', 'Industrial Design', 'Prefabricated Construction', 'Lightweight Construction'],
        sameAs: [
          'https://en.wikipedia.org/wiki/Jean_Prouv%C3%A9',
          'https://fr.wikipedia.org/wiki/Jean_Prouv%C3%A9'
        ]
      }
    })
  };
}

/**
 * Generate SEO data for works pages
 */
export function generateWorkSEO(work: ArchitecturalWork, locale: string = 'zh'): SEOData {
  const titleTemplates = {
    zh: `${work.title} - 让·普鲁维建筑作品`,
    fr: `${work.title} - Œuvre Architecturale de Jean Prouvé`,
    en: `${work.title} - Jean Prouvé Architectural Work`
  };

  const descriptionTemplates = {
    zh: `探索让·普鲁维的建筑作品《${work.title}》(${work.year})，了解其设计理念、建造技术和历史意义。`,
    fr: `Explorez l'œuvre architecturale de Jean Prouvé "${work.title}" (${work.year}), découvrez sa conception, ses techniques de construction et sa signification historique.`,
    en: `Explore Jean Prouvé's architectural work "${work.title}" (${work.year}), learn about its design concept, construction techniques, and historical significance.`
  };

  return {
    title: titleTemplates[locale as keyof typeof titleTemplates] || titleTemplates.zh,
    description: work.description || descriptionTemplates[locale as keyof typeof descriptionTemplates] || descriptionTemplates.zh,
    keywords: [
      'Jean Prouvé', work.title, 'architecture', 'building', 'design',
      work.category.name, work.location, work.year.toString(),
      '让·普鲁维', '建筑作品', '设计'
    ],
    structuredData: generateStructuredData({
      type: 'creativework',
      data: {
        name: work.title,
        description: work.description,
        year: work.year.toString(),
        location: work.location,
        category: work.category.name,
        materials: work.specifications?.map(spec => spec.property),
        images: work.images
      }
    })
  };
}

/**
 * Generate SEO data for scholar pages
 */
export function generateScholarSEO(scholar: Scholar, locale: string = 'zh'): SEOData {
  const titleTemplates = {
    zh: `${scholar.name} - 让·普鲁维研究学者`,
    fr: `${scholar.name} - Chercheur Jean Prouvé`,
    en: `${scholar.name} - Jean Prouvé Research Scholar`
  };

  const descriptionTemplates = {
    zh: `了解${scholar.name}在让·普鲁维研究领域的学术贡献，包括研究成果、出版物和展览。`,
    fr: `Découvrez les contributions académiques de ${scholar.name} dans le domaine de la recherche sur Jean Prouvé, y compris les recherches, publications et expositions.`,
    en: `Learn about ${scholar.name}'s academic contributions in Jean Prouvé research, including research findings, publications, and exhibitions.`
  };

  return {
    title: titleTemplates[locale as keyof typeof titleTemplates] || titleTemplates.zh,
    description: scholar.biography || descriptionTemplates[locale as keyof typeof descriptionTemplates] || descriptionTemplates.zh,
    keywords: [
      'Jean Prouvé', 'research', 'scholar', scholar.name, scholar.institution,
      scholar.country, ...scholar.specialization,
      '让·普鲁维', '研究', '学者'
    ],
    structuredData: generateStructuredData({
      type: 'person',
      data: {
        name: scholar.name,
        description: scholar.biography,
        jobTitle: 'Research Scholar',
        affiliation: scholar.institution,
        nationality: scholar.country,
        expertise: scholar.specialization
      }
    })
  };
}

/**
 * Generate sitemap data
 */
export function generateSitemapUrls(baseUrl: string, locales: string[] = ['zh', 'fr', 'en']) {
  const staticPages = [
    '',
    '/biography',
    '/works',
    '/scholars',
    '/search'
  ];

  const urls: Array<{
    url: string;
    lastModified: string;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
    alternateUrls?: { [locale: string]: string };
  }> = [];

  staticPages.forEach(page => {
    locales.forEach(locale => {
      const url = `${baseUrl}${locale === 'zh' ? '' : `/${locale}`}${page}`;
      const alternateUrls: { [locale: string]: string } = {};
      
      locales.forEach(altLocale => {
        alternateUrls[altLocale] = `${baseUrl}${altLocale === 'zh' ? '' : `/${altLocale}`}${page}`;
      });

      urls.push({
        url,
        lastModified: new Date().toISOString(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
        alternateUrls
      });
    });
  });

  return urls;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(baseUrl: string): string {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /node_modules/

# Allow important static assets
Allow: /images/
Allow: /locales/
Allow: /favicon.ico
Allow: /robots.txt
Allow: /sitemap.xml
`;
}