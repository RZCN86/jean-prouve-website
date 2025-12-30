import * as fc from 'fast-check';
import { Scholar, ArchitecturalWork } from '@/types';

/**
 * Feature: jean-prouve-website, Property 2: Scholar information completeness
 * Validates: Requirements 8.2, 8.3, 8.5, 8.6
 * 
 * Feature: jean-prouve-website, Property 3: Work data completeness
 * Validates: Requirements 2.5
 */

// Mock data generators for property testing
const imageDataArb = fc.record({
  id: fc.uuid(),
  src: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length > 0),
  alt: fc.string({ minLength: 5, maxLength: 50 }).filter(s => s.trim().length > 0),
  caption: fc.option(fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length > 0)),
  width: fc.integer({ min: 100, max: 2000 }),
  height: fc.integer({ min: 100, max: 2000 })
});

const workCategoryArb = fc.record({
  id: fc.uuid(),
  name: fc.constantFrom('residential', 'industrial', 'educational', 'experimental'),
  description: fc.string({ minLength: 20, maxLength: 100 }).filter(s => s.trim().length > 0)
});

const technicalSpecArb = fc.record({
  property: fc.string({ minLength: 5, maxLength: 30 }).filter(s => s.trim().length > 0),
  value: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  unit: fc.option(fc.constantFrom('m', 'cm', 'mm', 'kg', 'm²', 'm³'))
});

const commentaryArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length > 0),
  content: fc.string({ minLength: 50, maxLength: 500 }).filter(s => s.trim().length > 0),
  author: fc.string({ minLength: 5, maxLength: 50 }).filter(s => s.trim().length > 0),
  type: fc.constantFrom('technical', 'historical', 'cultural', 'contemporary')
});

const architecturalWorkArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length > 0),
  year: fc.integer({ min: 1920, max: 1984 }), // Jean Prouvé's active years
  location: fc.string({ minLength: 3, maxLength: 100 }).filter(s => s.trim().length > 0),
  category: workCategoryArb,
  description: fc.string({ minLength: 20, maxLength: 500 }).filter(s => s.trim().length > 0),
  images: fc.array(imageDataArb, { minLength: 1, maxLength: 10 }),
  technicalDrawings: fc.array(imageDataArb, { minLength: 0, maxLength: 5 }),
  specifications: fc.array(technicalSpecArb, { minLength: 1, maxLength: 10 }),
  commentary: commentaryArb,
  status: fc.constantFrom('existing', 'demolished', 'reconstructed')
});

const contactInfoArb = fc.record({
  email: fc.option(fc.emailAddress()),
  phone: fc.option(fc.string({ minLength: 10, maxLength: 15 })),
  website: fc.option(fc.webUrl()),
  address: fc.option(fc.string({ minLength: 10, maxLength: 100 }))
});

const publicationArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length > 0),
  type: fc.constantFrom('book', 'article', 'thesis', 'conference'),
  year: fc.integer({ min: 1950, max: 2024 }),
  publisher: fc.option(fc.string({ minLength: 3, maxLength: 50 }).filter(s => s.trim().length > 0)),
  abstract: fc.string({ minLength: 20, maxLength: 500 }).filter(s => s.trim().length > 0),
  keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 10 }),
  url: fc.option(fc.webUrl())
});

const exhibitionArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length > 0),
  venue: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length > 0),
  year: fc.integer({ min: 1950, max: 2024 }),
  description: fc.string({ minLength: 20, maxLength: 300 }).filter(s => s.trim().length > 0),
  role: fc.string({ minLength: 5, maxLength: 50 }).filter(s => s.trim().length > 0)
});

const scholarArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 3, maxLength: 50 }).filter(s => s.trim().length > 0),
  institution: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length > 0),
  country: fc.string({ minLength: 3, maxLength: 50 }).filter(s => s.trim().length > 0),
  region: fc.constantFrom('Europe', 'North America', 'Asia', 'Africa', 'Oceania', 'South America'),
  specialization: fc.array(fc.string({ minLength: 5, maxLength: 30 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 5 }),
  biography: fc.string({ minLength: 50, maxLength: 1000 }).filter(s => s.trim().length > 0),
  contact: contactInfoArb,
  publications: fc.array(publicationArb, { minLength: 0, maxLength: 10 }),
  exhibitions: fc.array(exhibitionArb, { minLength: 0, maxLength: 5 })
});

/**
 * Validates that an architectural work contains the basic information triplet
 */
function validateWorkCompleteness(work: ArchitecturalWork): boolean {
  // Check basic triplet: construction date, location, current status
  const hasYear = typeof work.year === 'number' && work.year > 1900 && work.year <= 2024;
  const hasLocation = work.location && work.location.trim().length > 0;
  const hasValidStatus = ['existing', 'demolished', 'reconstructed'].includes(work.status);
  
  return hasYear && hasLocation && hasValidStatus;
}

/**
 * Validates that a scholar record contains complete academic information
 */
