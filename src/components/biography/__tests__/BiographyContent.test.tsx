import React from 'react';
import { render, screen } from '@testing-library/react';
import BiographyContent from '../BiographyContent';
import { BiographyContent as BiographyContentType, ImageData } from '@/types';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, className, fill, width, height, ...props }: any) {
    const imgProps: any = {
      src,
      alt,
      className,
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

describe('BiographyContent', () => {
  const mockBiographyContent: BiographyContentType = {
    personalInfo: {
      fullName: "让·普鲁维 (Jean Prouvé)",
      birthDate: "1901年4月8日",
      deathDate: "1984年3月23日",
      birthPlace: "法国巴黎",
      nationality: "法国",
      family: [
        {
          name: "维克多·普鲁维 (Victor Prouvé)",
          relationship: "父亲",
          description: "艺术家、南锡学派创始人之一"
        }
      ]
    },
    education: [
      {
        institution: "南锡工艺美术学校",
        degree: "金属工艺专业",
        period: "1916-1919",
        location: "法国南锡",
        description: "学习传统金属工艺和现代设计理念"
      }
    ],
    career: [
      {
        position: "金属工艺师学徒",
        organization: "埃米尔·罗伯特工作室",
        period: "1914-1916",
        location: "法国南锡",
        achievements: ["学习传统锻造技术", "掌握金属装饰工艺"]
      }
    ],
    philosophy: [
      {
        theme: "工业化与人性化的结合",
        content: "建筑应该像机器一样精确，但必须为人类服务。",
        source: "《建筑与工业》",
        year: 1946
      }
    ],
    collaborations: [
      {
        collaborator: "勒·柯布西耶 (Le Corbusier)",
        project: "马赛公寓单元",
        period: "1945-1952",
        description: "为马赛公寓设计预制混凝土构件",
        outcome: "成功实现大规模住宅的工业化建造"
      }
    ],
    legacy: [
      {
        category: "influence",
        title: "现代预制建筑",
        description: "影响了全球预制建筑技术的发展",
        year: 1960
      }
    ]
  };

  const mockImages: ImageData[] = [
    {
      id: "portrait-main",
      src: "/images/biography/jean-prouve-portrait.jpg",
      alt: "让·普鲁维肖像照",
      caption: "让·普鲁维在其南锡工作室中 (约1950年)",
      width: 400,
      height: 500
    }
  ];

  describe('Content Formatting', () => {
    it('renders personal information section correctly', () => {
      render(<BiographyContent content={mockBiographyContent} images={mockImages} />);

      expect(screen.getByText("让·普鲁维 (Jean Prouvé)")).toBeInTheDocument();
      expect(screen.getByText("1901年4月8日")).toBeInTheDocument();
      expect(screen.getByText("1984年3月23日")).toBeInTheDocument();
      expect(screen.getByText("法国巴黎")).toBeInTheDocument();
      expect(screen.getByText("法国")).toBeInTheDocument();
    });

    it('formats family information correctly', () => {
      render(<BiographyContent content={mockBiographyContent} images={mockImages} />);

      expect(screen.getByText("维克多·普鲁维 (Victor Prouvé)")).toBeInTheDocument();
      expect(screen.getByText(/父亲/)).toBeInTheDocument();
      expect(screen.getByText(/艺术家、南锡学派创始人之一/)).toBeInTheDocument();
    });

    it('renders education section with proper formatting', () => {
      render(<BiographyContent content={mockBiographyContent} images={mockImages} />);

      expect(screen.getByText("教育背景")).toBeInTheDocument();
      expect(screen.getByText("南锡工艺美术学校")).toBeInTheDocument();
      expect(screen.getByText("金属工艺专业")).toBeInTheDocument();
      expect(screen.getByText("1916-1919")).toBeInTheDocument();
      expect(screen.getByText("法国南锡")).toBeInTheDocument();
      expect(screen.getByText("学习传统金属工艺和现代设计理念")).toBeInTheDocument();
    });

    it('displays career milestones with achievements', () => {
      render(<BiographyContent content={mockBiographyContent} images={mockImages} />);

      expect(screen.getByText("职业生涯")).toBeInTheDocument();
      expect(screen.getByText("金属工艺师学徒")).toBeInTheDocument();
      expect(screen.getByText("埃米尔·罗伯特工作室 - 法国南锡")).toBeInTheDocument();
      expect(screen.getByText("学习传统锻造技术")).toBeInTheDocument();
      expect(screen.getByText("掌握金属装饰工艺")).toBeInTheDocument();
    });

    it('formats philosophy statements correctly', () => {
      render(<BiographyContent content={mockBiographyContent} images={mockImages} />);

      expect(screen.getByText("设计理念")).toBeInTheDocument();
      expect(screen.getByText("工业化与人性化的结合")).toBeInTheDocument();
      expect(screen.getByText(/建筑应该像机器一样精确，但必须为人类服务/)).toBeInTheDocument();
      expect(screen.getByText(/《建筑与工业》.*1946/)).toBeInTheDocument();
    });

    it('displays collaborations with proper structure', () => {
      render(<BiographyContent content={mockBiographyContent} images={mockImages} />);

      expect(screen.getByText("重要合作")).toBeInTheDocument();
      expect(screen.getByText("勒·柯布西耶 (Le Corbusier)")).toBeInTheDocument();
      expect(screen.getByText("马赛公寓单元")).toBeInTheDocument();
      expect(screen.getByText("为马赛公寓设计预制混凝土构件")).toBeInTheDocument();
      expect(screen.getByText("结果: 成功实现大规模住宅的工业化建造")).toBeInTheDocument();
    });

    it('organizes legacy items by category', () => {
      render(<BiographyContent content={mockBiographyContent} images={mockImages} />);

      expect(screen.getByText("影响与遗产")).toBeInTheDocument();
      expect(screen.getByText("影响力")).toBeInTheDocument();
      expect(screen.getByText("现代预制建筑")).toBeInTheDocument();
      expect(screen.getByText("(1960)")).toBeInTheDocument();
      expect(screen.getByText("影响了全球预制建筑技术的发展")).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const { container } = render(
        <BiographyContent 
          content={mockBiographyContent} 
          images={mockImages} 
          className="custom-class" 
        />
      );

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('custom-class');
    });

    it('handles empty sections gracefully', () => {
      const emptyContent: BiographyContentType = {
        ...mockBiographyContent,
        education: [],
        career: [],
        philosophy: [],
        collaborations: [],
        legacy: []
      };

      render(<BiographyContent content={emptyContent} images={mockImages} />);

      // Should still render personal info
      expect(screen.getByText("让·普鲁维 (Jean Prouvé)")).toBeInTheDocument();
      
      // Should not render empty sections
      expect(screen.queryByText("教育背景")).not.toBeInTheDocument();
      expect(screen.queryByText("职业生涯")).not.toBeInTheDocument();
      expect(screen.queryByText("设计理念")).not.toBeInTheDocument();
      expect(screen.queryByText("重要合作")).not.toBeInTheDocument();
      expect(screen.queryByText("影响与遗产")).not.toBeInTheDocument();
    });
  });

  describe('Image Loading', () => {
    it('renders portrait image when images are provided', () => {
      render(<BiographyContent content={mockBiographyContent} images={mockImages} />);

      const image = screen.getByTestId('next-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/images/biography/jean-prouve-portrait.jpg');
      expect(image).toHaveAttribute('alt', '让·普鲁维肖像照');
    });

    it('handles empty images array gracefully', () => {
      render(<BiographyContent content={mockBiographyContent} images={[]} />);

      expect(screen.queryByTestId('next-image')).not.toBeInTheDocument();
      // Should still render content
      expect(screen.getByText("让·普鲁维 (Jean Prouvé)")).toBeInTheDocument();
    });

    it('applies correct image styling classes', () => {
      render(<BiographyContent content={mockBiographyContent} images={mockImages} />);

      const image = screen.getByTestId('next-image');
      expect(image).toHaveClass('object-cover');
    });

    it('uses proper image container structure', () => {
      const { container } = render(
        <BiographyContent content={mockBiographyContent} images={mockImages} />
      );

      const imageContainer = container.querySelector('.relative.w-64.h-80');
      expect(imageContainer).toBeInTheDocument();
      expect(imageContainer).toHaveClass('rounded-lg', 'overflow-hidden', 'shadow-md');
    });
  });

  describe('Responsive Layout', () => {
    it('applies responsive grid classes for personal info section', () => {
      const { container } = render(
        <BiographyContent content={mockBiographyContent} images={mockImages} />
      );

      const gridContainer = container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2');
      expect(gridContainer).toBeInTheDocument();
    });

    it('applies responsive classes for collaborations grid', () => {
      const { container } = render(
        <BiographyContent content={mockBiographyContent} images={mockImages} />
      );

      const collabGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
      expect(collabGrid).toBeInTheDocument();
    });

    it('applies responsive classes for legacy grid', () => {
      const { container } = render(
        <BiographyContent content={mockBiographyContent} images={mockImages} />
      );

      const legacyGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
      expect(legacyGrid).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses proper heading hierarchy', () => {
      render(<BiographyContent content={mockBiographyContent} images={mockImages} />);

      // Main name should be h2
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent("让·普鲁维 (Jean Prouvé)");

      // Section headings should be h3
      const sectionHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(sectionHeadings.length).toBeGreaterThan(0);
    });

    it('provides semantic structure with sections', () => {
      const { container } = render(
        <BiographyContent content={mockBiographyContent} images={mockImages} />
      );

      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThan(0);
    });

    it('uses proper list structure for achievements', () => {
      render(<BiographyContent content={mockBiographyContent} images={mockImages} />);

      const achievementsList = screen.getByRole('list');
      expect(achievementsList).toBeInTheDocument();
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBe(2); // Two achievements in mock data
    });
  });
});