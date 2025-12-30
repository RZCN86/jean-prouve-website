import { ArchitecturalWork, Scholar, SearchResult } from '@/types';
import { getAllWorks } from '@/data/works';
import { scholars } from '@/data/scholars';
import { biographyContent, timelineEvents } from '@/data/biography';

/**
 * Helper function to create properly formatted excerpts
 */
function createExcerpt(text: string, maxLength: number = 120): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Try to break at a word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

export interface RecommendationItem {
  id: string;
  type: 'work' | 'scholar' | 'biography';
  title: string;
  excerpt: string;
  relevanceScore: number;
  metadata: Record<string, any>;
  reason: string; // Why this item is recommended
}

export interface RecommendationOptions {
  maxResults?: number;
  includeTypes?: Array<'work' | 'scholar' | 'biography'>;
  excludeIds?: string[];
}

/**
 * Get content recommendations based on a work
 */
export function getWorkRecommendations(
  workId: string, 
  options: RecommendationOptions = {}
): RecommendationItem[] {
  const { maxResults = 6, includeTypes = ['work', 'scholar', 'biography'], excludeIds = [] } = options;
  const work = getAllWorks().find(w => w.id === workId);
  
  if (!work) return [];

  const recommendations: RecommendationItem[] = [];

  // Related works by category
  if (includeTypes.includes('work')) {
    const relatedWorks = getAllWorks()
      .filter(w => w.id !== workId && !excludeIds.includes(w.id))
      .filter(w => w.category.id === work.category.id || w.year === work.year)
      .slice(0, 3);

    relatedWorks.forEach(relatedWork => {
      const reason = relatedWork.category.id === work.category.id 
        ? `同类型建筑：${work.category.name}`
        : `同年代作品：${work.year}年`;

      recommendations.push({
        id: relatedWork.id,
        type: 'work',
        title: relatedWork.title,
        excerpt: createExcerpt(relatedWork.description),
        relevanceScore: calculateWorkSimilarity(work, relatedWork),
        metadata: {
          year: relatedWork.year,
          location: relatedWork.location,
          category: relatedWork.category.name
        },
        reason
      });
    });
  }

  // Related scholars by specialization
  if (includeTypes.includes('scholar')) {
    const relatedScholars = scholars
      .filter(s => !excludeIds.includes(s.id))
      .filter(s => 
        s.specialization.includes('architecturalHistory') ||
        s.specialization.includes('prefabricatedConstruction') ||
        (work.category.id === 'residential' && s.specialization.includes('modernism'))
      )
      .slice(0, 2);

    relatedScholars.forEach(scholar => {
      recommendations.push({
        id: scholar.id,
        type: 'scholar',
        title: scholar.name,
        excerpt: `${scholar.institution} - ${createExcerpt(scholar.biography, 100)}`,
        relevanceScore: 0.7,
        metadata: {
          institution: scholar.institution,
          region: scholar.region,
          specialization: scholar.specialization
        },
        reason: '相关研究领域的专家'
      });
    });
  }

  // Related biography content
  if (includeTypes.includes('biography')) {
    // Find relevant career periods or collaborations
    const relevantCareer = biographyContent.career.find(career => 
      career.period.includes(work.year.toString()) ||
      career.achievements.some(achievement => 
        achievement.toLowerCase().includes(work.category.name.toLowerCase())
      )
    );

    if (relevantCareer) {
      recommendations.push({
        id: 'biography-career',
        type: 'biography',
        title: `职业生涯：${relevantCareer.position}`,
        excerpt: `${relevantCareer.organization} (${relevantCareer.period}) - ${relevantCareer.achievements[0]}`,
        relevanceScore: 0.8,
        metadata: {
          section: 'career',
          period: relevantCareer.period,
          organization: relevantCareer.organization
        },
        reason: '相关职业经历'
      });
    }
  }

  // Sort by relevance score and return top results
  return recommendations
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults);
}

/**
 * Get content recommendations based on a scholar
 */
