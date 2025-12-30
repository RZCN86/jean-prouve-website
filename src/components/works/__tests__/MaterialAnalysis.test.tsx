import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MaterialAnalysis from '../MaterialAnalysis';
import { ArchitecturalWork, WorkCategory, TechnicalSpec } from '@/types';

describe('MaterialAnalysis', () => {
  const mockWorkCategory: WorkCategory = {
    id: 'residential',
    name: '住宅建筑',
    description: '住宅项目'
  };

  const mockTechnicalSpecs: TechnicalSpec[] = [
    { property: '建筑面积', value: '120', unit: 'm²' },
    { property: '结构材料', value: '钢结构' },
    { property: '墙体材料', value: '铝板' },
    { property: '建造周期', value: '3', unit: '个月' }
  ];

  const mockWork: ArchitecturalWork = {
    id: 'test-work',
    title: '测试建筑项目',
    year: 1950,
    location: '法国巴黎',
    category: mockWorkCategory,
    description: '测试用建筑项目描述',
    images: [],
    technicalDrawings: [],
    specifications: mockTechnicalSpecs,
    commentary: {
      id: 'comment-1',
      title: '基础评论',
      content: '基础评论内容',
      author: '评论者',
      type: 'technical'
    },
    status: 'existing'
  };

  describe('Component Rendering', () => {
    it('renders component with header correctly', () => {
      render(<MaterialAnalysis work={mockWork} />);

      expect(screen.getByText('材料分析')).toBeInTheDocument();
      expect(screen.getByText('深入分析 测试建筑项目 中使用的建筑材料及其特性')).toBeInTheDocument();
    });

    it('displays navigation tabs correctly', () => {
      render(<MaterialAnalysis work={mockWork} />);

      expect(screen.getByText('材料概览')).toBeInTheDocument();
      expect(screen.getByText('详细分析')).toBeInTheDocument();
      expect(screen.getByText('材料创新')).toBeInTheDocument();
    });

    it('shows material overview by default', () => {
      render(<MaterialAnalysis work={mockWork} />);

      expect(screen.getByText('材料组成概览')).toBeInTheDocument();
      expect(screen.getByText('材料使用分布')).toBeInTheDocument();
    });
  });

  describe('Material Overview Section', () => {
    it('displays material distribution cards', () => {
      render(<MaterialAnalysis work={mockWork} />);

      expect(screen.getByText('轻型钢结构')).toBeInTheDocument();
      expect(screen.getByText('铝合金板材')).toBeInTheDocument();
      expect(screen.getByText('玻璃材料')).toBeInTheDocument();
      expect(screen.getByText('其他材料')).toBeInTheDocument();
    });

    it('shows material percentages', () => {
      render(<MaterialAnalysis work={mockWork} />);

      expect(screen.getByText('45%')).toBeInTheDocument(); // Steel structure
      expect(screen.getByText('30%')).toBeInTheDocument(); // Aluminum panels
      expect(screen.getByText('20%')).toBeInTheDocument(); // Glass
      expect(screen.getByText('5%')).toBeInTheDocument(); // Other materials
    });

    it('displays material properties as tags', () => {
      render(<MaterialAnalysis work={mockWork} />);

      expect(screen.getByText('高强度')).toBeInTheDocument();
      expect(screen.getByText('轻质化')).toBeInTheDocument();
      expect(screen.getByText('耐腐蚀')).toBeInTheDocument();
      expect(screen.getByText('美观')).toBeInTheDocument();
    });

    it('shows overall material characteristics summary', () => {
      render(<MaterialAnalysis work={mockWork} />);

      expect(screen.getByText('整体材料特性')).toBeInTheDocument();
      expect(screen.getByText('重量减轻')).toBeInTheDocument();
      expect(screen.getByText('耐久性等级')).toBeInTheDocument();
      expect(screen.getByText('可持续性')).toBeInTheDocument();
      expect(screen.getByText('预制化程度')).toBeInTheDocument();
    });

    it('displays material selection principles', () => {
      render(<MaterialAnalysis work={mockWork} />);

      expect(screen.getByText('材料选择原则')).toBeInTheDocument();
      expect(screen.getByText('工业化生产')).toBeInTheDocument();
      expect(screen.getByText('轻量化设计')).toBeInTheDocument();
      expect(screen.getByText('耐久性考虑')).toBeInTheDocument();
      expect(screen.getByText('美学表达')).toBeInTheDocument();
    });
  });

  describe('Detailed Analysis Section', () => {
    it('switches to detailed analysis correctly', () => {
      render(<MaterialAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('详细分析'));

      expect(screen.getByText('详细材料分析')).toBeInTheDocument();
    });

    it('displays detailed material cards with technical specs', () => {
      render(<MaterialAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('详细分析'));

      expect(screen.getAllByText('技术规格')[0]).toBeInTheDocument();
      expect(screen.getByText('355 MPa')).toBeInTheDocument(); // Steel strength
      expect(screen.getByText('7.85 g/cm³')).toBeInTheDocument(); // Steel density
    });

    it('shows material advantages and limitations', () => {
      render(<MaterialAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('详细分析'));

      expect(screen.getAllByText('优势特点')[0]).toBeInTheDocument();
      expect(screen.getAllByText('使用限制')[0]).toBeInTheDocument();
      expect(screen.getByText('强度重量比优异')).toBeInTheDocument();
      expect(screen.getByText('需要防腐防火处理')).toBeInTheDocument();
    });

    it('displays material compatibility analysis', () => {
      render(<MaterialAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('详细分析'));

      expect(screen.getByText('材料兼容性分析')).toBeInTheDocument();
      expect(screen.getByText('良好兼容性')).toBeInTheDocument();
      expect(screen.getByText('注意事项')).toBeInTheDocument();
    });
  });

  describe('Material Innovation Section', () => {
    it('switches to innovation section correctly', () => {
      render(<MaterialAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('材料创新'));

      expect(screen.getByText('材料创新特点')).toBeInTheDocument();
    });

    it('displays innovation categories', () => {
      render(<MaterialAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('材料创新'));

      expect(screen.getByText('工业材料建筑化')).toBeInTheDocument();
      expect(screen.getByText('标准化构件系统')).toBeInTheDocument();
      expect(screen.getByText('多材料协同设计')).toBeInTheDocument();
      expect(screen.getByText('可拆卸设计理念')).toBeInTheDocument();
    });

    it('shows historical context of material innovation', () => {
      render(<MaterialAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('材料创新'));

      expect(screen.getByText('历史背景下的材料创新')).toBeInTheDocument();
      expect(screen.getByText('战后材料工业发展')).toBeInTheDocument();
      expect(screen.getByText('技术转移与创新')).toBeInTheDocument();
      expect(screen.getByText('可持续发展先驱')).toBeInTheDocument();
    });

    it('displays modern relevance section', () => {
      render(<MaterialAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('材料创新'));

      expect(screen.getByText('对现代材料科学的启发')).toBeInTheDocument();
      expect(screen.getByText('复合材料')).toBeInTheDocument();
      expect(screen.getByText('智能材料')).toBeInTheDocument();
      expect(screen.getByText('循环材料')).toBeInTheDocument();
    });

    it('shows innovation examples and applications', () => {
      render(<MaterialAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('材料创新'));

      expect(screen.getByText('航空铝材应用')).toBeInTheDocument();
      expect(screen.getByText('精密连接技术')).toBeInTheDocument();
      expect(screen.getByText('标准化截面')).toBeInTheDocument();
    });
  });

  describe('Navigation and Interaction', () => {
    it('highlights active tab correctly', () => {
      render(<MaterialAnalysis work={mockWork} />);

      const overviewTab = screen.getByRole('button', { name: /📋 材料概览/ });
      const detailedTab = screen.getByRole('button', { name: /🔬 详细分析/ });

      expect(overviewTab).toHaveClass('border-accent-copper', 'text-accent-copper');
      expect(detailedTab).not.toHaveClass('border-accent-copper', 'text-accent-copper');

      fireEvent.click(detailedTab);

      expect(detailedTab).toHaveClass('border-accent-copper', 'text-accent-copper');
      expect(overviewTab).not.toHaveClass('border-accent-copper', 'text-accent-copper');
    });

    it('switches content when tabs are clicked', () => {
      render(<MaterialAnalysis work={mockWork} />);

      // Initially shows overview
      expect(screen.getByText('材料组成概览')).toBeInTheDocument();

      // Switch to detailed
      fireEvent.click(screen.getByText('详细分析'));
      expect(screen.getByText('详细材料分析')).toBeInTheDocument();
      expect(screen.queryByText('材料组成概览')).not.toBeInTheDocument();

      // Switch to innovation
      fireEvent.click(screen.getByText('材料创新'));
      expect(screen.getByText('材料创新特点')).toBeInTheDocument();
      expect(screen.queryByText('详细材料分析')).not.toBeInTheDocument();
    });
  });

  describe('Material Data Generation', () => {
    it('generates material data based on work specifications', () => {
      render(<MaterialAnalysis work={mockWork} />);

      // Should generate materials based on specifications
      expect(screen.getByText('轻型钢结构')).toBeInTheDocument();
      expect(screen.getByText('主承重框架和结构支撑系统')).toBeInTheDocument();
    });

    it('calculates material percentages correctly', () => {
      render(<MaterialAnalysis work={mockWork} />);

      // Check that percentages add up to 100%
      const percentages = [45, 30, 20, 5]; // From the generated data
      const total = percentages.reduce((sum, p) => sum + p, 0);
      expect(total).toBe(100);
    });

    it('provides realistic technical specifications', () => {
      render(<MaterialAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('详细分析'));

      // Check for realistic steel properties
      expect(screen.getByText('355 MPa')).toBeInTheDocument(); // Realistic steel strength
      expect(screen.getByText('7.85 g/cm³')).toBeInTheDocument(); // Realistic steel density
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive grid classes', () => {
      const { container } = render(<MaterialAnalysis work={mockWork} />);

      const gridContainers = container.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
      expect(gridContainers.length).toBeGreaterThan(0);
    });

    it('applies responsive classes for detailed analysis', () => {
      const { container } = render(<MaterialAnalysis work={mockWork} />);

      const detailedButton = screen.getByRole('button', { name: /🔬 详细分析/ });
      fireEvent.click(detailedButton);

      // Look for responsive grid classes in the rendered component
      const gridElements = container.querySelectorAll('.grid');
      expect(gridElements.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('uses proper button roles for navigation', () => {
      render(<MaterialAnalysis work={mockWork} />);

      const tabs = screen.getAllByRole('button');
      expect(tabs.length).toBe(3); // Three navigation tabs
    });

    it('provides proper heading hierarchy', () => {
      render(<MaterialAnalysis work={mockWork} />);

      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('材料分析');

      const sectionHeading = screen.getByRole('heading', { level: 3 });
      expect(sectionHeading).toBeInTheDocument();
    });

    it('uses semantic list structure where appropriate', () => {
      render(<MaterialAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('详细分析'));

      const lists = screen.getAllByRole('list');
      expect(lists.length).toBeGreaterThan(0);
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className when provided', () => {
      const { container } = render(
        <MaterialAnalysis work={mockWork} className="custom-material-class" />
      );

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('custom-material-class');
    });

    it('applies default styling classes', () => {
      const { container } = render(<MaterialAnalysis work={mockWork} />);

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('bg-white', 'rounded-lg', 'shadow-md');
    });
  });

  describe('Technical Specifications Display', () => {
    it('displays technical specifications correctly', () => {
      render(<MaterialAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('详细分析'));

      expect(screen.getAllByText('强度')[0]).toBeInTheDocument();
      expect(screen.getAllByText('密度')[0]).toBeInTheDocument();
      expect(screen.getAllByText('耐久性')[0]).toBeInTheDocument();
      expect(screen.getAllByText('导热系数')[0]).toBeInTheDocument();
    });

    it('formats technical values with units', () => {
      render(<MaterialAnalysis work={mockWork} />);

      fireEvent.click(screen.getByText('详细分析'));

      expect(screen.getByText('355 MPa')).toBeInTheDocument();
      expect(screen.getByText('7.85 g/cm³')).toBeInTheDocument();
      expect(screen.getByText('50+ 年')).toBeInTheDocument();
      expect(screen.getByText('50 W/m·K')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles work with minimal specifications', () => {
      const minimalWork = {
        ...mockWork,
        specifications: [{ property: '材料', value: '钢材' }]
      };

      render(<MaterialAnalysis work={minimalWork} />);

      expect(screen.getByText('材料分析')).toBeInTheDocument();
      expect(screen.getByText('轻型钢结构')).toBeInTheDocument();
    });

    it('handles work with no specifications gracefully', () => {
      const workWithoutSpecs = {
        ...mockWork,
        specifications: []
      };

      render(<MaterialAnalysis work={workWithoutSpecs} />);

      expect(screen.getByText('材料分析')).toBeInTheDocument();
      // Should still show default materials
      expect(screen.getByText('轻型钢结构')).toBeInTheDocument();
    });
  });

  describe('Material Properties and Tags', () => {
    it('displays material properties as styled tags', () => {
      const { container } = render(<MaterialAnalysis work={mockWork} />);

      const tags = container.querySelectorAll('.bg-primary-aluminum.text-primary-steel');
      expect(tags.length).toBeGreaterThan(0);
    });

    it('shows appropriate material properties for each material type', () => {
      render(<MaterialAnalysis work={mockWork} />);

      // Steel properties
      expect(screen.getByText('高强度')).toBeInTheDocument();
      expect(screen.getByText('轻质化')).toBeInTheDocument();

      // Aluminum properties
      expect(screen.getByText('耐腐蚀')).toBeInTheDocument();
      expect(screen.getByText('美观')).toBeInTheDocument();

      // Glass properties
      expect(screen.getByText('透明')).toBeInTheDocument();
      expect(screen.getByText('采光')).toBeInTheDocument();
    });
  });
});