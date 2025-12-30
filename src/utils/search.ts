import { SearchQuery, SearchResult, ArchitecturalWork, Scholar, BiographyContent, TimelineEvent } from '@/types';
import { getAllWorks } from '@/data/works';
import { scholars } from '@/data/scholars';
import { biographyContent, timelineEvents } from '@/data/biography';

/**
 * Mock data for testing search functionality
 */
export const mockSearchData = [
  {
    id: '1',
    type: 'work' as const,
    title: 'Maison Tropicale',
    excerpt: 'Prefabricated house designed for tropical climates',
    relevanceScore: 0.9,
    metadata: { year: 1949, category: 'residential', location: 'Africa' }
  },
  {
    id: '2',
    type: 'work' as const,
    title: 'Cité Universitaire',
    excerpt: 'Student housing complex with innovative construction',
    relevanceScore: 0.8,
    metadata: { year: 1954, category: 'educational', location: 'Nancy' }
  },
  {
    id: '3',
    type: 'scholar' as const,
    title: 'Catherine Coley',
    excerpt: 'Expert on Prouvé\'s prefabricated construction methods',
    relevanceScore: 0.7,
    metadata: { region: 'Europe', specialization: 'prefabrication' }
  },
  {
    id: '4',
    type: 'biography' as const,
    title: 'Early Career',
    excerpt: 'Prouvé\'s formative years in metalworking',
    relevanceScore: 0.6,
    metadata: { period: '1920-1930', category: 'career' }
  }
];

/**
 * Enhanced search function that includes actual works data
 */
export function performWorksSearch(query: SearchQuery): ArchitecturalWork[] {
  const allWorks = getAllWorks();
  let results = [...allWorks];

  // Filter by search term
  if (query.term.trim()) {
    const searchTerm = query.term.toLowerCase();
    results = results.filter(work => 
      work.title.toLowerCase().includes(searchTerm) ||
      work.description.toLowerCase().includes(searchTerm) ||
      work.location.toLowerCase().includes(searchTerm) ||
      work.category.name.toLowerCase().includes(searchTerm)
    );
  }

  // Apply filters
  if (query.filters.category && query.filters.category.length > 0) {
    results = results.filter(work => 
      query.filters.category!.includes(work.category.id)
    );
  }

  if (query.filters.year) {
    const [minYear, maxYear] = query.filters.year;
    results = results.filter(work => {
      return work.year >= minYear && work.year <= maxYear;
    });
  }

  // Sort results
  switch (query.sortBy) {
    case 'year':
      results.sort((a, b) => b.year - a.year);
      break;
    case 'title':
      results.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
      break;
    case 'relevance':
    default:
      if (query.term.trim()) {
        const searchTerm = query.term.toLowerCase();
        results.sort((a, b) => {
          const aScore = calculateWorkRelevanceScore(a, searchTerm);
          const bScore = calculateWorkRelevanceScore(b, searchTerm);
          return bScore - aScore;
        });
      } else {
        results.sort((a, b) => b.year - a.year);
      }
      break;
  }

  return results;
}

/**
 * Calculate relevance score for architectural works
 */
function calculateWorkRelevanceScore(work: ArchitecturalWork, searchTerm: string): number {
  let score = 0;
  
  // Title matches get highest score
  if (work.title.toLowerCase().includes(searchTerm)) {
    score += 10;
  }
  
  // Category matches get medium score
  if (work.category.name.toLowerCase().includes(searchTerm)) {
    score += 5;
  }
  
  // Location matches get medium score
  if (work.location.toLowerCase().includes(searchTerm)) {
    score += 5;
  }
  
  // Description matches get lower score
  if (work.description.toLowerCase().includes(searchTerm)) {
    score += 2;
  }
  
  return score;
}

/**
 * Validate search query parameters
 */