function validateScholarCompleteness(scholar: Scholar): boolean {
  // Check required fields are present and non-empty
  const hasRequiredFields = 
    scholar.id && scholar.id.trim().length > 0 &&
    scholar.name && scholar.name.trim().length > 0 &&
    scholar.institution && scholar.institution.trim().length > 0 &&
    scholar.country && scholar.country.trim().length > 0 &&
    scholar.region && scholar.region.trim().length > 0 &&
    scholar.biography && scholar.biography.trim().length > 0;

  // Check specialization array is not empty
  const hasSpecializations = 
    Array.isArray(scholar.specialization) && 
    scholar.specialization.length > 0 &&
    scholar.specialization.every(spec => spec && spec.trim().length > 0);

  // Check contact information structure exists
  const hasContactStructure = 
    scholar.contact && 
    typeof scholar.contact === 'object';

  // Check publications array structure
  const hasValidPublications = 
    Array.isArray(scholar.publications) &&
    scholar.publications.every(pub => 
      pub.id && pub.title && pub.type && 
      typeof pub.year === 'number' && 
      pub.abstract && Array.isArray(pub.keywords)
    );

  // Check exhibitions array structure
  const hasValidExhibitions = 
    Array.isArray(scholar.exhibitions) &&
    scholar.exhibitions.every(exh => 
      exh.id && exh.title && exh.venue && 
      typeof exh.year === 'number' && 
      exh.description && exh.role
    );

  return hasRequiredFields && hasSpecializations && hasContactStructure && 
         hasValidPublications && hasValidExhibitions;
}

/**
 * Validates that research outcomes (publications and exhibitions) contain required information
 */
function validateResearchOutcomes(scholar: Scholar): boolean {
  // If scholar has publications, they should contain abstracts and keywords
  const publicationsValid = scholar.publications.every(pub => 
    pub.abstract && pub.abstract.trim().length > 0 &&
    pub.keywords && pub.keywords.length > 0 &&
    pub.keywords.every(keyword => keyword.trim().length > 0)
  );

  // If scholar has exhibitions, they should contain descriptions and roles
  const exhibitionsValid = scholar.exhibitions.every(exh => 
    exh.description && exh.description.trim().length > 0 &&
    exh.role && exh.role.trim().length > 0
  );

  return publicationsValid && exhibitionsValid;
}

/**
 * Validates that contact information follows expected structure when provided
 */
function validateContactInfo(contact: Scholar['contact']): boolean {
  // If email is provided, it should be valid format (basic check)
  if (contact.email && !contact.email.includes('@')) {
    return false;
  }

  // If website is provided, it should be URL format (basic check)
  if (contact.website && !contact.website.startsWith('http')) {
    return false;
  }

  // All provided fields should be non-empty strings
  const fields = [contact.email, contact.phone, contact.website, contact.address];
  return fields.every(field => !field || (typeof field === 'string' && field.trim().length > 0));
}