export function getScholarRecommendations(
  scholarId: string,
  options: RecommendationOptions = {}
): RecommendationItem[] {
  const { maxResults = 6, includeTypes = ['work', 'scholar', 'biography'], excludeIds = [] } = options;
  const scholar = scholars.find(s => s.id === scholarId);
  
  if (!scholar) return [];

  const recommendations: RecommendationItem[] = [];

  // Related works by specialization
  if (includeTypes.includes('work')) {
    const relatedWorks = getAllWorks()
      .filter(w => !excludeIds.includes(w.id))
      .filter(w => {
        // Match works to scholar's specialization
        if (scholar.specialization.includes('prefabricatedConstruction')) {
          return w.category.id === 'residential' || w.category.id === 'industrial';
        }
        if (scholar.specialization.includes('industrialDesign')) {
          return w.category.id === 'industrial' || w.category.id === 'experimental';
        }
        if (scholar.specialization.includes('modernism')) {
          return w.year >= 1930 && w.year <= 1960;
        }
        return true;
      })
      .slice(0, 3);

    relatedWorks.forEach(work => {
      recommendations.push({
        id: work.id,
        type: 'work',
        title: work.title,
        excerpt: createExcerpt(work.description),
        relevanceScore: 0.8,
        metadata: {
          year: work.year,
          location: work.location,
          category: work.category.name
        },
        reason: `与${scholar.specialization[0]}研究相关`
      });
    });
  }

  // Related scholars by region or specialization
  if (includeTypes.includes('scholar')) {
    const relatedScholars = scholars
      .filter(s => s.id !== scholarId && !excludeIds.includes(s.id))
      .filter(s => 
        s.region === scholar.region ||
        s.specialization.some(spec => scholar.specialization.includes(spec))
      )
      .slice(0, 2);

    relatedScholars.forEach(relatedScholar => {
      const reason = relatedScholar.region === scholar.region
        ? `同地区学者：${getRegionDisplayName(scholar.region)}`
        : '相似研究领域';

      recommendations.push({
        id: relatedScholar.id,
        type: 'scholar',
        title: relatedScholar.name,
        excerpt: createExcerpt(relatedScholar.biography, 100),
        relevanceScore: relatedScholar.region === scholar.region ? 0.7 : 0.6,
        metadata: {
          institution: relatedScholar.institution,
          region: relatedScholar.region,
          specialization: relatedScholar.specialization
        },
        reason
      });
    });
  }

  // Related biography content
  if (includeTypes.includes('biography')) {
    // Find relevant collaborations or philosophy
    const relevantCollaboration = biographyContent.collaborations.find(collab =>
      scholar.specialization.some(spec => 
        collab.description.toLowerCase().includes(spec.toLowerCase())
      )
    );

    if (relevantCollaboration) {
      recommendations.push({
        id: 'biography-collaboration',
        type: 'biography',
        title: `合作项目：${relevantCollaboration.project}`,
        excerpt: `与${relevantCollaboration.collaborator}的合作 (${relevantCollaboration.period})`,
        relevanceScore: 0.7,
        metadata: {
          section: 'collaboration',
          period: relevantCollaboration.period,
          collaborator: relevantCollaboration.collaborator
        },
        reason: '相关合作经历'
      });
    }
  }

  return recommendations
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults);
}

/**
 * Get content recommendations based on biography section
 */
export function getBiographyRecommendations(
  section: string,
  options: RecommendationOptions = {}
): RecommendationItem[] {
  const { maxResults = 6, includeTypes = ['work', 'scholar', 'biography'], excludeIds = [] } = options;
  const recommendations: RecommendationItem[] = [];

  // Related works based on biography section
  if (includeTypes.includes('work')) {
    let relatedWorks: ArchitecturalWork[] = [];

    switch (section) {
      case 'career':
        // Show works from different career periods
        relatedWorks = getAllWorks()
          .filter(w => !excludeIds.includes(w.id))
          .sort((a, b) => a.year - b.year)
          .slice(0, 3);
        break;
      case 'philosophy':
        // Show works that exemplify his philosophy
        relatedWorks = getAllWorks()
          .filter(w => !excludeIds.includes(w.id))
          .filter(w => w.category.id === 'experimental' || w.category.id === 'residential')
          .slice(0, 3);
        break;
      case 'collaboration':
        // Show works from collaboration periods
        relatedWorks = getAllWorks()
          .filter(w => !excludeIds.includes(w.id))
          .filter(w => w.year >= 1945 && w.year <= 1960)
          .slice(0, 3);
        break;
      default:
        relatedWorks = getAllWorks()
          .filter(w => !excludeIds.includes(w.id))
          .slice(0, 3);
    }

    relatedWorks.forEach(work => {
      recommendations.push({
        id: work.id,
        type: 'work',
        title: work.title,
        excerpt: createExcerpt(work.description),
        relevanceScore: 0.8,
        metadata: {
          year: work.year,
          location: work.location,
          category: work.category.name
        },
        reason: '相关时期的代表作品'
      });
    });
  }

  // Related scholars
  if (includeTypes.includes('scholar')) {
    const relatedScholars = scholars
      .filter(s => !excludeIds.includes(s.id))
      .filter(s => s.specialization.includes('architecturalHistory'))
      .slice(0, 2);

    relatedScholars.forEach(scholar => {
      recommendations.push({
        id: scholar.id,
        type: 'scholar',
        title: scholar.name,
        excerpt: `${scholar.institution} - ${createExcerpt(scholar.biography, 100)}`,
        relevanceScore: 0.6,
        metadata: {
          institution: scholar.institution,
          region: scholar.region,
          specialization: scholar.specialization
        },
        reason: '建筑史研究专家'
      });
    });
  }

  return recommendations
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults);
}