export function validateSearchQuery(query: SearchQuery): boolean {
  // Term should be a string
  if (typeof query.term !== 'string') return false;

  // Filters should be an object
  if (typeof query.filters !== 'object' || query.filters === null) return false;

  // SortBy should be a valid option
  const validSortOptions = ['relevance', 'year', 'title', 'author'];
  if (!validSortOptions.includes(query.sortBy)) return false;

  // Year filter should be a valid range if provided
  if (query.filters.year) {
    const [min, max] = query.filters.year;
    if (typeof min !== 'number' || typeof max !== 'number' || min > max) {
      return false;
    }
  }

  return true;
}

/**
 * Get available filter options from works data
 */
export function getWorksFilterOptions(): {
  categories: string[];
  yearRange: [number, number];
} {
  const allWorks = getAllWorks();
  const categories = new Set<string>();
  const years: number[] = [];

  allWorks.forEach(work => {
    categories.add(work.category.id);
    years.push(work.year);
  });

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  return {
    categories: Array.from(categories),
    yearRange: [minYear, maxYear]
  };
}

/**
 * Get available filter options for all content types
 */
export function getAvailableFilters(): {
  categories: string[];
  types: string[];
  regions: string[];
  yearRange: [number, number];
} {
  // Get categories from works data
  const worksFilters = getWorksFilterOptions();
  
  // Define available content types
  const types = ['work', 'biography', 'scholar', 'publication'];
  
  // Define available regions for scholars
  const regions = ['Europe', 'North America', 'Asia', 'Africa', 'Oceania', 'South America'];
  
  return {
    categories: worksFilters.categories,
    types,
    regions,
    yearRange: worksFilters.yearRange
  };
}

/**
 * Enhanced global search function that searches across all content types
 */
export function performGlobalSearch(query: SearchQuery): SearchResult[] {
  let results: SearchResult[] = [];

  // Search architectural works
  const workResults = searchArchitecturalWorks(query);
  results.push(...workResults);

  // Search scholars
  const scholarResults = searchScholars(query);
  results.push(...scholarResults);

  // Search biography content
  const biographyResults = searchBiographyContent(query);
  results.push(...biographyResults);

  // Apply global filters
  results = applyGlobalFilters(results, query.filters);

  // Sort results globally
  results = sortGlobalResults(results, query.sortBy, query.term);

  return results;
}

/**
 * Search architectural works and convert to SearchResult format
 */
function searchArchitecturalWorks(query: SearchQuery): SearchResult[] {
  const works = performWorksSearch(query);
  
  return works.map(work => {
    let excerpt = work.description.length > 150 ? `${work.description.substring(0, 150)}...` : work.description;
    
    // Ensure proper ending punctuation
    if (!excerpt.endsWith('...') && !/[.!?。！？]$/.test(excerpt)) {
      excerpt += '。';
    }
    
    return {
      id: work.id,
      type: 'work' as const,
      title: work.title,
      excerpt,
      relevanceScore: Math.min(calculateWorkRelevanceScore(work, query.term.toLowerCase()) / 10, 1.0),
      metadata: {
        year: work.year,
        location: work.location,
        category: work.category.id,
        status: work.status,
        categoryName: work.category.name
      }
    };
  });
}

/**
 * Search scholars and convert to SearchResult format
 */
function searchScholars(query: SearchQuery): SearchResult[] {
  if (!query.term.trim()) {
    return scholars.map(scholar => convertScholarToSearchResult(scholar, 0.5));
  }

  const searchTerm = query.term.toLowerCase();
  const matchingScholars = scholars.filter(scholar => 
    scholar.name.toLowerCase().includes(searchTerm) ||
    scholar.institution.toLowerCase().includes(searchTerm) ||
    scholar.biography.toLowerCase().includes(searchTerm) ||
    scholar.specialization.some(spec => spec.toLowerCase().includes(searchTerm)) ||
    scholar.publications.some(pub => 
      pub.title.toLowerCase().includes(searchTerm) ||
      pub.abstract.toLowerCase().includes(searchTerm) ||
      pub.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    )
  );

  return matchingScholars.map(scholar => {
    const relevanceScore = calculateScholarRelevanceScore(scholar, searchTerm);
    return convertScholarToSearchResult(scholar, relevanceScore);
  });
}