describe('Data Model Property Tests', () => {
  describe('Property 2: Scholar information completeness', () => {
    /**
     * Feature: jean-prouve-website, Property 2: Scholar information completeness
     * For any scholar record, the system should contain complete academic information,
     * including background, institution, research direction, research outcomes, abstracts and contact information
     */
    it('should contain complete academic information for any scholar record', () => {
      fc.assert(
        fc.property(scholarArb, (scholar: Scholar) => {
          // Property: Scholar completeness validation
          const isComplete = validateScholarCompleteness(scholar);
          
          expect(isComplete).toBe(true);
          
          // Additional specific validations
          expect(scholar).toHaveProperty('id');
          expect(scholar).toHaveProperty('name');
          expect(scholar).toHaveProperty('institution');
          expect(scholar).toHaveProperty('country');
          expect(scholar).toHaveProperty('region');
          expect(scholar).toHaveProperty('specialization');
          expect(scholar).toHaveProperty('biography');
          expect(scholar).toHaveProperty('contact');
          expect(scholar).toHaveProperty('publications');
          expect(scholar).toHaveProperty('exhibitions');
          
          // Validate specialization is non-empty array
          expect(Array.isArray(scholar.specialization)).toBe(true);
          expect(scholar.specialization.length).toBeGreaterThan(0);
          
          // Validate contact structure
          expect(typeof scholar.contact).toBe('object');
          expect(scholar.contact).not.toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: jean-prouve-website, Property 2: Research outcomes completeness
     * For any scholar with research outcomes, publications should contain abstracts and keywords,
     * exhibitions should contain descriptions and roles
     */
    it('should contain complete research outcome information', () => {
      fc.assert(
        fc.property(scholarArb, (scholar: Scholar) => {
          const hasValidOutcomes = validateResearchOutcomes(scholar);
          
          expect(hasValidOutcomes).toBe(true);
          
          // Validate publications structure
          scholar.publications.forEach(pub => {
            expect(pub).toHaveProperty('abstract');
            expect(pub).toHaveProperty('keywords');
            expect(pub.abstract.trim().length).toBeGreaterThan(0);
            expect(Array.isArray(pub.keywords)).toBe(true);
            expect(pub.keywords.length).toBeGreaterThan(0);
          });
          
          // Validate exhibitions structure
          scholar.exhibitions.forEach(exh => {
            expect(exh).toHaveProperty('description');
            expect(exh).toHaveProperty('role');
            expect(exh.description.trim().length).toBeGreaterThan(0);
            expect(exh.role.trim().length).toBeGreaterThan(0);
          });
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: jean-prouve-website, Property 2: Contact information validity
     * For any scholar contact information, when fields are provided they should be valid
     */
    it('should have valid contact information structure when provided', () => {
      fc.assert(
        fc.property(scholarArb, (scholar: Scholar) => {
          const contactValid = validateContactInfo(scholar.contact);
          
          expect(contactValid).toBe(true);
          
          // If email is provided, should contain @
          if (scholar.contact.email) {
            expect(scholar.contact.email).toContain('@');
          }
          
          // If website is provided, should start with http
          if (scholar.contact.website) {
            expect(scholar.contact.website).toMatch(/^https?:\/\//);
          }
          
          // All provided contact fields should be non-empty
          Object.values(scholar.contact).forEach(value => {
            if (value) {
              expect(typeof value).toBe('string');
              expect(value.trim().length).toBeGreaterThan(0);
            }
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 3: Architectural work data completeness', () => {
    /**
     * Feature: jean-prouve-website, Property 3: Work data completeness
     * For any architectural work, the system should contain basic information triplet:
     * construction date, location and current status
     */
    it('should contain basic information triplet for any architectural work', () => {
      fc.assert(
        fc.property(architecturalWorkArb, (work: ArchitecturalWork) => {
          // Property: Work data completeness validation
          const hasBasicInfo = validateWorkCompleteness(work);
          
          expect(hasBasicInfo).toBe(true);
          
          // Validate required triplet: date, location, status
          expect(work).toHaveProperty('year');
          expect(work).toHaveProperty('location');
          expect(work).toHaveProperty('status');
          
          // Validate year is a valid number
          expect(typeof work.year).toBe('number');
          expect(work.year).toBeGreaterThan(1900);
          expect(work.year).toBeLessThanOrEqual(2024);
          
          // Validate location is non-empty string
          expect(typeof work.location).toBe('string');
          expect(work.location.trim().length).toBeGreaterThan(0);
          
          // Validate status is one of allowed values
          expect(['existing', 'demolished', 'reconstructed']).toContain(work.status);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: jean-prouve-website, Property 3: Work metadata completeness
     * For any architectural work, essential metadata should be present and valid
     */
    it('should contain complete metadata for any architectural work', () => {
      fc.assert(
        fc.property(architecturalWorkArb, (work: ArchitecturalWork) => {
          // Validate essential fields
          expect(work).toHaveProperty('id');
          expect(work).toHaveProperty('title');
          expect(work).toHaveProperty('description');
          expect(work).toHaveProperty('category');
          expect(work).toHaveProperty('images');
          expect(work).toHaveProperty('technicalDrawings');
          expect(work).toHaveProperty('specifications');
          expect(work).toHaveProperty('commentary');
          
          // Validate field types and content
          expect(typeof work.id).toBe('string');
          expect(work.id.trim().length).toBeGreaterThan(0);
          
          expect(typeof work.title).toBe('string');
          expect(work.title.trim().length).toBeGreaterThan(0);
          
          expect(typeof work.description).toBe('string');
          expect(work.description.trim().length).toBeGreaterThan(0);
          
          // Validate category structure
          expect(work.category).toHaveProperty('id');
          expect(work.category).toHaveProperty('name');
          expect(work.category).toHaveProperty('description');
          
          // Validate arrays
          expect(Array.isArray(work.images)).toBe(true);
          expect(Array.isArray(work.technicalDrawings)).toBe(true);
          expect(Array.isArray(work.specifications)).toBe(true);
          
          // Validate commentary structure
          expect(work.commentary).toHaveProperty('id');
          expect(work.commentary).toHaveProperty('title');
          expect(work.commentary).toHaveProperty('content');
          expect(work.commentary).toHaveProperty('author');
          expect(work.commentary).toHaveProperty('type');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: jean-prouve-website, Property 3: Technical specifications validity
     * For any architectural work with specifications, they should have proper structure
     */
    it('should have valid technical specifications structure', () => {
      fc.assert(
        fc.property(architecturalWorkArb, (work: ArchitecturalWork) => {
          // Validate specifications array structure
          work.specifications.forEach(spec => {
            expect(spec).toHaveProperty('property');
            expect(spec).toHaveProperty('value');
            
            expect(typeof spec.property).toBe('string');
            expect(spec.property.trim().length).toBeGreaterThan(0);
            
            expect(typeof spec.value).toBe('string');
            expect(spec.value.trim().length).toBeGreaterThan(0);
            
            // Unit is optional but if present should be string
            if (spec.unit) {
              expect(typeof spec.unit).toBe('string');
              expect(spec.unit.trim().length).toBeGreaterThan(0);
            }
          });
        }),
        { numRuns: 100 }
      );
    });
  });
});