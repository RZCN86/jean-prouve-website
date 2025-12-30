/**
 * Property-based tests for interactive functionality
 * Feature: jean-prouve-website, Property 5: Interactive functionality responsiveness
 * Validates: Requirements 2.2, 4.1, 4.3
 */

import * as fc from 'fast-check';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { ImageGallery } from '@/components/works/ImageGallery';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ImageData } from '@/types';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/works/maison-tropicale',
    pathname: '/works/[id]',
    query: { id: 'maison-tropicale' },
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
      };
      return translations[key] || key;
    },
  }),
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  // eslint-disable-next-line react/display-name
  return ({ src, alt, onLoad, onError, ...props }: any) => {
    return React.createElement('img', {
      src,
      alt,
      onLoad,
      onError,
      ...props,
    });
  };
});

describe('Interactive Functionality Property Tests', () => {
  describe('Property 5: Interactive functionality responsiveness', () => {
    /**
     * Property: For any user interaction (image click, navigation operation), 
     * the system should provide corresponding feedback and functional response
     * Validates: Requirements 2.2, 4.1, 4.3
     */

    // Generator for valid image data
    const imageDataArb = fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      src: fc.constantFrom('/test1.jpg', '/test2.jpg', '/test3.jpg'),
      alt: fc.string({ minLength: 1, maxLength: 100 }),
      caption: fc.option(fc.string({ minLength: 1, maxLength: 200 })),
      width: fc.integer({ min: 100, max: 2000 }),
      height: fc.integer({ min: 100, max: 2000 }),
    });

    const imageArrayArb = fc.array(imageDataArb, { minLength: 1, maxLength: 5 });

    it('should respond to keyboard navigation for any image gallery', () => {
      fc.assert(
        fc.property(imageArrayArb, (images: ImageData[]) => {
          const mockOnClose = jest.fn();
          
          render(
            React.createElement(ImageGallery, {
              images,
              initialIndex: 0,
              onClose: mockOnClose,
            })
          );

          // Property 1: Escape key should trigger close callback
          fireEvent.keyDown(document, { key: 'Escape' });
          expect(mockOnClose).toHaveBeenCalled();

          // Property 2: Arrow keys should be handled (no errors thrown)
          expect(() => {
            fireEvent.keyDown(document, { key: 'ArrowLeft' });
            fireEvent.keyDown(document, { key: 'ArrowRight' });
            fireEvent.keyDown(document, { key: ' ' }); // Space for zoom
          }).not.toThrow();

          return true;
        }),
        { numRuns: 20 }
      );
    });

    it('should provide visual feedback for interactive elements', () => {
      fc.assert(
        fc.property(imageArrayArb, (images: ImageData[]) => {
          const mockOnClose = jest.fn();
          
          const { container } = render(
            React.createElement(ImageGallery, {
              images,
              initialIndex: 0,
              onClose: mockOnClose,
            })
          );

          // Property 1: Close button should be present and interactive
          const closeButton = container.querySelector('[aria-label="关闭图库"]');
          expect(closeButton).toBeTruthy();
          expect(closeButton).toHaveClass('hover:text-gray-300');

          // Property 2: Navigation buttons should be present for multiple images
          if (images.length > 1) {
            const prevButton = container.querySelector('[aria-label="上一张图片"]');
            const nextButton = container.querySelector('[aria-label="下一张图片"]');
            
            expect(prevButton).toBeTruthy();
            expect(nextButton).toBeTruthy();
            expect(prevButton).toHaveClass('hover:text-gray-300');
            expect(nextButton).toHaveClass('hover:text-gray-300');
          }

          // Property 3: Main image should have zoom cursor indication
          const imageContainer = container.querySelector('[class*="cursor-zoom"]');
          expect(imageContainer).toBeTruthy();

          return true;
        }),
        { numRuns: 15 }
      );
    });

    it('should handle touch interactions for mobile devices', () => {
      fc.assert(
        fc.property(imageArrayArb, (images: ImageData[]) => {
          const mockOnClose = jest.fn();
          
          const { container } = render(
            React.createElement(ImageGallery, {
              images,
              initialIndex: 0,
              onClose: mockOnClose,
            })
          );

          const galleryContainer = container.firstChild as HTMLElement;

          // Property 1: Touch events should be handled without errors
          expect(() => {
            fireEvent.touchStart(galleryContainer, {
              touches: [{ clientX: 100, clientY: 100 }],
            });
            
            fireEvent.touchMove(galleryContainer, {
              touches: [{ clientX: 200, clientY: 100 }],
            });
            
            fireEvent.touchEnd(galleryContainer);
          }).not.toThrow();

          return true;
        }),
        { numRuns: 15 }
      );
    });

    it('should provide accessible navigation for breadcrumb paths', () => {
      // Generator for valid breadcrumb items
      const breadcrumbItemArb = fc.record({
        label: fc.string({ minLength: 2, maxLength: 20 }).filter(s => s.trim().length > 0),
        href: fc.option(fc.constantFrom('/biography', '/works', '/scholars', '/')),
        isActive: fc.boolean(),
      });

      const breadcrumbItemsArb = fc.array(breadcrumbItemArb, { minLength: 2, maxLength: 4 });

      fc.assert(
        fc.property(breadcrumbItemsArb, (items) => {
          const { container } = render(
            React.createElement(Breadcrumb, { items })
          );

          // Property 1: Should render navigation element with proper aria-label
          const nav = container.querySelector('nav[aria-label="面包屑导航"]');
          expect(nav).toBeTruthy();

          // Property 2: All non-active items with href should be clickable links
          items.forEach((item) => {
            if (item.href && !item.isActive) {
              const links = container.querySelectorAll('a');
              const hasMatchingLink = Array.from(links).some(link => 
                link.getAttribute('href') === item.href && 
                link.textContent?.includes(item.label)
              );
              expect(hasMatchingLink).toBeTruthy();
            }
          });

          return true;
        }),
        { numRuns: 20 }
      );
    });

    it('should maintain interaction state consistency', () => {
      fc.assert(
        fc.property(imageArrayArb, fc.integer({ min: 0, max: 4 }), (images: ImageData[], initialIndex) => {
          const safeInitialIndex = Math.min(initialIndex, images.length - 1);
          const mockOnClose = jest.fn();
          
          const { container } = render(
            React.createElement(ImageGallery, {
              images,
              initialIndex: safeInitialIndex,
              onClose: mockOnClose,
            })
          );

          // Property 1: Image counter should reflect current state
          if (images.length > 1) {
            const counterElements = container.querySelectorAll('span');
            const counterElement = Array.from(counterElements).find(span => 
              span.textContent?.includes('/')
            );
            if (counterElement) {
              expect(counterElement.textContent).toContain(`${safeInitialIndex + 1} / ${images.length}`);
            }
          }

          // Property 2: Keyboard shortcuts help should be visible
          const helpText = container.querySelector('.absolute.top-4.left-4');
          expect(helpText).toBeTruthy();
          expect(helpText?.textContent).toContain('ESC: 关闭');

          return true;
        }),
        { numRuns: 15 }
      );
    });

    it('should provide consistent interaction feedback across different screen sizes', () => {
      fc.assert(
        fc.property(imageArrayArb, (images: ImageData[]) => {
          const mockOnClose = jest.fn();
          
          const { container } = render(
            React.createElement(ImageGallery, {
              images,
              initialIndex: 0,
              onClose: mockOnClose,
            })
          );

          // Property 1: Mobile-specific help text should be conditionally shown
          const helpContainer = container.querySelector('.absolute.top-4.left-4');
          expect(helpContainer).toBeTruthy();

          // Property 2: Responsive classes should be applied to interactive elements
          const thumbnailContainer = container.querySelector('.overflow-x-auto');
          if (thumbnailContainer && images.length > 1) {
            expect(thumbnailContainer).toHaveClass('scrollbar-hide');
          }

          // Property 3: Button sizes should be appropriate for touch interaction
          const buttons = container.querySelectorAll('button');
          buttons.forEach(button => {
            const hasMinTouchSize = button.classList.toString().includes('p-') || 
                                  button.classList.toString().includes('w-') ||
                                  button.classList.toString().includes('h-');
            expect(hasMinTouchSize).toBeTruthy();
          });

          return true;
        }),
        { numRuns: 15 }
      );
    });
  });
});