/**
 * Search biography content and convert to SearchResult format
 */
function searchBiographyContent(query: SearchQuery): SearchResult[] {
  if (!query.term.trim()) {
    return createBiographySearchResults(0.3);
  }

  const searchTerm = query.term.toLowerCase();
  const results: SearchResult[] = [];

  // Search in personal info
  if (biographyContent.personalInfo.fullName.toLowerCase().includes(searchTerm) ||
      biographyContent.personalInfo.birthPlace.toLowerCase().includes(searchTerm) ||
      biographyContent.personalInfo.nationality.toLowerCase().includes(searchTerm)) {
    const personalExcerpt = `${biographyContent.personalInfo.fullName}，${biographyContent.personalInfo.birthDate}出生于${biographyContent.personalInfo.birthPlace}`;
    results.push({
      id: 'biography-personal',
      type: 'biography',
      title: '个人信息',
      excerpt: personalExcerpt.length > 150 ? personalExcerpt.substring(0, 150) + '...' : personalExcerpt + '.',
      relevanceScore: 0.9,
      metadata: {
        section: 'personal',
        birthYear: 1901,
        deathYear: 1984
      }
    });
  }

  // Search in career milestones
  biographyContent.career.forEach((milestone, index) => {
    if (milestone.position.toLowerCase().includes(searchTerm) ||
        milestone.organization.toLowerCase().includes(searchTerm) ||
        milestone.achievements.some(achievement => achievement.toLowerCase().includes(searchTerm))) {
      const careerExcerpt = `${milestone.organization} (${milestone.period}) - ${milestone.achievements[0]}`;
      results.push({
        id: `biography-career-${index}`,
        type: 'biography',
        title: milestone.position,
        excerpt: careerExcerpt.length > 150 ? careerExcerpt.substring(0, 150) + '...' : careerExcerpt + '.',
        relevanceScore: 0.8,
        metadata: {
          section: 'career',
          period: milestone.period,
          organization: milestone.organization
        }
      });
    }
  });

  // Search in philosophy statements
  biographyContent.philosophy.forEach((statement, index) => {
    if (statement.theme.toLowerCase().includes(searchTerm) ||
        statement.content.toLowerCase().includes(searchTerm)) {
      results.push({
        id: `biography-philosophy-${index}`,
        type: 'biography',
        title: statement.theme,
        excerpt: `${statement.content.length > 150 ? statement.content.substring(0, 150) + '...' : statement.content}`,
        relevanceScore: 0.7,
        metadata: {
          section: 'philosophy',
          year: statement.year,
          source: statement.source
        }
      });
    }
  });

  // Search in timeline events
  timelineEvents.forEach(event => {
    if (event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm)) {
      results.push({
        id: `biography-timeline-${event.year}`,
        type: 'biography',
        title: `${event.year}: ${event.title}`,
        excerpt: event.description.length > 150 ? event.description.substring(0, 150) + '...' : event.description,
        relevanceScore: Math.min(0.6, 1.0),
        metadata: {
          section: 'timeline',
          year: event.year,
          category: event.category
        }
      });
    }
  });

  return results;
}

/**
 * Create default biography search results when no search term
 */
function createBiographySearchResults(baseScore: number): SearchResult[] {
  return [
    {
      id: 'biography-overview',
      type: 'biography',
      title: '让·普鲁维传记',
      excerpt: '法国建筑师和设计师，现代预制建筑的先驱，以其创新的轻型建筑系统而闻名。',
      relevanceScore: baseScore,
      metadata: {
        section: 'overview',
        birthYear: 1901,
        deathYear: 1984
      }
    }
  ];
}

/**
 * Convert scholar to SearchResult format
 */
