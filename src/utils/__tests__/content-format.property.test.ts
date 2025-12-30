/**
 * Property-based tests for content format consistency
 * Feature: jean-prouve-website, Property 10: Content format consistency
 * Validates: Requirements 7.5
 */

import * as fc from 'fast-check';
import { 
  performGlobalSearch, 
  getGlobalSearchFilters,
  getSearchSuggestions 
} from '../search';
import { 
  getWorkRecommendations,
  getScholarRecommendations,
  getBiographyRecommendations,
  getGeneralRecommendations
} from '../recommendations';
import { getAllWorks } from '@/data/works';
import { scholars } from '@/data/scholars';
import { biographyContent } from '@/data/biography';
import { SearchQuery, SearchResult, RecommendationItem } from '@/types';

describe('Content Format Consistency Properties', () => {
  /**
   * Property 10: Content format consistency
   * For any content type, the system should maintain consistent format and display standards
   * Validates: Requirements 7.5
   */
  
  describe('Search Results Format Consistency', () => {
    const searchQueryArbitrary = fc.record({
      term: fc.string({ minLength: 0, maxLength: 50 }),
      filters: fc.record({
        type: fc.option(fc.array(fc.constantFrom('work', 'scholar', 'biography', 'publication'), { minLength: 1, maxLength: 4 })),
        category: fc.option(fc.array(fc.constantFrom('residential', 'industrial', 'educational', 'experimental'), { minLength: 1, maxLength: 4 })),
        region: fc.option(fc.array(fc.constantFrom('europe', 'northAmerica', 'asia', 'africa', 'oceania', 'southAmerica'), { minLength: 1, maxLength: 6 })),
        year: fc.option(fc.tuple(fc.integer({ min: 1900, max: 2024 }), fc.integer({ min: 1900, max: 2024 })).map(([a, b]) => [Math.min(a, b), Math.max(a, b)] as [number, number]))
      }),
      sortBy: fc.constantFrom('relevance', 'year', 'title', 'author')
    });

    test('all search results have consistent required fields', () => {
      fc.assert(fc.property(searchQueryArbitrary, (query) => {
        const results = performGlobalSearch(query);
        
        // Every search result must have consistent structure
        results.forEach(result => {
          // Required fields must exist and be of correct type
          expect(typeof result.id).toBe('string');
          expect(result.id.length).toBeGreaterThan(0);
          
          expect(['work', 'scholar', 'biography', 'publication']).toContain(result.type);
          
          expect(typeof result.title).toBe('string');
          expect(result.title.length).toBeGreaterThan(0);
          
          expect(typeof result.excerpt).toBe('string');
          expect(result.excerpt.length).toBeGreaterThan(0);
          
          expect(typeof result.relevanceScore).toBe('number');
          expect(result.relevanceScore).toBeGreaterThanOrEqual(0);
          expect(result.relevanceScore).toBeLessThanOrEqual(1);
          
          expect(typeof result.metadata).toBe('object');
          expect(result.metadata).not.toBeNull();
        });
      }), { numRuns: 100 });
    });

    test('search results maintain consistent excerpt length format', () => {
      fc.assert(fc.property(searchQueryArbitrary, (query) => {
        const results = performGlobalSearch(query);
        
        results.forEach(result => {
          // Excerpts should be reasonably sized (not too short or too long)
          expect(result.excerpt.length).toBeGreaterThan(10);
          expect(result.excerpt.length).toBeLessThan(500);
          
          // Excerpts should end properly (either with ellipsis or complete sentence)
          const endsWithEllipsis = result.excerpt.endsWith('...');
          const endsWithPunctuation = /[.!?。！？]$/.test(result.excerpt);
          expect(endsWithEllipsis || endsWithPunctuation).toBe(true);
        });
      }), { numRuns: 100 });
    });

    test('search results metadata follows type-specific format standards', () => {
      fc.assert(fc.property(searchQueryArbitrary, (query) => {
        const results = performGlobalSearch(query);
        
        results.forEach(result => {
          switch (result.type) {
            case 'work':
              // Work results should have architectural work metadata
              if (result.metadata.year) {
                expect(typeof result.metadata.year).toBe('number');
                expect(result.metadata.year).toBeGreaterThan(1900);
                expect(result.metadata.year).toBeLessThan(2025);
              }
              if (result.metadata.location) {
                expect(typeof result.metadata.location).toBe('string');
                expect(result.metadata.location.length).toBeGreaterThan(0);
              }
              if (result.metadata.category) {
                expect(typeof result.metadata.category).toBe('string');
                expect(['residential', 'industrial', 'educational', 'experimental', 'furniture']).toContain(result.metadata.category);
              }
              break;
              
            case 'scholar':
              // Scholar results should have academic metadata
              if (result.metadata.institution) {
                expect(typeof result.metadata.institution).toBe('string');
                expect(result.metadata.institution.length).toBeGreaterThan(0);
              }
              if (result.metadata.region) {
                expect(typeof result.metadata.region).toBe('string');
                expect(['europe', 'northAmerica', 'asia', 'africa', 'oceania', 'southAmerica']).toContain(result.metadata.region);
              }
              if (result.metadata.specialization) {
                expect(Array.isArray(result.metadata.specialization)).toBe(true);
              }
              break;
              
            case 'biography':
              // Biography results should have biographical metadata
              if (result.metadata.section) {
                expect(typeof result.metadata.section).toBe('string');
                expect(['personal', 'career', 'philosophy', 'collaboration', 'timeline', 'overview']).toContain(result.metadata.section);
              }
              if (result.metadata.year || result.metadata.birthYear) {
                const year = result.metadata.year || result.metadata.birthYear;
                expect(typeof year).toBe('number');
                expect(year).toBeGreaterThan(1900);
                expect(year).toBeLessThan(2025);
              }
              break;
          }
        });
      }), { numRuns: 100 });
    });
  });

  describe('Recommendation Format Consistency', () => {
    const workIdArbitrary = fc.constantFrom(...getAllWorks().map(w => w.id));
    const scholarIdArbitrary = fc.constantFrom(...scholars.map(s => s.id));
    const biographySectionArbitrary = fc.constantFrom('overview', 'career', 'philosophy', 'collaboration');

    test('work recommendations maintain consistent format', () => {
      fc.assert(fc.property(workIdArbitrary, (workId) => {
        const recommendations = getWorkRecommendations(workId, { maxResults: 10 });
        
        recommendations.forEach(rec => {
          // Check consistent RecommendationItem structure
          expect(typeof rec.id).toBe('string');
          expect(rec.id.length).toBeGreaterThan(0);
          
          expect(['work', 'scholar', 'biography']).toContain(rec.type);
          
          expect(typeof rec.title).toBe('string');
          expect(rec.title.length).toBeGreaterThan(0);
          
          expect(typeof rec.excerpt).toBe('string');
          expect(rec.excerpt.length).toBeGreaterThan(10);
          expect(rec.excerpt.length).toBeLessThan(300);
          
          expect(typeof rec.relevanceScore).toBe('number');
          expect(rec.relevanceScore).toBeGreaterThanOrEqual(0);
          expect(rec.relevanceScore).toBeLessThanOrEqual(1);
          
          expect(typeof rec.reason).toBe('string');
          expect(rec.reason.length).toBeGreaterThan(0);
          
          expect(typeof rec.metadata).toBe('object');
          expect(rec.metadata).not.toBeNull();
        });
      }), { numRuns: 50 });
    });

    test('scholar recommendations maintain consistent format', () => {
      fc.assert(fc.property(scholarIdArbitrary, (scholarId) => {
        const recommendations = getScholarRecommendations(scholarId, { maxResults: 10 });
        
        recommendations.forEach(rec => {
          // Check consistent RecommendationItem structure
          expect(typeof rec.id).toBe('string');
          expect(rec.id.length).toBeGreaterThan(0);
          
          expect(['work', 'scholar', 'biography']).toContain(rec.type);
          
          expect(typeof rec.title).toBe('string');
          expect(rec.title.length).toBeGreaterThan(0);
          
          expect(typeof rec.excerpt).toBe('string');
          expect(rec.excerpt.length).toBeGreaterThan(10);
          expect(rec.excerpt.length).toBeLessThan(300);
          
          expect(typeof rec.relevanceScore).toBe('number');
          expect(rec.relevanceScore).toBeGreaterThanOrEqual(0);
          expect(rec.relevanceScore).toBeLessThanOrEqual(1);
          
          expect(typeof rec.reason).toBe('string');
          expect(rec.reason.length).toBeGreaterThan(0);
        });
      }), { numRuns: 50 });
    });

    test('biography recommendations maintain consistent format', () => {
      fc.assert(fc.property(biographySectionArbitrary, (section) => {
        const recommendations = getBiographyRecommendations(section, { maxResults: 10 });
        
        recommendations.forEach(rec => {
          // Check consistent RecommendationItem structure
          expect(typeof rec.id).toBe('string');
          expect(rec.id.length).toBeGreaterThan(0);
          
          expect(['work', 'scholar', 'biography']).toContain(rec.type);
          
          expect(typeof rec.title).toBe('string');
          expect(rec.title.length).toBeGreaterThan(0);
          
          expect(typeof rec.excerpt).toBe('string');
          expect(rec.excerpt.length).toBeGreaterThan(10);
          expect(rec.excerpt.length).toBeLessThan(300);
          
          expect(typeof rec.relevanceScore).toBe('number');
          expect(rec.relevanceScore).toBeGreaterThanOrEqual(0);
          expect(rec.relevanceScore).toBeLessThanOrEqual(1);
          
          expect(typeof rec.reason).toBe('string');
          expect(rec.reason.length).toBeGreaterThan(0);
        });
      }), { numRuns: 50 });
    });

    test('general recommendations maintain consistent format', () => {
      fc.assert(fc.property(fc.constant(null), () => {
        const recommendations = getGeneralRecommendations({ maxResults: 15 });
        
        recommendations.forEach(rec => {
          // Check consistent RecommendationItem structure
          expect(typeof rec.id).toBe('string');
          expect(rec.id.length).toBeGreaterThan(0);
          
          expect(['work', 'scholar', 'biography']).toContain(rec.type);
          
          expect(typeof rec.title).toBe('string');
          expect(rec.title.length).toBeGreaterThan(0);
          
          expect(typeof rec.excerpt).toBe('string');
          expect(rec.excerpt.length).toBeGreaterThan(10);
          expect(rec.excerpt.length).toBeLessThan(300);
          
          expect(typeof rec.relevanceScore).toBe('number');
          expect(rec.relevanceScore).toBeGreaterThanOrEqual(0);
          expect(rec.relevanceScore).toBeLessThanOrEqual(1);
          
          expect(typeof rec.reason).toBe('string');
          expect(rec.reason.length).toBeGreaterThan(0);
        });
      }), { numRuns: 20 });
    });
  });

  describe('Search Suggestions Format Consistency', () => {
    const partialQueryArbitrary = fc.string({ minLength: 2, maxLength: 20 });

    test('search suggestions maintain consistent format', () => {
      fc.assert(fc.property(partialQueryArbitrary, (partialQuery) => {
        const suggestions = getSearchSuggestions(partialQuery);
        
        // All suggestions should be non-empty strings
        suggestions.forEach(suggestion => {
          expect(typeof suggestion).toBe('string');
          expect(suggestion.length).toBeGreaterThan(0);
          expect(suggestion.length).toBeLessThan(100); // Reasonable max length
          
          // Suggestions should contain the partial query (case insensitive)
          expect(suggestion.toLowerCase()).toContain(partialQuery.toLowerCase());
        });
        
        // Should not exceed maximum suggestions limit
        expect(suggestions.length).toBeLessThanOrEqual(8);
        
        // Should not have duplicates
        const uniqueSuggestions = new Set(suggestions);
        expect(uniqueSuggestions.size).toBe(suggestions.length);
      }), { numRuns: 100 });
    });
  });

  describe('Filter Options Format Consistency', () => {
    test('global search filters maintain consistent format', () => {
      const filterOptions = getGlobalSearchFilters();
      
      // Types array format
      expect(Array.isArray(filterOptions.types)).toBe(true);
      filterOptions.types.forEach(type => {
        expect(typeof type.id).toBe('string');
        expect(type.id.length).toBeGreaterThan(0);
        expect(typeof type.name).toBe('string');
        expect(type.name.length).toBeGreaterThan(0);
        expect(typeof type.count).toBe('number');
        expect(type.count).toBeGreaterThanOrEqual(0);
      });
      
      // Categories array format
      expect(Array.isArray(filterOptions.categories)).toBe(true);
      filterOptions.categories.forEach(category => {
        expect(typeof category.id).toBe('string');
        expect(category.id.length).toBeGreaterThan(0);
        expect(typeof category.name).toBe('string');
        expect(category.name.length).toBeGreaterThan(0);
        expect(typeof category.count).toBe('number');
        expect(category.count).toBeGreaterThanOrEqual(0);
      });
      
      // Regions array format
      expect(Array.isArray(filterOptions.regions)).toBe(true);
      filterOptions.regions.forEach(region => {
        expect(typeof region.id).toBe('string');
        expect(region.id.length).toBeGreaterThan(0);
        expect(typeof region.name).toBe('string');
        expect(region.name.length).toBeGreaterThan(0);
        expect(typeof region.count).toBe('number');
        expect(region.count).toBeGreaterThanOrEqual(0);
      });
      
      // Year range format
      expect(Array.isArray(filterOptions.yearRange)).toBe(true);
      expect(filterOptions.yearRange.length).toBe(2);
      expect(typeof filterOptions.yearRange[0]).toBe('number');
      expect(typeof filterOptions.yearRange[1]).toBe('number');
      expect(filterOptions.yearRange[0]).toBeLessThanOrEqual(filterOptions.yearRange[1]);
      expect(filterOptions.yearRange[0]).toBeGreaterThan(1900);
      expect(filterOptions.yearRange[1]).toBeLessThan(2025);
    });
  });

  describe('Content Data Format Consistency', () => {
    test('architectural works maintain consistent data format', () => {
      const works = getAllWorks();
      
      works.forEach(work => {
        // Required fields
        expect(typeof work.id).toBe('string');
        expect(work.id.length).toBeGreaterThan(0);
        
        expect(typeof work.title).toBe('string');
        expect(work.title.length).toBeGreaterThan(0);
        
        expect(typeof work.year).toBe('number');
        expect(work.year).toBeGreaterThan(1900);
        expect(work.year).toBeLessThan(2025);
        
        expect(typeof work.location).toBe('string');
        expect(work.location.length).toBeGreaterThan(0);
        
        expect(typeof work.description).toBe('string');
        expect(work.description.length).toBeGreaterThan(10);
        
        expect(['existing', 'demolished', 'reconstructed']).toContain(work.status);
        
        // Category format
        expect(typeof work.category).toBe('object');
        expect(typeof work.category.id).toBe('string');
        expect(typeof work.category.name).toBe('string');
        expect(typeof work.category.description).toBe('string');
        
        // Arrays format
        expect(Array.isArray(work.images)).toBe(true);
        expect(Array.isArray(work.technicalDrawings)).toBe(true);
        expect(Array.isArray(work.specifications)).toBe(true);
        
        // Images format
        work.images.forEach(image => {
          expect(typeof image.id).toBe('string');
          expect(typeof image.src).toBe('string');
          expect(typeof image.alt).toBe('string');
          expect(typeof image.width).toBe('number');
          expect(typeof image.height).toBe('number');
          expect(image.width).toBeGreaterThan(0);
          expect(image.height).toBeGreaterThan(0);
        });
        
        // Specifications format
        work.specifications.forEach(spec => {
          expect(typeof spec.property).toBe('string');
          expect(spec.property.length).toBeGreaterThan(0);
          expect(typeof spec.value).toBe('string');
          expect(spec.value.length).toBeGreaterThan(0);
        });
      });
    });

    test('scholars maintain consistent data format', () => {
      scholars.forEach(scholar => {
        // Required fields
        expect(typeof scholar.id).toBe('string');
        expect(scholar.id.length).toBeGreaterThan(0);
        
        expect(typeof scholar.name).toBe('string');
        expect(scholar.name.length).toBeGreaterThan(0);
        
        expect(typeof scholar.institution).toBe('string');
        expect(scholar.institution.length).toBeGreaterThan(0);
        
        expect(typeof scholar.country).toBe('string');
        expect(scholar.country.length).toBeGreaterThan(0);
        
        expect(typeof scholar.region).toBe('string');
        expect(['europe', 'northAmerica', 'asia', 'africa', 'oceania', 'southAmerica']).toContain(scholar.region);
        
        expect(typeof scholar.biography).toBe('string');
        expect(scholar.biography.length).toBeGreaterThan(10);
        
        // Arrays format
        expect(Array.isArray(scholar.specialization)).toBe(true);
        expect(scholar.specialization.length).toBeGreaterThan(0);
        expect(Array.isArray(scholar.publications)).toBe(true);
        expect(Array.isArray(scholar.exhibitions)).toBe(true);
        
        // Publications format
        scholar.publications.forEach(pub => {
          expect(typeof pub.id).toBe('string');
          expect(typeof pub.title).toBe('string');
          expect(pub.title.length).toBeGreaterThan(0);
          expect(['book', 'article', 'thesis', 'conference']).toContain(pub.type);
          expect(typeof pub.year).toBe('number');
          expect(pub.year).toBeGreaterThan(1950);
          expect(pub.year).toBeLessThan(2025);
          expect(typeof pub.abstract).toBe('string');
          expect(pub.abstract.length).toBeGreaterThan(10);
          expect(Array.isArray(pub.keywords)).toBe(true);
        });
        
        // Contact format
        expect(typeof scholar.contact).toBe('object');
        if (scholar.contact.email) {
          expect(typeof scholar.contact.email).toBe('string');
          expect(scholar.contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        }
        if (scholar.contact.website) {
          expect(typeof scholar.contact.website).toBe('string');
          expect(scholar.contact.website).toMatch(/^https?:\/\/.+/);
        }
      });
    });

    test('biography content maintains consistent data format', () => {
      // Personal info format
      expect(typeof biographyContent.personalInfo).toBe('object');
      expect(typeof biographyContent.personalInfo.fullName).toBe('string');
      expect(biographyContent.personalInfo.fullName.length).toBeGreaterThan(0);
      expect(typeof biographyContent.personalInfo.birthDate).toBe('string');
      expect(typeof biographyContent.personalInfo.deathDate).toBe('string');
      expect(typeof biographyContent.personalInfo.birthPlace).toBe('string');
      expect(typeof biographyContent.personalInfo.nationality).toBe('string');
      expect(Array.isArray(biographyContent.personalInfo.family)).toBe(true);
      
      // Arrays format
      expect(Array.isArray(biographyContent.education)).toBe(true);
      expect(Array.isArray(biographyContent.career)).toBe(true);
      expect(Array.isArray(biographyContent.philosophy)).toBe(true);
      expect(Array.isArray(biographyContent.collaborations)).toBe(true);
      expect(Array.isArray(biographyContent.legacy)).toBe(true);
      
      // Career format
      biographyContent.career.forEach(career => {
        expect(typeof career.position).toBe('string');
        expect(career.position.length).toBeGreaterThan(0);
        expect(typeof career.organization).toBe('string');
        expect(career.organization.length).toBeGreaterThan(0);
        expect(typeof career.period).toBe('string');
        expect(career.period.length).toBeGreaterThan(0);
        expect(typeof career.location).toBe('string');
        expect(Array.isArray(career.achievements)).toBe(true);
      });
      
      // Philosophy format
      biographyContent.philosophy.forEach(philosophy => {
        expect(typeof philosophy.theme).toBe('string');
        expect(philosophy.theme.length).toBeGreaterThan(0);
        expect(typeof philosophy.content).toBe('string');
        expect(philosophy.content.length).toBeGreaterThan(10);
      });
    });
  });
});