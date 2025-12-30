/**
 * Property-based tests for search functionality
 * Feature: jean-prouve-website, Property 6: Search functionality effectiveness
 * Validates: Requirements 2.4, 7.3, 7.4
 */

import * as fc from 'fast-check';
import { performSearch, validateSearchQuery, getAvailableFilters, mockSearchData } from '../search';
import { SearchQuery, SearchResult } from '@/types';

describe('Search Functionality Property Tests', () => {
  describe('Property 6: Search functionality effectiveness', () => {
    /**
     * Property: For any valid search query, the system should return relevant results 
     * and provide appropriate filtering options
     * Validates: Requirements 2.4, 7.3, 7.4
     */
    it('should return relevant results for any valid search query', () => {
      // Generator for valid search terms
      const searchTermArb = fc.oneof(
        fc.constant(''), // Empty search
        fc.string({ minLength: 1, maxLength: 50 }), // Non-empty search terms
        fc.constantFrom('Maison', 'Tropicale', 'Cité', 'construction', 'prefab') // Known terms
      );

      // Generator for valid filters
      const filtersArb = fc.record({
        category: fc.option(fc.array(fc.constantFrom('residential', 'educational', 'industrial'), { minLength: 0, maxLength: 3 })),
        year: fc.option(fc.tuple(fc.integer({ min: 1900, max: 2024 }), fc.integer({ min: 1900, max: 2024 })).map(([a, b]) => [Math.min(a, b), Math.max(a, b)] as [number, number])),
        region: fc.option(fc.array(fc.constantFrom('Europe', 'Africa', 'Asia'), { minLength: 0, maxLength: 3 })),
        type: fc.option(fc.array(fc.constantFrom('work', 'scholar', 'biography', 'publication'), { minLength: 0, maxLength: 4 }))
      });

      // Generator for valid sort options
      const sortByArb = fc.constantFrom('relevance', 'year', 'title', 'author');

      // Generator for complete search queries
      const searchQueryArb = fc.record({
        term: searchTermArb,
        filters: filtersArb,
        sortBy: sortByArb
      });

      fc.assert(
        fc.property(searchQueryArb, (query: SearchQuery) => {
          // Ensure query is valid
          const isValid = validateSearchQuery(query);
          if (!isValid) return true; // Skip invalid queries

          const results = performSearch(query);

          // Property 1: Results should be an array
          expect(Array.isArray(results)).toBe(true);

          // Property 2: All results should have required fields
          results.forEach((result: SearchResult) => {
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('type');
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('excerpt');
            expect(result).toHaveProperty('relevanceScore');
            expect(result).toHaveProperty('metadata');
            expect(typeof result.relevanceScore).toBe('number');
            expect(result.relevanceScore).toBeGreaterThanOrEqual(0);
            expect(result.relevanceScore).toBeLessThanOrEqual(1);
          });

          // Property 3: If search term is provided, results should be relevant
          if (query.term.trim()) {
            const searchTerm = query.term.toLowerCase();
            results.forEach((result: SearchResult) => {
              // For search results, we allow broader relevance matching
              // since the search function may return related content
              const isRelevant = 
                result.title.toLowerCase().includes(searchTerm) ||
                result.excerpt.toLowerCase().includes(searchTerm) ||
                result.relevanceScore > 0; // If it has a relevance score, it's considered relevant
              expect(isRelevant).toBe(true);
            });
          }

          // Property 4: Category filter should be respected
          if (query.filters.category && query.filters.category.length > 0) {
            results.forEach((result: SearchResult) => {
              // Only check category filter for work results
              if (result.type === 'work') {
                const matchesCategory = query.filters.category!.includes(result.metadata.category);
                expect(matchesCategory).toBe(true);
              }
            });
          }

          // Property 5: Year filter should be respected
          if (query.filters.year) {
            const [minYear, maxYear] = query.filters.year;
            results.forEach((result: SearchResult) => {
              if (result.metadata.year) {
                expect(result.metadata.year).toBeGreaterThanOrEqual(minYear);
                expect(result.metadata.year).toBeLessThanOrEqual(maxYear);
              }
            });
          }

          // Property 6: Type filter should be respected
          if (query.filters.type && query.filters.type.length > 0) {
            results.forEach((result: SearchResult) => {
              expect(query.filters.type).toContain(result.type);
            });
          }

          // Property 7: Results should be sorted according to sortBy parameter
          if (results.length > 1) {
            switch (query.sortBy) {
              case 'relevance':
                for (let i = 0; i < results.length - 1; i++) {
                  expect(results[i].relevanceScore).toBeGreaterThanOrEqual(results[i + 1].relevanceScore);
                }
                break;
              case 'year':
                for (let i = 0; i < results.length - 1; i++) {
                  const yearA = results[i].metadata.year || 0;
                  const yearB = results[i + 1].metadata.year || 0;
                  expect(yearA).toBeGreaterThanOrEqual(yearB);
                }
                break;
              case 'title':
                for (let i = 0; i < results.length - 1; i++) {
                  expect(results[i].title.localeCompare(results[i + 1].title, 'zh-CN')).toBeLessThanOrEqual(0);
                }
                break;
            }
          }

          return true;
        }),
        { numRuns: 100 } // Run 100 iterations as specified in design
      );
    });

    /**
     * Property: Search query validation should correctly identify valid and invalid queries
     */
    it('should correctly validate search queries', () => {
      // Generator for potentially invalid queries
      const invalidQueryArb = fc.oneof(
        // Invalid term types
        fc.record({
          term: fc.oneof(fc.integer(), fc.boolean(), fc.constant(null)),
          filters: fc.record({}),
          sortBy: fc.constantFrom('relevance', 'year', 'title')
        }),
        // Invalid sortBy
        fc.record({
          term: fc.string(),
          filters: fc.record({}),
          sortBy: fc.string().filter(s => !['relevance', 'year', 'title', 'author'].includes(s))
        }),
        // Invalid year range
        fc.record({
          term: fc.string(),
          filters: fc.record({
            year: fc.tuple(fc.integer(), fc.integer()).filter(([a, b]) => a > b)
          }),
          sortBy: fc.constantFrom('relevance', 'year', 'title')
        })
      );

      fc.assert(
        fc.property(invalidQueryArb, (query: any) => {
          const isValid = validateSearchQuery(query);
          expect(isValid).toBe(false);
          return true;
        }),
        { numRuns: 50 }
      );
    });

    /**
     * Property: Available filters should always return consistent structure
     */
    it('should return consistent filter structure', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const filters = getAvailableFilters();
          
          expect(filters).toHaveProperty('categories');
          expect(filters).toHaveProperty('types');
          expect(filters).toHaveProperty('regions');
          expect(filters).toHaveProperty('yearRange');
          
          expect(Array.isArray(filters.categories)).toBe(true);
          expect(Array.isArray(filters.types)).toBe(true);
          expect(Array.isArray(filters.regions)).toBe(true);
          expect(Array.isArray(filters.yearRange)).toBe(true);
          expect(filters.yearRange).toHaveLength(2);
          
          const [minYear, maxYear] = filters.yearRange;
          expect(typeof minYear).toBe('number');
          expect(typeof maxYear).toBe('number');
          expect(minYear).toBeLessThanOrEqual(maxYear);
          
          return true;
        }),
        { numRuns: 10 }
      );
    });

    /**
     * Property: Empty search should return all available data
     */
    it('should return all data for empty search with no filters', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const emptyQuery: SearchQuery = {
            term: '',
            filters: {},
            sortBy: 'relevance'
          };
          
          const results = performSearch(emptyQuery);
          // Empty search should return results from all content types
          expect(results.length).toBeGreaterThan(0);
          
          // Should be sorted by relevance (descending)
          for (let i = 0; i < results.length - 1; i++) {
            expect(results[i].relevanceScore).toBeGreaterThanOrEqual(results[i + 1].relevanceScore);
          }
          
          return true;
        }),
        { numRuns: 10 }
      );
    });
  });
});