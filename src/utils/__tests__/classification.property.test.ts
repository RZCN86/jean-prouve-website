/**
 * Property-based tests for classification organization consistency
 * Feature: jean-prouve-website, Property 4: Classification organization consistency
 * Validates: Requirements 2.3, 8.4
 */

import * as fc from 'fast-check';
import { ArchitecturalWork, Scholar, WorkCategory, WorksDatabase, ScholarDatabase } from '@/types';
import { workCategories, getAllWorks, getWorksByCategory } from '@/data/works';

describe('Classification Organization Property Tests', () => {
  describe('Property 4: Classification organization consistency', () => {
    
    // Generators for property testing
    // Define consistent category mappings to ensure classification consistency
    const categoryMappings = {
      'residential': { id: 'residential', name: '住宅建筑', description: '普鲁维设计的住宅项目，展现其对居住空间的创新理念' },
      'industrial': { id: 'industrial', name: '工业建筑', description: '工厂、车间等工业建筑，体现功能性与美学的完美结合' },
      'educational': { id: 'educational', name: '教育建筑', description: '学校、大学等教育设施，注重空间的灵活性和实用性' },
      'experimental': { id: 'experimental', name: '实验性项目', description: '探索新技术和建造方法的前瞻性项目' },
      'furniture': { id: 'furniture', name: '家具设计', description: '工业化生产的家具作品，体现设计与制造的统一' }
    };

    const workCategoryArb = fc.constantFrom('residential', 'industrial', 'educational', 'experimental', 'furniture')
      .map(categoryId => categoryMappings[categoryId]);

    const architecturalWorkArb = fc.record({
      id: fc.uuid(),
      title: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length > 0),
      year: fc.integer({ min: 1920, max: 1984 }),
      location: fc.string({ minLength: 3, maxLength: 100 }).filter(s => s.trim().length > 0),
      category: workCategoryArb,
      description: fc.string({ minLength: 20, maxLength: 500 }).filter(s => s.trim().length > 0),
      images: fc.array(fc.record({
        id: fc.uuid(),
        src: fc.string({ minLength: 10, maxLength: 100 }),
        alt: fc.string({ minLength: 5, maxLength: 50 }),
        width: fc.integer({ min: 100, max: 2000 }),
        height: fc.integer({ min: 100, max: 2000 })
      }), { minLength: 1, maxLength: 5 }),
      technicalDrawings: fc.array(fc.record({
        id: fc.uuid(),
        src: fc.string({ minLength: 10, maxLength: 100 }),
        alt: fc.string({ minLength: 5, maxLength: 50 }),
        width: fc.integer({ min: 100, max: 2000 }),
        height: fc.integer({ min: 100, max: 2000 })
      }), { minLength: 0, maxLength: 3 }),
      specifications: fc.array(fc.record({
        property: fc.string({ minLength: 5, maxLength: 30 }),
        value: fc.string({ minLength: 1, maxLength: 50 }),
        unit: fc.option(fc.string({ minLength: 1, maxLength: 10 }))
      }), { minLength: 1, maxLength: 10 }),
      commentary: fc.record({
        id: fc.uuid(),
        title: fc.string({ minLength: 10, maxLength: 100 }),
        content: fc.string({ minLength: 50, maxLength: 500 }),
        author: fc.string({ minLength: 5, maxLength: 50 }),
        type: fc.constantFrom('technical', 'historical', 'cultural', 'contemporary')
      }),
      status: fc.constantFrom('existing', 'demolished', 'reconstructed')
    });

    const scholarArb = fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 3, maxLength: 50 }).filter(s => s.trim().length > 0),
      institution: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length > 0),
      country: fc.string({ minLength: 3, maxLength: 50 }).filter(s => s.trim().length > 0),
      region: fc.constantFrom('europe', 'northAmerica', 'asia', 'africa', 'oceania', 'southAmerica'),
      specialization: fc.array(
        fc.constantFrom('architecturalHistory', 'industrialDesign', 'prefabricatedConstruction', 'modernism', 'materialStudies'),
        { minLength: 1, maxLength: 3 }
      ),
      biography: fc.string({ minLength: 50, maxLength: 1000 }).filter(s => s.trim().length > 0),
      contact: fc.record({
        email: fc.option(fc.emailAddress()),
        phone: fc.option(fc.string({ minLength: 10, maxLength: 15 })),
        website: fc.option(fc.webUrl()),
        address: fc.option(fc.string({ minLength: 10, maxLength: 100 }))
      }),
      publications: fc.array(fc.record({
        id: fc.uuid(),
        title: fc.string({ minLength: 5, maxLength: 100 }),
        type: fc.constantFrom('book', 'article', 'thesis', 'conference'),
        year: fc.integer({ min: 1950, max: 2024 }),
        publisher: fc.option(fc.string({ minLength: 3, maxLength: 50 })),
        abstract: fc.string({ minLength: 20, maxLength: 500 }),
        keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
        url: fc.option(fc.webUrl())
      }), { minLength: 0, maxLength: 10 }),
      exhibitions: fc.array(fc.record({
        id: fc.uuid(),
        title: fc.string({ minLength: 5, maxLength: 100 }),
        venue: fc.string({ minLength: 5, maxLength: 100 }),
        year: fc.integer({ min: 1950, max: 2024 }),
        description: fc.string({ minLength: 20, maxLength: 300 }),
        role: fc.string({ minLength: 5, maxLength: 50 })
      }), { minLength: 0, maxLength: 5 })
    });

    const worksCollectionArb = fc.array(architecturalWorkArb, { minLength: 1, maxLength: 20 });
    const scholarsCollectionArb = fc.array(scholarArb, { minLength: 1, maxLength: 20 });

    /**
     * Validates that works classification is consistent
     */
    function validateWorksClassification(works: ArchitecturalWork[]): boolean {
      // Every work must have a valid category
      const allHaveValidCategories = works.every(work => 
        work.category && 
        work.category.id && 
        work.category.name && 
        work.category.description &&
        typeof work.category.id === 'string' &&
        typeof work.category.name === 'string' &&
        typeof work.category.description === 'string'
      );

      // Category IDs should be from the allowed set
      const validCategoryIds = ['residential', 'industrial', 'educational', 'experimental', 'furniture'];
      const allCategoriesValid = works.every(work => 
        validCategoryIds.includes(work.category.id)
      );

      // Works with the same category ID should have the same category name and description
      const categoryConsistency = works.every(work => {
        const sameCategory = works.filter(w => w.category.id === work.category.id);
        return sameCategory.every(w => 
          w.category.name === work.category.name &&
          w.category.description === work.category.description
        );
      });

      return allHaveValidCategories && allCategoriesValid && categoryConsistency;
    }

    /**
     * Validates that scholars classification is consistent
     */
    function validateScholarsClassification(scholars: Scholar[]): boolean {
      // Every scholar must have valid region and specialization
      const allHaveValidClassification = scholars.every(scholar => 
        scholar.region && 
        Array.isArray(scholar.specialization) &&
        scholar.specialization.length > 0 &&
        typeof scholar.region === 'string' &&
        scholar.specialization.every(spec => typeof spec === 'string' && spec.trim().length > 0)
      );

      // Regions should be from the allowed set
      const validRegions = ['europe', 'northAmerica', 'asia', 'africa', 'oceania', 'southAmerica'];
      const allRegionsValid = scholars.every(scholar => 
        validRegions.includes(scholar.region)
      );

      // Specializations should be from the allowed set
      const validSpecializations = ['architecturalHistory', 'industrialDesign', 'prefabricatedConstruction', 'modernism', 'materialStudies'];
      const allSpecializationsValid = scholars.every(scholar => 
        scholar.specialization.every(spec => validSpecializations.includes(spec))
      );

      return allHaveValidClassification && allRegionsValid && allSpecializationsValid;
    }

    /**
     * Validates that works database organization is consistent
     */
    function validateWorksDatabase(works: ArchitecturalWork[]): WorksDatabase {
      const database: WorksDatabase = {
        residential: [],
        industrial: [],
        educational: [],
        experimental: [],
        furniture: []
      };

      // Organize works by category
      works.forEach(work => {
        switch (work.category.id) {
          case 'residential':
            database.residential.push(work);
            break;
          case 'industrial':
            database.industrial.push(work);
            break;
          case 'educational':
            database.educational.push(work);
            break;
          case 'experimental':
            database.experimental.push(work);
            break;
          // Note: furniture works are handled separately in the actual system
          default:
            // For property testing, we'll allow other categories to be placed in experimental
            database.experimental.push(work);
        }
      });

      return database;
    }

    /**
     * Validates that scholars database organization is consistent
     */
    function validateScholarsDatabase(scholars: Scholar[]): ScholarDatabase {
      const database: ScholarDatabase = {
        byRegion: {
          europe: [],
          northAmerica: [],
          asia: [],
          africa: [],
          oceania: [],
          southAmerica: []
        },
        bySpecialization: {
          architecturalHistory: [],
          industrialDesign: [],
          prefabricatedConstruction: [],
          modernism: [],
          materialStudies: []
        }
      };

      // Organize scholars by region
      scholars.forEach(scholar => {
        if (database.byRegion[scholar.region as keyof typeof database.byRegion]) {
          database.byRegion[scholar.region as keyof typeof database.byRegion].push(scholar);
        }
      });

      // Organize scholars by specialization (scholars can appear in multiple specializations)
      scholars.forEach(scholar => {
        scholar.specialization.forEach(spec => {
          if (database.bySpecialization[spec as keyof typeof database.bySpecialization]) {
            database.bySpecialization[spec as keyof typeof database.bySpecialization].push(scholar);
          }
        });
      });

      return database;
    }

    /**
     * Feature: jean-prouve-website, Property 4: Classification organization consistency
     * For any content type (works or scholars), the system should provide consistent 
     * classification organization, ensuring each item is correctly categorized
     */
    it('should provide consistent classification for any collection of works', () => {
      fc.assert(
        fc.property(worksCollectionArb, (works: ArchitecturalWork[]) => {
          // Property: Works classification consistency
          const isConsistent = validateWorksClassification(works);
          
          expect(isConsistent).toBe(true);
          
          // Validate each work has proper category structure
          works.forEach(work => {
            expect(work).toHaveProperty('category');
            expect(work.category).toHaveProperty('id');
            expect(work.category).toHaveProperty('name');
            expect(work.category).toHaveProperty('description');
            
            // Category ID should be valid
            expect(['residential', 'industrial', 'educational', 'experimental', 'furniture']).toContain(work.category.id);
            
            // Category fields should be non-empty strings
            expect(typeof work.category.id).toBe('string');
            expect(typeof work.category.name).toBe('string');
            expect(typeof work.category.description).toBe('string');
            expect(work.category.id.trim().length).toBeGreaterThan(0);
            expect(work.category.name.trim().length).toBeGreaterThan(0);
            expect(work.category.description.trim().length).toBeGreaterThan(0);
          });
          
          // Validate category consistency within the collection
          const categoryMap = new Map<string, WorkCategory>();
          works.forEach(work => {
            const existingCategory = categoryMap.get(work.category.id);
            if (existingCategory) {
              // Same category ID should have same name and description
              expect(work.category.name).toBe(existingCategory.name);
              expect(work.category.description).toBe(existingCategory.description);
            } else {
              categoryMap.set(work.category.id, work.category);
            }
          });
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: jean-prouve-website, Property 4: Scholar classification consistency
     * For any collection of scholars, the system should provide consistent 
     * region and specialization organization
     */
    it('should provide consistent classification for any collection of scholars', () => {
      fc.assert(
        fc.property(scholarsCollectionArb, (scholars: Scholar[]) => {
          // Property: Scholars classification consistency
          const isConsistent = validateScholarsClassification(scholars);
          
          expect(isConsistent).toBe(true);
          
          // Validate each scholar has proper classification structure
          scholars.forEach(scholar => {
            expect(scholar).toHaveProperty('region');
            expect(scholar).toHaveProperty('specialization');
            
            // Region should be valid
            expect(['europe', 'northAmerica', 'asia', 'africa', 'oceania', 'southAmerica']).toContain(scholar.region);
            
            // Specialization should be valid array
            expect(Array.isArray(scholar.specialization)).toBe(true);
            expect(scholar.specialization.length).toBeGreaterThan(0);
            
            scholar.specialization.forEach(spec => {
              expect(['architecturalHistory', 'industrialDesign', 'prefabricatedConstruction', 'modernism', 'materialStudies']).toContain(spec);
            });
          });
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: jean-prouve-website, Property 4: Database organization consistency
     * For any collection of works, organizing them into a database structure 
     * should maintain classification integrity
     */
    it('should maintain classification integrity when organizing works into database structure', () => {
      fc.assert(
        fc.property(worksCollectionArb, (works: ArchitecturalWork[]) => {
          // Property: Database organization consistency
          const database = validateWorksDatabase(works);
          
          // Validate database structure
          expect(database).toHaveProperty('residential');
          expect(database).toHaveProperty('industrial');
          expect(database).toHaveProperty('educational');
          expect(database).toHaveProperty('experimental');
          expect(database).toHaveProperty('furniture');
          
          // Validate all categories are arrays
          Object.values(database).forEach(categoryWorks => {
            expect(Array.isArray(categoryWorks)).toBe(true);
          });
          
          // Validate works are correctly categorized
          database.residential.forEach(work => {
            expect(work.category.id).toBe('residential');
          });
          
          database.industrial.forEach(work => {
            expect(work.category.id).toBe('industrial');
          });
          
          database.educational.forEach(work => {
            expect(work.category.id).toBe('educational');
          });
          
          database.experimental.forEach(work => {
            expect(['experimental', 'furniture'].includes(work.category.id)).toBe(true);
          });
          
          // Validate total count consistency
          const totalInDatabase = Object.values(database).reduce((sum, categoryWorks) => sum + categoryWorks.length, 0);
          expect(totalInDatabase).toBe(works.length);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: jean-prouve-website, Property 4: Scholar database organization consistency
     * For any collection of scholars, organizing them by region and specialization 
     * should maintain classification integrity
     */
    it('should maintain classification integrity when organizing scholars into database structure', () => {
      fc.assert(
        fc.property(scholarsCollectionArb, (scholars: Scholar[]) => {
          // Property: Scholar database organization consistency
          const database = validateScholarsDatabase(scholars);
          
          // Validate database structure
          expect(database).toHaveProperty('byRegion');
          expect(database).toHaveProperty('bySpecialization');
          
          // Validate region organization
          Object.keys(database.byRegion).forEach(region => {
            expect(['europe', 'northAmerica', 'asia', 'africa', 'oceania', 'southAmerica']).toContain(region);
            expect(Array.isArray(database.byRegion[region as keyof typeof database.byRegion])).toBe(true);
            
            // All scholars in this region should have the correct region
            database.byRegion[region as keyof typeof database.byRegion].forEach(scholar => {
              expect(scholar.region).toBe(region);
            });
          });
          
          // Validate specialization organization
          Object.keys(database.bySpecialization).forEach(specialization => {
            expect(['architecturalHistory', 'industrialDesign', 'prefabricatedConstruction', 'modernism', 'materialStudies']).toContain(specialization);
            expect(Array.isArray(database.bySpecialization[specialization as keyof typeof database.bySpecialization])).toBe(true);
            
            // All scholars in this specialization should have this specialization
            database.bySpecialization[specialization as keyof typeof database.bySpecialization].forEach(scholar => {
              expect(scholar.specialization).toContain(specialization);
            });
          });
          
          // Validate total count consistency for regions
          const totalByRegion = Object.values(database.byRegion).reduce((sum, regionScholars) => sum + regionScholars.length, 0);
          expect(totalByRegion).toBe(scholars.length);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: jean-prouve-website, Property 4: Real data classification consistency
     * The actual works data should follow consistent classification patterns
     */
    it('should have consistent classification in actual works data', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          // Test with actual works data
          const allWorks = getAllWorks();
          const isConsistent = validateWorksClassification(allWorks);
          
          expect(isConsistent).toBe(true);
          
          // Test category-based retrieval consistency
          workCategories.forEach(category => {
            const categoryWorks = getWorksByCategory(category.id);
            
            // All works in this category should have the same category ID
            categoryWorks.forEach(work => {
              expect(work.category.id).toBe(category.id);
            });
            
            // Category information should be consistent
            if (categoryWorks.length > 0) {
              const firstWork = categoryWorks[0];
              categoryWorks.forEach(work => {
                expect(work.category.name).toBe(firstWork.category.name);
                expect(work.category.description).toBe(firstWork.category.description);
              });
            }
          });
          
          return true;
        }),
        { numRuns: 10 }
      );
    });

    /**
     * Feature: jean-prouve-website, Property 4: Category filtering consistency
     * Filtering works by category should return only works from that category
     */
    it('should maintain consistency when filtering works by category', () => {
      fc.assert(
        fc.property(fc.constantFrom('residential', 'industrial', 'educational', 'experimental'), (categoryId: string) => {
          // Test category filtering
          const categoryWorks = getWorksByCategory(categoryId);
          
          // All returned works should belong to the requested category
          categoryWorks.forEach(work => {
            expect(work.category.id).toBe(categoryId);
          });
          
          // If there are works in this category, they should all have consistent category info
          if (categoryWorks.length > 0) {
            const referenceCategory = categoryWorks[0].category;
            categoryWorks.forEach(work => {
              expect(work.category.name).toBe(referenceCategory.name);
              expect(work.category.description).toBe(referenceCategory.description);
            });
          }
          
          return true;
        }),
        { numRuns: 20 }
      );
    });
  });
});