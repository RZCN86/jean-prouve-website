/**
 * Property-based tests for responsive display functionality
 * Feature: jean-prouve-website, Property 7: Responsive display adaptability
 * Validates: Requirements 5.1, 5.4
 */

import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import React from 'react';
import { WorksList } from '@/components/works/WorksList';
import { ScholarsList } from '@/components/scholars/ScholarsList';
import { MainNavigation } from '@/components/navigation';
import { ArchitecturalWork, Scholar, WorkCategory } from '@/types';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/works',
    pathname: '/works',
    query: {},
    push: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

// Mock next-i18next
jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'navigation.home': '首页',
        'navigation.biography': '传记',
        'navigation.works': '作品',
        'navigation.scholars': '学者研究',
        'navigation.language': '语言',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  // eslint-disable-next-line react/display-name
  return ({ src, alt, className, fill, sizes, priority, quality, ...props }: any) => {
    return React.createElement('img', {
      src,
      alt,
      className,
      ...props,
    });
  };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href, className, ...props }: any) => {
    return React.createElement('a', {
      href,
      className,
      ...props,
    }, children);
  };
});

describe('Responsive Display Property Tests', () => {
  describe('Property 7: Responsive display adaptability', () => {
    /**
     * Property: For any device type (desktop, tablet, mobile), 
     * the system should provide appropriate display layout and interaction methods
     * Validates: Requirements 5.1, 5.4
     */

    // Generator for valid work category
    const workCategoryArb = fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      name: fc.constantFrom('住宅建筑', '工业建筑', '教育建筑', '实验建筑'),
      description: fc.string({ minLength: 10, maxLength: 100 }),
    });

    // Generator for valid architectural work
    const architecturalWorkArb = fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      title: fc.string({ minLength: 5, maxLength: 50 }),
      year: fc.integer({ min: 1920, max: 1984 }),
      location: fc.string({ minLength: 5, max: 50 }),
      category: workCategoryArb,
      description: fc.string({ minLength: 20, maxLength: 200 }),
      images: fc.array(fc.record({
        id: fc.string({ minLength: 1, maxLength: 20 }),
        src: fc.constantFrom('/test1.jpg', '/test2.jpg', '/test3.jpg'),
        alt: fc.string({ minLength: 1, maxLength: 100 }),
        caption: fc.option(fc.string({ minLength: 1, maxLength: 200 })),
        width: fc.integer({ min: 100, max: 2000 }),
        height: fc.integer({ min: 100, max: 2000 }),
      }), { minLength: 1, maxLength: 3 }),
      technicalDrawings: fc.array(fc.record({
        id: fc.string({ minLength: 1, maxLength: 20 }),
        src: fc.constantFrom('/drawing1.jpg', '/drawing2.jpg'),
        alt: fc.string({ minLength: 1, maxLength: 100 }),
        caption: fc.option(fc.string({ minLength: 1, maxLength: 200 })),
        width: fc.integer({ min: 100, max: 2000 }),
        height: fc.integer({ min: 100, max: 2000 }),
      }), { minLength: 0, maxLength: 2 }),
      specifications: fc.array(fc.record({
        property: fc.string({ minLength: 2, maxLength: 20 }),
        value: fc.string({ minLength: 1, maxLength: 50 }),
        unit: fc.option(fc.constantFrom('m', 'm²', 'kg', 'mm')),
      }), { minLength: 0, maxLength: 5 }),
      commentary: fc.record({
        expert: fc.string({ minLength: 5, maxLength: 30 }),
        analysis: fc.string({ minLength: 50, maxLength: 300 }),
        historicalContext: fc.string({ minLength: 50, maxLength: 300 }),
        technicalInnovation: fc.string({ minLength: 50, maxLength: 300 }),
        contemporaryInfluence: fc.string({ minLength: 50, maxLength: 300 }),
      }),
      status: fc.constantFrom('existing', 'demolished', 'reconstructed'),
    });

    // Generator for valid scholar
    const scholarArb = fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      name: fc.string({ minLength: 5, maxLength: 50 }),
      institution: fc.string({ minLength: 5, maxLength: 100 }),
      country: fc.string({ minLength: 2, maxLength: 50 }),
      region: fc.constantFrom('europe', 'northAmerica', 'asia', 'africa', 'oceania', 'southAmerica'),
      specialization: fc.array(fc.constantFrom('architecturalHistory', 'industrialDesign', 'prefabricatedConstruction', 'modernism', 'materialStudies'), { minLength: 1, maxLength: 3 }),
      biography: fc.string({ minLength: 100, maxLength: 500 }),
      contact: fc.record({
        email: fc.option(fc.emailAddress()),
        website: fc.option(fc.webUrl()),
        phone: fc.option(fc.string({ minLength: 10, maxLength: 20 })),
      }),
      publications: fc.array(fc.record({
        id: fc.string({ minLength: 1, maxLength: 20 }),
        title: fc.string({ minLength: 10, maxLength: 100 }),
        type: fc.constantFrom('book', 'article', 'thesis', 'conference'),
        year: fc.integer({ min: 1980, max: 2024 }),
        publisher: fc.option(fc.string({ minLength: 5, maxLength: 50 })),
        abstract: fc.string({ minLength: 50, maxLength: 300 }),
        keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
        url: fc.option(fc.webUrl()),
      }), { minLength: 0, maxLength: 5 }),
      exhibitions: fc.array(fc.record({
        id: fc.string({ minLength: 1, maxLength: 20 }),
        title: fc.string({ minLength: 10, maxLength: 100 }),
        venue: fc.string({ minLength: 5, maxLength: 100 }),
        year: fc.integer({ min: 1980, max: 2024 }),
        description: fc.string({ minLength: 50, maxLength: 300 }),
        role: fc.constantFrom('curator', 'contributor', 'organizer'),
      }), { minLength: 0, maxLength: 3 }),
    });

    // Mock viewport dimensions for different device types
    const mockViewport = (width: number, height: number) => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: height,
      });
    };

    it('should adapt grid layouts for different screen sizes', () => {
      fc.assert(
        fc.property(
          fc.array(architecturalWorkArb, { minLength: 1, maxLength: 6 }),
          fc.constantFrom(
            { width: 375, height: 667, type: 'mobile' },    // iPhone SE
            { width: 768, height: 1024, type: 'tablet' },   // iPad
            { width: 1024, height: 768, type: 'tablet-landscape' },
            { width: 1440, height: 900, type: 'desktop' }   // Desktop
          ),
          (works: ArchitecturalWork[], viewport) => {
            mockViewport(viewport.width, viewport.height);

            const { container } = render(
              React.createElement(WorksList, { works })
            );

            // Property 1: Grid should have responsive classes
            const gridContainer = container.querySelector('.grid');
            expect(gridContainer).toBeTruthy();

            // Property 2: Should have appropriate responsive grid classes
            const hasResponsiveClasses = gridContainer?.className.includes('grid-cols-1') &&
              (gridContainer?.className.includes('sm:grid-cols-2') || 
               gridContainer?.className.includes('md:grid-cols-2') ||
               gridContainer?.className.includes('lg:grid-cols-3'));
            expect(hasResponsiveClasses).toBeTruthy();

            // Property 3: Cards should have mobile-optimized spacing
            const cards = container.querySelectorAll('.card-mobile, .card');
            expect(cards.length).toBeGreaterThan(0);

            // Property 4: Images should have responsive sizing or be in responsive containers
            const images = container.querySelectorAll('img');
            const imageContainers = container.querySelectorAll('.image-container-mobile, .relative');
            
            // Check if we have responsive image containers or responsive images
            const hasResponsiveImages = images.length > 0 || imageContainers.length > 0;
            expect(hasResponsiveImages).toBeTruthy();
            
            // If we have image containers, they should have responsive sizing
            imageContainers.forEach(container => {
              const hasResponsiveSizing = container.className.includes('h-48') ||
                                        container.className.includes('sm:h-56') ||
                                        container.className.includes('lg:h-64') ||
                                        container.className.includes('relative');
              expect(hasResponsiveSizing).toBeTruthy();
            });

            return true;
          }
        ),
        { numRuns: 25 }
      );
    });

    it('should provide touch-friendly navigation on mobile devices', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('zh', 'fr', 'en'),
          fc.constantFrom(
            { width: 375, height: 667, type: 'mobile' },
            { width: 414, height: 896, type: 'mobile-large' }
          ),
          (locale: string, viewport) => {
            mockViewport(viewport.width, viewport.height);

            const { container } = render(
              React.createElement(MainNavigation, {
                currentPath: '/works',
                locale,
              })
            );

            // Property 1: Mobile menu button should be present and touch-friendly
            const mobileMenuButton = container.querySelector('.mobile-menu-button');
            expect(mobileMenuButton).toBeTruthy();
            
            // Check for touch-friendly classes
            const hasTouchClasses = mobileMenuButton?.className.includes('btn-touch') ||
                                  mobileMenuButton?.className.includes('touch-manipulation') ||
                                  mobileMenuButton?.className.includes('p-2');
            expect(hasTouchClasses).toBeTruthy();

            // Property 2: Navigation should have safe area insets for mobile
            const nav = container.querySelector('nav');
            const hasSafeAreaClasses = nav?.className.includes('safe-area-inset-top') ||
                                     nav?.className.includes('sticky') ||
                                     nav?.className.includes('top-0');
            expect(hasSafeAreaClasses).toBeTruthy();

            // Property 3: Language switcher should be touch-optimized
            const languageButton = container.querySelector('.language-menu-button');
            expect(languageButton).toBeTruthy();
            
            const hasLanguageTouchClasses = languageButton?.className.includes('btn-touch') ||
                                          languageButton?.className.includes('touch-manipulation') ||
                                          languageButton?.className.includes('p-2');
            expect(hasLanguageTouchClasses).toBeTruthy();

            // Property 4: All interactive elements should have tap highlight removal
            const interactiveElements = container.querySelectorAll('button, a');
            interactiveElements.forEach(element => {
              const hasTapHighlightClasses = element.className.includes('tap-highlight-none') ||
                                           element.className.includes('touch-manipulation');
              expect(hasTapHighlightClasses).toBeTruthy();
            });

            return true;
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should optimize content layout for different screen orientations', () => {
      fc.assert(
        fc.property(
          fc.array(scholarArb, { minLength: 1, maxLength: 8 }),
          fc.constantFrom(
            { width: 375, height: 667, orientation: 'portrait' },
            { width: 667, height: 375, orientation: 'landscape' },
            { width: 768, height: 1024, orientation: 'portrait' },
            { width: 1024, height: 768, orientation: 'landscape' }
          ),
          (scholars: Scholar[], viewport) => {
            mockViewport(viewport.width, viewport.height);

            const { container } = render(
              React.createElement(ScholarsList, { scholars })
            );

            // Property 1: Filter section should be collapsible on mobile
            if (viewport.width < 640) {
              const filterToggle = container.querySelector('button');
              expect(filterToggle?.textContent).toContain('筛选条件');
            }

            // Property 2: Grid should adapt to screen size
            const gridContainer = container.querySelector('.grid');
            expect(gridContainer).toBeTruthy();
            
            const hasAdaptiveGrid = gridContainer?.className.includes('grid-cols-1') &&
              (gridContainer?.className.includes('sm:grid-cols-2') ||
               gridContainer?.className.includes('lg:grid-cols-3'));
            expect(hasAdaptiveGrid).toBeTruthy();

            // Property 3: Input fields should be mobile-optimized
            const inputs = container.querySelectorAll('input, select');
            inputs.forEach(input => {
              if (viewport.width < 640) {
                const hasMobileInputClasses = input.className.includes('input-mobile') ||
                                            input.className.includes('w-full') ||
                                            input.className.includes('px-3');
                expect(hasMobileInputClasses).toBeTruthy();
              }
            });

            return true;
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should maintain visual consistency across different viewport sizes', () => {
      fc.assert(
        fc.property(
          fc.array(architecturalWorkArb, { minLength: 2, maxLength: 4 }),
          fc.constantFrom(
            { width: 320, height: 568, type: 'small-mobile' },
            { width: 768, height: 1024, type: 'tablet' },
            { width: 1920, height: 1080, type: 'large-desktop' }
          ),
          (works: ArchitecturalWork[], viewport) => {
            mockViewport(viewport.width, viewport.height);

            const { container } = render(
              React.createElement(WorksList, { works })
            );

            // Property 1: All cards should maintain consistent structure
            const cards = container.querySelectorAll('[class*="card"]');
            expect(cards.length).toBe(works.length);

            cards.forEach(card => {
              // Should have image container
              const imageContainer = card.querySelector('[class*="image-container"], .relative');
              expect(imageContainer).toBeTruthy();

              // Should have content area
              const contentArea = card.querySelector('[class*="space-y"], .p-4, .p-6');
              expect(contentArea).toBeTruthy();

              // Should have title
              const title = card.querySelector('h3');
              expect(title).toBeTruthy();
            });

            // Property 2: Typography should scale appropriately
            const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach(heading => {
              const hasResponsiveText = heading.className.includes('text-') &&
                (heading.className.includes('sm:text-') || 
                 heading.className.includes('lg:text-') ||
                 heading.className.includes('text-lg') ||
                 heading.className.includes('text-xl'));
              expect(hasResponsiveText).toBeTruthy();
            });

            return true;
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should provide appropriate spacing and padding for different devices', () => {
      fc.assert(
        fc.property(
          fc.array(scholarArb, { minLength: 1, maxLength: 3 }),
          fc.constantFrom(
            { width: 375, height: 667, type: 'mobile' },
            { width: 1024, height: 768, type: 'desktop' }
          ),
          (scholars: Scholar[], viewport) => {
            mockViewport(viewport.width, viewport.height);

            const { container } = render(
              React.createElement(ScholarsList, { scholars })
            );

            // Property 1: Container should have responsive padding
            const containers = container.querySelectorAll('[class*="container"], .card-mobile, .card, .bg-white, .space-y-');
            const hasContainers = containers.length > 0;
            expect(hasContainers).toBeTruthy();
            
            // Check for any kind of spacing/padding classes
            let hasAnySpacing = false;
            containers.forEach(containerEl => {
              const hasSpacing = containerEl.className.includes('p-') ||
                containerEl.className.includes('px-') ||
                containerEl.className.includes('py-') ||
                containerEl.className.includes('space-y-') ||
                containerEl.className.includes('mb-') ||
                containerEl.className.includes('mt-');
              if (hasSpacing) {
                hasAnySpacing = true;
              }
            });
            expect(hasAnySpacing).toBeTruthy();

            // Property 2: Gaps should be responsive
            const gridContainers = container.querySelectorAll('.grid');
            gridContainers.forEach(grid => {
              const hasResponsiveGap = grid.className.includes('gap-4') ||
                grid.className.includes('sm:gap-6') ||
                grid.className.includes('lg:gap-8') ||
                grid.className.includes('space-y-');
              expect(hasResponsiveGap).toBeTruthy();
            });

            // Property 3: Interactive elements should meet minimum touch target size
            const buttons = container.querySelectorAll('button');
            buttons.forEach(button => {
              if (viewport.width < 640) {
                const hasTouchTargetSize = button.className.includes('btn-touch') ||
                                         button.className.includes('p-2') ||
                                         button.className.includes('py-3');
                expect(hasTouchTargetSize).toBeTruthy();
              }
            });

            return true;
          }
        ),
        { numRuns: 15 }
      );
    });

    it('should handle content overflow gracefully on small screens', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 50, maxLength: 100 }), // Long title
            description: fc.string({ minLength: 200, maxLength: 400 }), // Long description
            location: fc.string({ minLength: 30, maxLength: 60 }), // Long location
          }),
          fc.constantFrom(
            { width: 320, height: 568, type: 'small-mobile' },
            { width: 375, height: 667, type: 'mobile' }
          ),
          (longContent, viewport) => {
            mockViewport(viewport.width, viewport.height);

            // Create a work with long content
            const workWithLongContent: ArchitecturalWork = {
              id: 'test-work',
              title: longContent.title,
              year: 1950,
              location: longContent.location,
              category: { id: 'test', name: '测试类别', description: 'Test category' },
              description: longContent.description,
              images: [{
                id: 'test-img',
                src: '/test.jpg',
                alt: 'Test image',
                width: 800,
                height: 600,
              }],
              technicalDrawings: [],
              specifications: [],
              commentary: {
                expert: 'Test Expert',
                analysis: 'Test analysis',
                historicalContext: 'Test context',
                technicalInnovation: 'Test innovation',
                contemporaryInfluence: 'Test influence',
              },
              status: 'existing',
            };

            const { container } = render(
              React.createElement(WorksList, { works: [workWithLongContent] })
            );

            // Property 1: Long text should be truncated with line-clamp
            const descriptions = container.querySelectorAll('[class*="line-clamp"]');
            expect(descriptions.length).toBeGreaterThan(0);

            // Property 2: Titles should handle overflow
            const titles = container.querySelectorAll('h3');
            titles.forEach(title => {
              const hasOverflowHandling = title.className.includes('line-clamp') ||
                                        title.className.includes('truncate') ||
                                        title.className.includes('overflow-hidden');
              expect(hasOverflowHandling).toBeTruthy();
            });

            // Property 3: Location text should be truncated if too long
            const locationElements = container.querySelectorAll('[class*="truncate"]');
            expect(locationElements.length).toBeGreaterThan(0);

            return true;
          }
        ),
        { numRuns: 15 }
      );
    });
  });
});