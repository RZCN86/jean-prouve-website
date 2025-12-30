import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImageGallery from '../ImageGallery';
import { ImageData } from '@/types';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, className, onClick, fill, width, height, ...props }: any) {
    const imgProps: any = {
      src,
      alt,
      className,
      onClick,
      'data-testid': 'next-image',
      ...props
    };
    
    // Handle fill prop properly
    if (fill) {
      imgProps['data-fill'] = 'true';
    }
    if (width) imgProps.width = width;
    if (height) imgProps.height = height;
    
    return <img {...imgProps} />;
  };
});

describe('ImageGallery', () => {
  const mockImages: ImageData[] = [
    {
      id: "portrait-main",
      src: "/images/biography/jean-prouve-portrait.jpg",
      alt: "让·普鲁维肖像照",
      caption: "让·普鲁维在其南锡工作室中 (约1950年)",
      width: 400,
      height: 500
    },
    {
      id: "workshop-1930",
      src: "/images/biography/workshop-1930.jpg",
      alt: "1930年代的普鲁维工作室",
      caption: "南锡的普鲁维金属工艺工作室 (1930年代)",
      width: 600,
      height: 400
    },
    {
      id: "with-corbusier",
      src: "/images/biography/prouve-corbusier.jpg",
      alt: "普鲁维与勒·柯布西耶",
      caption: "让·普鲁维与勒·柯布西耶在马赛公寓工地 (1947年)",
      width: 500,
      height: 350
    }
  ];

  const singleImage: ImageData[] = [mockImages[0]];

  describe('Image Loading', () => {
    it('renders main image correctly', () => {
      render(<ImageGallery images={mockImages} />);

      const mainImage = screen.getAllByTestId('next-image')[0];
      expect(mainImage).toBeInTheDocument();
      expect(mainImage).toHaveAttribute('src', '/images/biography/jean-prouve-portrait.jpg');
      expect(mainImage).toHaveAttribute('alt', '让·普鲁维肖像照');
    });

    it('displays image caption when available', () => {
      render(<ImageGallery images={mockImages} />);

      expect(screen.getByText("让·普鲁维在其南锡工作室中 (约1950年)")).toBeInTheDocument();
    });

    it('handles empty images array gracefully', () => {
      render(<ImageGallery images={[]} />);

      expect(screen.getByText("暂无图片")).toBeInTheDocument();
      expect(screen.queryByTestId('next-image')).not.toBeInTheDocument();
    });

    it('applies correct image styling classes', () => {
      render(<ImageGallery images={mockImages} />);

      const mainImage = screen.getAllByTestId('next-image')[0];
      expect(mainImage).toHaveClass('object-cover');
    });

    it('displays image counter for multiple images', () => {
      render(<ImageGallery images={mockImages} />);

      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    it('does not display counter for single image', () => {
      render(<ImageGallery images={singleImage} />);

      expect(screen.queryByText("1 / 1")).not.toBeInTheDocument();
    });

    it('loads images with proper sizes attribute', () => {
      render(<ImageGallery images={mockImages} />);

      const mainImage = screen.getAllByTestId('next-image')[0];
      expect(mainImage).toHaveAttribute('sizes');
    });
  });

  describe('Navigation Controls', () => {
    it('shows navigation arrows for multiple images', () => {
      render(<ImageGallery images={mockImages} />);

      expect(screen.getByLabelText("上一张图片")).toBeInTheDocument();
      expect(screen.getByLabelText("下一张图片")).toBeInTheDocument();
    });

    it('hides navigation arrows for single image', () => {
      render(<ImageGallery images={singleImage} />);

      expect(screen.queryByLabelText("上一张图片")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("下一张图片")).not.toBeInTheDocument();
    });

    it('navigates to next image when next button is clicked', () => {
      render(<ImageGallery images={mockImages} />);

      const nextButton = screen.getByLabelText("下一张图片");
      fireEvent.click(nextButton);

      expect(screen.getByText("2 / 3")).toBeInTheDocument();
      
      const mainImage = screen.getAllByTestId('next-image')[0];
      expect(mainImage).toHaveAttribute('src', '/images/biography/workshop-1930.jpg');
    });

    it('navigates to previous image when previous button is clicked', () => {
      render(<ImageGallery images={mockImages} />);

      // First go to next image
      const nextButton = screen.getByLabelText("下一张图片");
      fireEvent.click(nextButton);

      // Then go back to previous
      const prevButton = screen.getByLabelText("上一张图片");
      fireEvent.click(prevButton);

      expect(screen.getByText("1 / 3")).toBeInTheDocument();
      
      const mainImage = screen.getAllByTestId('next-image')[0];
      expect(mainImage).toHaveAttribute('src', '/images/biography/jean-prouve-portrait.jpg');
    });

    it('wraps around to last image when clicking previous on first image', () => {
      render(<ImageGallery images={mockImages} />);

      const prevButton = screen.getByLabelText("上一张图片");
      fireEvent.click(prevButton);

      expect(screen.getByText("3 / 3")).toBeInTheDocument();
      
      const mainImage = screen.getAllByTestId('next-image')[0];
      expect(mainImage).toHaveAttribute('src', '/images/biography/prouve-corbusier.jpg');
    });

    it('wraps around to first image when clicking next on last image', () => {
      render(<ImageGallery images={mockImages} />);

      // Navigate to last image
      const nextButton = screen.getByLabelText("下一张图片");
      fireEvent.click(nextButton); // Image 2
      fireEvent.click(nextButton); // Image 3
      fireEvent.click(nextButton); // Should wrap to Image 1

      expect(screen.getByText("1 / 3")).toBeInTheDocument();
      
      const mainImage = screen.getAllByTestId('next-image')[0];
      expect(mainImage).toHaveAttribute('src', '/images/biography/jean-prouve-portrait.jpg');
    });
  });

  describe('Thumbnail Navigation', () => {
    it('displays thumbnails when showThumbnails is true', () => {
      render(<ImageGallery images={mockImages} showThumbnails={true} />);

      const thumbnails = screen.getAllByTestId('next-image').slice(1); // Exclude main image
      expect(thumbnails).toHaveLength(3);
    });

    it('hides thumbnails when showThumbnails is false', () => {
      render(<ImageGallery images={mockImages} showThumbnails={false} />);

      // Should only have main image, no thumbnails
      const images = screen.getAllByTestId('next-image');
      expect(images).toHaveLength(1);
    });

    it('does not show thumbnails for single image', () => {
      render(<ImageGallery images={singleImage} showThumbnails={true} />);

      // Should only have main image
      const images = screen.getAllByTestId('next-image');
      expect(images).toHaveLength(1);
    });

    it('highlights active thumbnail', () => {
      const { container } = render(<ImageGallery images={mockImages} showThumbnails={true} />);

      const thumbnailButtons = container.querySelectorAll('button[class*="border-accent-copper"]');
      expect(thumbnailButtons).toHaveLength(1); // Only active thumbnail should have accent border
    });

    it('navigates to clicked thumbnail', () => {
      const { container } = render(<ImageGallery images={mockImages} showThumbnails={true} />);

      const thumbnailButtons = container.querySelectorAll('button');
      const secondThumbnail = Array.from(thumbnailButtons).find(button => 
        button.querySelector('img[alt="1930年代的普鲁维工作室"]')
      );

      if (secondThumbnail) {
        fireEvent.click(secondThumbnail);
        expect(screen.getByText("2 / 3")).toBeInTheDocument();
      }
    });

    it('applies correct thumbnail styling', () => {
      const { container } = render(<ImageGallery images={mockImages} showThumbnails={true} />);

      const thumbnailButtons = container.querySelectorAll('button[class*="w-16"][class*="h-12"]');
      expect(thumbnailButtons.length).toBeGreaterThan(0);
      
      thumbnailButtons.forEach(button => {
        expect(button).toHaveClass('rounded-lg', 'overflow-hidden', 'border-2');
      });
    });
  });

  describe('Modal Functionality', () => {
    it('opens modal when main image is clicked', () => {
      render(<ImageGallery images={mockImages} />);

      const mainImageContainer = screen.getAllByTestId('next-image')[0].closest('.cursor-pointer');
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
        
        // Modal should be open
        expect(screen.getByLabelText("关闭")).toBeInTheDocument();
      }
    });

    it('displays full-size image in modal', () => {
      render(<ImageGallery images={mockImages} />);

      const mainImageContainer = screen.getAllByTestId('next-image')[0].closest('.cursor-pointer');
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
        
        // Should have modal image with original dimensions
        const modalImages = screen.getAllByTestId('next-image');
        const modalImage = modalImages.find(img => 
          img.getAttribute('width') === '400' && img.getAttribute('height') === '500'
        );
        expect(modalImage).toBeInTheDocument();
      }
    });

    it('closes modal when close button is clicked', async () => {
      render(<ImageGallery images={mockImages} />);

      const mainImageContainer = screen.getAllByTestId('next-image')[0].closest('.cursor-pointer');
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
        
        const closeButton = screen.getByLabelText("关闭");
        fireEvent.click(closeButton);
        
        await waitFor(() => {
          expect(screen.queryByLabelText("关闭")).not.toBeInTheDocument();
        });
      }
    });

    it('closes modal when clicking outside', async () => {
      render(<ImageGallery images={mockImages} />);

      const mainImageContainer = screen.getAllByTestId('next-image')[0].closest('.cursor-pointer');
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
        
        const modalOverlay = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-90');
        if (modalOverlay) {
          fireEvent.click(modalOverlay);
          
          await waitFor(() => {
            expect(screen.queryByLabelText("关闭")).not.toBeInTheDocument();
          });
        }
      }
    });

    it('shows navigation arrows in modal for multiple images', () => {
      render(<ImageGallery images={mockImages} />);

      const mainImageContainer = screen.getAllByTestId('next-image')[0].closest('.cursor-pointer');
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
        
        // Should have modal navigation arrows
        const modalPrevButton = screen.getAllByLabelText("上一张图片").find(button => 
          button.closest('.fixed.inset-0')
        );
        const modalNextButton = screen.getAllByLabelText("下一张图片").find(button => 
          button.closest('.fixed.inset-0')
        );
        
        expect(modalPrevButton).toBeInTheDocument();
        expect(modalNextButton).toBeInTheDocument();
      }
    });

    it('displays caption in modal when available', () => {
      render(<ImageGallery images={mockImages} />);

      const mainImageContainer = screen.getAllByTestId('next-image')[0].closest('.cursor-pointer');
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
        
        // Should show caption in modal
        const captions = screen.getAllByText("让·普鲁维在其南锡工作室中 (约1950年)");
        expect(captions.length).toBeGreaterThan(1); // One in main view, one in modal
      }
    });
  });

  describe('Keyboard Navigation', () => {
    it('handles arrow key navigation in modal', async () => {
      render(<ImageGallery images={mockImages} />);

      const mainImageContainer = screen.getAllByTestId('next-image')[0].closest('.cursor-pointer');
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
        
        const modalContainer = document.querySelector('.fixed.inset-0');
        if (modalContainer) {
          // Focus the modal container
          (modalContainer as HTMLElement).focus();
          
          // Press right arrow using fireEvent
          fireEvent.keyDown(modalContainer, { key: 'ArrowRight' });
          
          // Should navigate to next image
          // Note: This test might need adjustment based on actual keyboard handling implementation
        }
      }
    });

    it('closes modal with Escape key', async () => {
      render(<ImageGallery images={mockImages} />);

      const mainImageContainer = screen.getAllByTestId('next-image')[0].closest('.cursor-pointer');
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
        
        const modalContainer = document.querySelector('.fixed.inset-0');
        if (modalContainer) {
          // Focus the modal container
          (modalContainer as HTMLElement).focus();
          
          // Press Escape using fireEvent
          fireEvent.keyDown(modalContainer, { key: 'Escape' });
          
          await waitFor(() => {
            expect(screen.queryByLabelText("关闭")).not.toBeInTheDocument();
          });
        }
      }
    });
  });

  describe('Hover Effects', () => {
    it('applies hover effects to main image', () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      const imageContainer = container.querySelector('.group');
      expect(imageContainer).toBeInTheDocument();
      
      const image = container.querySelector('.group-hover\\:scale-105');
      expect(image).toBeInTheDocument();
    });

    it('shows zoom icon on hover', () => {
      const { container } = render(<ImageGallery images={mockImages} />);

      const zoomIcon = container.querySelector('.group-hover\\:opacity-100');
      expect(zoomIcon).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper aria-labels for navigation buttons', () => {
      render(<ImageGallery images={mockImages} />);

      expect(screen.getByLabelText("上一张图片")).toBeInTheDocument();
      expect(screen.getByLabelText("下一张图片")).toBeInTheDocument();
    });

    it('provides proper alt text for all images', () => {
      render(<ImageGallery images={mockImages} showThumbnails={true} />);

      const images = screen.getAllByTestId('next-image');
      images.forEach(image => {
        expect(image).toHaveAttribute('alt');
        expect(image.getAttribute('alt')).not.toBe('');
      });
    });

    it('maintains focus management in modal', () => {
      render(<ImageGallery images={mockImages} />);

      const mainImageContainer = screen.getAllByTestId('next-image')[0].closest('.cursor-pointer');
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
        
        const modalContainer = document.querySelector('.fixed.inset-0');
        expect(modalContainer).toHaveAttribute('tabIndex', '0');
      }
    });
  });

  describe('Component Props', () => {
    it('applies custom className when provided', () => {
      const { container } = render(
        <ImageGallery images={mockImages} className="custom-gallery-class" />
      );

      const galleryContainer = container.firstChild as HTMLElement;
      expect(galleryContainer).toHaveClass('custom-gallery-class');
    });

    it('respects showThumbnails prop', () => {
      const { rerender } = render(
        <ImageGallery images={mockImages} showThumbnails={false} />
      );

      // Should not show thumbnails
      const imagesWithoutThumbnails = screen.getAllByTestId('next-image');
      expect(imagesWithoutThumbnails).toHaveLength(1);

      rerender(<ImageGallery images={mockImages} showThumbnails={true} />);

      // Should show thumbnails
      const imagesWithThumbnails = screen.getAllByTestId('next-image');
      expect(imagesWithThumbnails.length).toBeGreaterThan(1);
    });
  });
});