function convertScholarToSearchResult(scholar: Scholar, relevanceScore: number): SearchResult {
  const biographyExcerpt = scholar.biography.length > 120 ? `${scholar.biography.substring(0, 120)}...` : scholar.biography;
  const fullExcerpt = `${scholar.institution}, ${scholar.country} - ${biographyExcerpt}`;
  
  // Ensure proper ending punctuation
  const finalExcerpt = fullExcerpt.endsWith('...') || /[.!?]$/.test(fullExcerpt) 
    ? fullExcerpt 
    : fullExcerpt + '.';
  
  return {
    id: scholar.id,
    type: 'scholar',
    title: scholar.name,
    excerpt: finalExcerpt,
    relevanceScore: Math.min(relevanceScore, 1.0),
    metadata: {
      institution: scholar.institution,
      country: scholar.country,
      region: scholar.region,
      specialization: scholar.specialization,
      publicationCount: scholar.publications.length
    }
  };
}

/**
 * Calculate relevance score for scholars
 */
function calculateScholarRelevanceScore(scholar: Scholar, searchTerm: string): number {
  let score = 0;
  
  // Name matches get highest score
  if (scholar.name.toLowerCase().includes(searchTerm)) {
    score += 10;
  }
  
  // Institution matches get high score
  if (scholar.institution.toLowerCase().includes(searchTerm)) {
    score += 8;
  }
  
  // Specialization matches get medium score
  if (scholar.specialization.some(spec => spec.toLowerCase().includes(searchTerm))) {
    score += 6;
  }
  
  // Biography matches get medium score
  if (scholar.biography.toLowerCase().includes(searchTerm)) {
    score += 4;
  }
  
  // Publication matches get lower score
  const publicationMatches = scholar.publications.filter(pub => 
    pub.title.toLowerCase().includes(searchTerm) ||
    pub.abstract.toLowerCase().includes(searchTerm) ||
    pub.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
  ).length;
  score += publicationMatches * 2;
  
  return Math.min(score, 10) / 10; // Normalize to 0-1
}

/**
 * Apply global filters to search results
 */
function applyGlobalFilters(results: SearchResult[], filters: SearchQuery['filters']): SearchResult[] {
  let filteredResults = [...results];

  // Filter by content type
  if (filters.type && filters.type.length > 0) {
    filteredResults = filteredResults.filter(result => 
      filters.type!.includes(result.type)
    );
  }

  // Filter by year range
  if (filters.year) {
    const [minYear, maxYear] = filters.year;
    filteredResults = filteredResults.filter(result => {
      const itemYear = result.metadata.year || result.metadata.birthYear;
      return itemYear && itemYear >= minYear && itemYear <= maxYear;
    });
  }

  // Filter by region (for scholars)
  if (filters.region && filters.region.length > 0) {
    filteredResults = filteredResults.filter(result => 
      result.type !== 'scholar' || 
      (result.metadata.region && filters.region!.includes(result.metadata.region))
    );
  }

  // Filter by category (for works)
  if (filters.category && filters.category.length > 0) {
    filteredResults = filteredResults.filter(result => 
      result.type !== 'work' || 
      (result.metadata.category && filters.category!.includes(result.metadata.category))
    );
  }

  return filteredResults;
}

/**
 * Sort global search results
 */
