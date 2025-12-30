import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InfluenceAnalysis from '../InfluenceAnalysis';
import { ArchitecturalWork, WorkCategory, ContemporaryInfluence } from '@/types';

describe('InfluenceAnalysis', () => {
  const mockWorkCategory: WorkCategory = {
    id: 'residential',
    name: '住宅建筑',
    description: '住宅项目'
  };

  const mockContemporaryInfluence: ContemporaryInfluence = {
    id: 'influence-1',
    workId: 'test-work',
    title: '当代建筑影响分析',
    description: '这个项目对当代建筑产生了深远的影响，特别是在预制建筑和可持续设计方面。',
    influencedWorks: ['现代预制住宅项目', '可持续建筑示范区', '工业化建筑群'],
    influencedArchitects: ['张建筑师', '李设计师', '王工程师'],
    modernApplications: ['装配式建筑', '绿色建筑技术', '智能建造系统'],
    relevanceToday: '在当今快速城市化和环保要求日益严格的背景下，该项目的设计理念和技术创新仍具有重要的指导意义。',
    author: '影响研究专家',
    date: '2023-08-15'
  };

  const mockWork: ArchitecturalWork = {
    id: 'test-work',
    title: '测试建筑项目',
    year: 1950,
    location: '法国巴黎',
    category: mockWorkCategory,
    description: '测试用建筑项目描述',
    images: [],
    technicalDrawings: [],
    specifications: [],
    commentary: {
      id: 'comment-1',
      title: '基础评论',
      content: '基础评论内容',
      author: '评论者',
      type: 'technical'
    },
    contemporaryInfluence: mockContemporaryInfluence,
    status: 'existing'
  };

  describe('Component Rendering', () => {
    it('renders component with header correctly', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      expect(screen.getByText('影响分析')).toBeInTheDocument();
      expect(screen.getByText('探索 测试建筑项目 对建筑发展的深远影响')).toBeInTheDocument();
    });

    it('displays navigation tabs correctly', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      expect(screen.getByText('当代影响')).toBeInTheDocument();
      expect(screen.getByText('历史传承')).toBeInTheDocument();
      expect(screen.getByText('全球影响')).toBeInTheDocument();
    });

    it('shows contemporary influence by default', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      expect(screen.getByText('当代建筑影响分析')).toBeInTheDocument();
      expect(screen.getByText('影响研究专家')).toBeInTheDocument();
      expect(screen.getByText('这个项目对当代建筑产生了深远的影响，特别是在预制建筑和可持续设计方面。')).toBeInTheDocument();
    });
  });

  describe('Contemporary Influence Section', () => {
    it('displays contemporary influence content correctly', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      expect(screen.getByText('当代建筑影响分析')).toBeInTheDocument();
      expect(screen.getByText('影响研究专家')).toBeInTheDocument();
      expect(screen.getByText('2023年8月15日')).toBeInTheDocument();
    });

    it('shows influenced works section', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      expect(screen.getByText('影响的作品')).toBeInTheDocument();
      expect(screen.getByText('现代预制住宅项目')).toBeInTheDocument();
      expect(screen.getByText('可持续建筑示范区')).toBeInTheDocument();
      expect(screen.getByText('工业化建筑群')).toBeInTheDocument();
    });

    it('displays influenced architects section', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      expect(screen.getByText('影响的建筑师')).toBeInTheDocument();
      expect(screen.getByText('张建筑师')).toBeInTheDocument();
      expect(screen.getByText('李设计师')).toBeInTheDocument();
      expect(screen.getByText('王工程师')).toBeInTheDocument();
    });

    it('shows modern applications section', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      expect(screen.getByText('现代应用')).toBeInTheDocument();
      expect(screen.getByText('装配式建筑')).toBeInTheDocument();
      expect(screen.getByText('绿色建筑技术')).toBeInTheDocument();
      expect(screen.getByText('智能建造系统')).toBeInTheDocument();
    });

    it('displays contemporary relevance section', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      expect(screen.getByText('当代相关性')).toBeInTheDocument();
      expect(screen.getByText('在当今快速城市化和环保要求日益严格的背景下，该项目的设计理念和技术创新仍具有重要的指导意义。')).toBeInTheDocument();
    });

    it('handles missing contemporary influence gracefully', () => {
      const workWithoutInfluence = { ...mockWork, contemporaryInfluence: undefined };
      render(<InfluenceAnalysis work={workWithoutInfluence} />);

      // Should still render the component but without contemporary content
      expect(screen.getByText('影响分析')).toBeInTheDocument();
    });
  });

  describe('Historical Influence Section', () => {
    it('switches to historical section correctly', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('历史传承'));

      expect(screen.getByText('历史传承与发展')).toBeInTheDocument();
      expect(screen.getByText('影响时间线')).toBeInTheDocument();
    });

    it('displays historical timeline', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('历史传承'));

      expect(screen.getByText('50s')).toBeInTheDocument();
      expect(screen.getByText('初期影响 (1950年代)')).toBeInTheDocument();
      expect(screen.getByText('项目完成后立即引起建筑界关注，成为预制建筑的典型案例')).toBeInTheDocument();
    });

    it('shows theoretical and technical impact categories', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('历史传承'));

      expect(screen.getByText('建筑理论影响')).toBeInTheDocument();
      expect(screen.getByText('技术发展影响')).toBeInTheDocument();
      expect(screen.getByText('推动了建筑工业化理论的发展')).toBeInTheDocument();
      expect(screen.getByText('预制构件连接技术的标准化')).toBeInTheDocument();
    });
  });

  describe('Global Influence Section', () => {
    it('switches to global section correctly', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('全球影响'));

      expect(screen.getByText('全球影响范围')).toBeInTheDocument();
      expect(screen.getByText('地区影响分布')).toBeInTheDocument();
    });

    it('displays regional influence cards', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('全球影响'));

      expect(screen.getByText('欧洲')).toBeInTheDocument();
      expect(screen.getByText('北美')).toBeInTheDocument();
      expect(screen.getByText('亚洲')).toBeInTheDocument();
      expect(screen.getByText('拉丁美洲')).toBeInTheDocument();
      expect(screen.getByText('非洲')).toBeInTheDocument();
      expect(screen.getByText('大洋洲')).toBeInTheDocument();
    });

    it('shows global impact metrics', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('全球影响'));

      expect(screen.getByText('全球影响指标')).toBeInTheDocument();
      expect(screen.getByText('500+')).toBeInTheDocument(); // influenced projects
      expect(screen.getByText('45+')).toBeInTheDocument(); // countries
      expect(screen.getByText('200+')).toBeInTheDocument(); // architects
      expect(screen.getByText('150+')).toBeInTheDocument(); // publications
    });

    it('displays cross-cultural adaptations', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('全球影响'));

      expect(screen.getByText('跨文化适应')).toBeInTheDocument();
      expect(screen.getByText('日本')).toBeInTheDocument();
      expect(screen.getByText('中国')).toBeInTheDocument();
      expect(screen.getByText('北欧')).toBeInTheDocument();
    });

    it('shows adoption levels correctly', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('全球影响'));

      expect(screen.getAllByText('高度影响')).toHaveLength(2);
      expect(screen.getAllByText('中等影响').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('轻微影响')).toBeInTheDocument();
    });
  });

  describe('Navigation and Interaction', () => {
    it('highlights active tab correctly', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      const contemporaryTab = screen.getByRole('button', { name: /🌟 当代影响/ });
      const historicalTab = screen.getByRole('button', { name: /📚 历史传承/ });

      expect(contemporaryTab).toHaveClass('border-accent-copper', 'text-accent-copper');
      expect(historicalTab).not.toHaveClass('border-accent-copper', 'text-accent-copper');

      fireEvent.click(historicalTab);

      expect(historicalTab).toHaveClass('border-accent-copper', 'text-accent-copper');
      expect(contemporaryTab).not.toHaveClass('border-accent-copper', 'text-accent-copper');
    });

    it('switches content when tabs are clicked', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      // Initially shows contemporary
      expect(screen.getByText('当代建筑影响分析')).toBeInTheDocument();

      // Switch to historical
      fireEvent.click(screen.getByText('历史传承'));
      expect(screen.getByText('影响时间线')).toBeInTheDocument();
      expect(screen.queryByText('当代建筑影响分析')).not.toBeInTheDocument();

      // Switch to global
      fireEvent.click(screen.getByText('全球影响'));
      expect(screen.getByText('地区影响分布')).toBeInTheDocument();
      expect(screen.queryByText('影响时间线')).not.toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('formats dates correctly in Chinese locale', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      expect(screen.getByText('2023年8月15日')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive grid classes', () => {
      const { container } = render(<InfluenceAnalysis work={mockWork} />);

      const gridContainers = container.querySelectorAll('.grid.grid-cols-1.lg\\:grid-cols-2');
      expect(gridContainers.length).toBeGreaterThan(0);
    });

    it('applies responsive classes for regional cards', () => {
      const { container } = render(<InfluenceAnalysis work={mockWork} />);
      
      fireEvent.click(screen.getAllByText('全球影响')[0]);

      const regionalGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
      expect(regionalGrid).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses proper button roles for navigation', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      const tabs = screen.getAllByRole('button');
      expect(tabs.length).toBe(3); // Three navigation tabs
    });

    it('provides proper heading hierarchy', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('影响分析');

      const sectionHeading = screen.getByRole('heading', { level: 3 });
      expect(sectionHeading).toBeInTheDocument();
    });

    it('uses semantic list structure where appropriate', () => {
      render(<InfluenceAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('历史传承'));

      const lists = screen.getAllByRole('list');
      expect(lists.length).toBeGreaterThan(0);
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className when provided', () => {
      const { container } = render(
        <InfluenceAnalysis work={mockWork} className="custom-influence-class" />
      );

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('custom-influence-class');
    });

    it('applies default styling classes', () => {
      const { container } = render(<InfluenceAnalysis work={mockWork} />);

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('bg-white', 'rounded-lg', 'shadow-md');
    });
  });

  describe('Error Handling', () => {
    it('handles work without contemporary influence', () => {
      const workWithoutInfluence = { ...mockWork, contemporaryInfluence: undefined };
      
      render(<InfluenceAnalysis work={workWithoutInfluence} />);

      expect(screen.getByText('影响分析')).toBeInTheDocument();
      // Should still show other sections
      fireEvent.click(screen.getByText('历史传承'));
      expect(screen.getByText('历史传承与发展')).toBeInTheDocument();
    });

    it('handles empty influence arrays gracefully', () => {
      const workWithEmptyInfluence = {
        ...mockWork,
        contemporaryInfluence: {
          ...mockContemporaryInfluence,
          influencedWorks: [],
          influencedArchitects: [],
          modernApplications: []
        }
      };

      render(<InfluenceAnalysis work={workWithEmptyInfluence} />);

      expect(screen.getByText('当代建筑影响分析')).toBeInTheDocument();
      // Should not show empty sections
      expect(screen.queryByText('影响的作品')).not.toBeInTheDocument();
      expect(screen.queryByText('影响的建筑师')).not.toBeInTheDocument();
      expect(screen.queryByText('现代应用')).not.toBeInTheDocument();
    });
  });
});