/**
 * Get general content recommendations (for homepage, etc.)
 */
export function getGeneralRecommendations(
  options: RecommendationOptions = {}
): RecommendationItem[] {
  const { maxResults = 9, includeTypes = ['work', 'scholar', 'biography'], excludeIds = [] } = options;
  const recommendations: RecommendationItem[] = [];

  // Featured works
  if (includeTypes.includes('work')) {
    const featuredWorks = getAllWorks()
      .filter(w => !excludeIds.includes(w.id))
      .sort((a, b) => b.year - a.year) // Most recent first
      .slice(0, 3);

    featuredWorks.forEach(work => {
      recommendations.push({
        id: work.id,
        type: 'work',
        title: work.title,
        excerpt: createExcerpt(work.description),
        relevanceScore: 0.9,
        metadata: {
          year: work.year,
          location: work.location,
          category: work.category.name
        },
        reason: '精选建筑作品'
      });
    });
  }

  // Featured scholars
  if (includeTypes.includes('scholar')) {
    const featuredScholars = scholars
      .filter(s => !excludeIds.includes(s.id))
      .sort((a, b) => b.publications.length - a.publications.length) // Most publications first
      .slice(0, 3);

    featuredScholars.forEach(scholar => {
      recommendations.push({
        id: scholar.id,
        type: 'scholar',
        title: scholar.name,
        excerpt: `${scholar.institution} - ${createExcerpt(scholar.biography, 100)}`,
        relevanceScore: 0.8,
        metadata: {
          institution: scholar.institution,
          region: scholar.region,
          specialization: scholar.specialization
        },
        reason: '知名研究学者'
      });
    });
  }

  // Featured biography content
  if (includeTypes.includes('biography')) {
    recommendations.push({
      id: 'biography-overview',
      type: 'biography',
      title: '让·普鲁维传记',
      excerpt: '了解这位现代建筑先驱的生平、哲学理念和创新成就',
      relevanceScore: 0.7,
      metadata: {
        section: 'overview',
        birthYear: 1901,
        deathYear: 1984
      },
      reason: '传记精华内容'
    });

    // Add a key philosophy statement
    const keyPhilosophy = biographyContent.philosophy[0];
    if (keyPhilosophy) {
      recommendations.push({
        id: 'biography-philosophy-0',
        type: 'biography',
        title: keyPhilosophy.theme,
        excerpt: createExcerpt(keyPhilosophy.content),
        relevanceScore: 0.6,
        metadata: {
          section: 'philosophy',
          year: keyPhilosophy.year,
          source: keyPhilosophy.source
        },
        reason: '核心设计理念'
      });
    }

    // Add a key collaboration
    const keyCollaboration = biographyContent.collaborations[0];
    if (keyCollaboration) {
      recommendations.push({
        id: 'biography-collaboration-0',
        type: 'biography',
        title: `合作：${keyCollaboration.project}`,
        excerpt: `与${keyCollaboration.collaborator}的重要合作项目`,
        relevanceScore: 0.5,
        metadata: {
          section: 'collaboration',
          period: keyCollaboration.period,
          collaborator: keyCollaboration.collaborator
        },
        reason: '重要合作项目'
      });
    }
  }

  return recommendations
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults);
}

/**
 * Calculate similarity between two works
 */
function calculateWorkSimilarity(work1: ArchitecturalWork, work2: ArchitecturalWork): number {
  let similarity = 0;

  // Same category gets high score
  if (work1.category.id === work2.category.id) {
    similarity += 0.4;
  }

  // Similar year gets medium score
  const yearDiff = Math.abs(work1.year - work2.year);
  if (yearDiff <= 5) {
    similarity += 0.3 * (1 - yearDiff / 5);
  }

  // Same location gets medium score
  if (work1.location === work2.location) {
    similarity += 0.2;
  }

  // Similar status gets low score
  if (work1.status === work2.status) {
    similarity += 0.1;
  }

  return Math.min(similarity, 1.0);
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
 * Get trending or popular content (mock implementation)
 */
export function getTrendingContent(options: RecommendationOptions = {}): RecommendationItem[] {
  // In a real implementation, this would use analytics data
  // For now, we'll return some featured content
  return getGeneralRecommendations(options);
}

/**
 * Get content recommendations based on user's viewing history (mock implementation)
 */
export function getPersonalizedRecommendations(
  viewHistory: string[],
  options: RecommendationOptions = {}
): RecommendationItem[] {
  // In a real implementation, this would analyze user behavior
  // For now, we'll return general recommendations excluding viewed items
  return getGeneralRecommendations({
    ...options,
    excludeIds: viewHistory
  });
}