function sortGlobalResults(results: SearchResult[], sortBy: SearchQuery['sortBy'], searchTerm: string): SearchResult[] {
  const sortedResults = [...results];

  switch (sortBy) {
    case 'relevance':
      sortedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
      break;
    case 'year':
      sortedResults.sort((a, b) => {
        const aYear = a.metadata.year || a.metadata.birthYear || 0;
        const bYear = b.metadata.year || b.metadata.birthYear || 0;
        return bYear - aYear;
      });
      break;
    case 'title':
      sortedResults.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
      break;
    case 'author':
      sortedResults.sort((a, b) => {
        // For works, sort by location; for scholars, by name; for biography, by section
        const aSort = a.metadata.location || a.title || '';
        const bSort = b.metadata.location || b.title || '';
        return aSort.localeCompare(bSort, 'zh-CN');
      });
      break;
    default:
      sortedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  return sortedResults;
}

/**
 * Get comprehensive filter options for global search
 */
export function getGlobalSearchFilters(): {
  types: Array<{ id: string; name: string; count: number }>;
  categories: Array<{ id: string; name: string; count: number }>;
  regions: Array<{ id: string; name: string; count: number }>;
  yearRange: [number, number];
} {
  const works = getAllWorks();
  
  // Content types with counts
  const types = [
    { id: 'work', name: '建筑作品', count: works.length },
    { id: 'scholar', name: '学者研究', count: scholars.length },
    { id: 'biography', name: '传记内容', count: 1 },
    { id: 'publication', name: '出版物', count: scholars.reduce((sum, s) => sum + s.publications.length, 0) }
  ];

  // Categories from works
  const categoryMap = new Map<string, { name: string; count: number }>();
  works.forEach(work => {
    const existing = categoryMap.get(work.category.id);
    categoryMap.set(work.category.id, {
      name: work.category.name,
      count: (existing?.count || 0) + 1
    });
  });
  const categories = Array.from(categoryMap.entries()).map(([id, data]) => ({
    id,
    name: data.name,
    count: data.count
  }));

  // Regions from scholars
  const regionMap = new Map<string, number>();
  scholars.forEach(scholar => {
    regionMap.set(scholar.region, (regionMap.get(scholar.region) || 0) + 1);
  });
  const regions = Array.from(regionMap.entries()).map(([id, count]) => ({
    id,
    name: getRegionDisplayName(id),
    count
  }));

  // Year range from works and scholars
  const allYears = [
    ...works.map(w => w.year),
    ...scholars.flatMap(s => s.publications.map(p => p.year)),
    1901, // Prouvé's birth year
    1984  // Prouvé's death year
  ];
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);

  return {
    types,
    categories,
    regions,
    yearRange: [minYear, maxYear]
  };
}

/**
 * Get display name for region
 */
function getRegionDisplayName(regionId: string): string {
  const regionNames: Record<string, string> = {
    'europe': '欧洲',
    'northAmerica': '北美洲',
    'asia': '亚洲',
    'africa': '非洲',
    'oceania': '大洋洲',
    'southAmerica': '南美洲'
  };
  return regionNames[regionId] || regionId;
}

/**
 * Get search suggestions based on partial input
 */
export function getSearchSuggestions(partialQuery: string): string[] {
  if (partialQuery.length < 2) return [];

  const suggestions = new Set<string>();
  const query = partialQuery.toLowerCase();

  // Add work titles and locations
  getAllWorks().forEach(work => {
    if (work.title.toLowerCase().includes(query)) {
      suggestions.add(work.title);
    }
    if (work.location.toLowerCase().includes(query)) {
      suggestions.add(work.location);
    }
    if (work.category.name.toLowerCase().includes(query)) {
      suggestions.add(work.category.name);
    }
  });

  // Add scholar names and institutions
  scholars.forEach(scholar => {
    if (scholar.name.toLowerCase().includes(query)) {
      suggestions.add(scholar.name);
    }
    if (scholar.institution.toLowerCase().includes(query)) {
      suggestions.add(scholar.institution);
    }
  });

  // Add biography-related terms
  const biographyTerms = ['传记', '生平', '教育', '职业', '哲学', '合作', '遗产'];
  biographyTerms.forEach(term => {
    if (term.includes(query)) {
      suggestions.add(term);
    }
  });

  return Array.from(suggestions).slice(0, 8); // Limit to 8 suggestions
}

/**
 * Legacy search function for backward compatibility
 */
export function performSearch(query: SearchQuery): SearchResult[] {
  return performGlobalSearch(query);
}