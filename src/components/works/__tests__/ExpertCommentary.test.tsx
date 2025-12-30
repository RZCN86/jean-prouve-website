import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExpertCommentary from '../ExpertCommentary';
import { ExpertAnalysis, TechnicalAnalysis, HistoricalContext, ContemporaryInfluence } from '@/types';

describe('ExpertCommentary', () => {
  const mockExpertAnalyses: ExpertAnalysis[] = [
    {
      id: 'analysis-1',
      workId: 'test-work',
      title: '气候适应性设计分析',
      content: '这是一个关于气候适应性设计的详细分析内容。',
      author: '张建筑师',
      authorBio: '知名建筑师，专注于可持续设计',
      institution: '清华大学建筑学院',
      type: 'technical',
      date: '2023-03-15',
      tags: ['气候建筑', '可持续性'],
      references: ['参考文献1', '参考文献2']
    },
    {
      id: 'analysis-2',
      workId: 'test-work',
      title: '历史文化意义',
      content: '从历史文化角度分析这个建筑项目的重要性。',
      author: '李史学家',
      institution: '北京大学',
      type: 'cultural',
      date: '2023-04-20',
      tags: ['历史', '文化'],
      references: []
    }
  ];

  const mockTechnicalAnalysis: TechnicalAnalysis = {
    id: 'tech-1',
    workId: 'test-work',
    title: '技术分析报告',
    constructionMethod: '采用预制装配式建造方法',
    materials: [
      {
        material: '钢结构',
        properties: ['高强度', '轻质'],
        usage: '主体结构',
        advantages: ['施工快速', '质量可控']
      }
    ],
    innovations: ['预制技术', '装配工艺'],
    challenges: ['运输限制', '精度要求'],
    impact: '推动了建筑工业化发展',
    author: '王工程师',
    date: '2023-05-10'
  };

  const mockHistoricalContext: HistoricalContext = {
    id: 'hist-1',
    workId: 'test-work',
    period: '1950年代',
    socialContext: '战后重建时期的社会背景',
    politicalContext: '政治环境描述',
    economicContext: '经济条件分析',
    culturalSignificance: '文化意义阐述',
    influences: ['现代主义', '工业化'],
    author: '历史学家',
    date: '2023-06-01'
  };

  const mockContemporaryInfluence: ContemporaryInfluence = {
    id: 'contemp-1',
    workId: 'test-work',
    title: '当代影响分析',
    description: '对当代建筑的影响描述',
    influencedWorks: ['现代建筑A', '现代建筑B'],
    influencedArchitects: ['建筑师A', '建筑师B'],
    modernApplications: ['应用1', '应用2'],
    relevanceToday: '当代相关性说明',
    author: '当代研究者',
    date: '2023-07-15'
  };

  describe('Content Rendering', () => {
    it('renders expert analyses section correctly', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={mockExpertAnalyses}
        />
      );

      expect(screen.getAllByText('专家分析')[0]).toBeInTheDocument();
      expect(screen.getByText('气候适应性设计分析')).toBeInTheDocument();
      expect(screen.getByText('张建筑师')).toBeInTheDocument();
      expect(screen.getByText('清华大学建筑学院')).toBeInTheDocument();
      expect(screen.getByText('这是一个关于气候适应性设计的详细分析内容。')).toBeInTheDocument();
    });

    it('displays analysis type labels correctly', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={mockExpertAnalyses}
        />
      );

      // Look for the analysis type labels in the content cards
      const analysisCards = screen.getAllByText('技术分析');
      expect(analysisCards.length).toBeGreaterThan(0);
      expect(screen.getByText('文化意义')).toBeInTheDocument();
    });

    it('renders author bio when provided', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={mockExpertAnalyses}
        />
      );

      expect(screen.getByText('知名建筑师，专注于可持续设计')).toBeInTheDocument();
    });

    it('displays tags when available', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={mockExpertAnalyses}
        />
      );

      expect(screen.getByText('气候建筑')).toBeInTheDocument();
      expect(screen.getByText('可持续性')).toBeInTheDocument();
      expect(screen.getByText('历史')).toBeInTheDocument();
      expect(screen.getByText('文化')).toBeInTheDocument();
    });

    it('shows references when provided', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={mockExpertAnalyses}
        />
      );

      expect(screen.getByText('参考文献')).toBeInTheDocument();
      expect(screen.getByText('参考文献1')).toBeInTheDocument();
      expect(screen.getByText('参考文献2')).toBeInTheDocument();
    });

    it('formats dates correctly', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={mockExpertAnalyses}
        />
      );

      expect(screen.getByText('2023年3月15日')).toBeInTheDocument();
      expect(screen.getByText('2023年4月20日')).toBeInTheDocument();
    });

    it('displays empty state when no analyses provided', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={[]}
        />
      );

      expect(screen.getByText('暂无专家分析内容')).toBeInTheDocument();
    });
  });

  describe('Technical Analysis Display', () => {
    it('renders technical analysis section when provided', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          technicalAnalysis={mockTechnicalAnalysis}
        />
      );

      // Switch to technical tab
      fireEvent.click(screen.getByText('技术分析'));

      expect(screen.getByText('技术分析报告')).toBeInTheDocument();
      expect(screen.getByText('王工程师')).toBeInTheDocument();
      expect(screen.getByText('采用预制装配式建造方法')).toBeInTheDocument();
    });

    it('displays construction method correctly', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          technicalAnalysis={mockTechnicalAnalysis}
        />
      );

      fireEvent.click(screen.getByText('技术分析'));

      expect(screen.getByText('建造方法')).toBeInTheDocument();
      expect(screen.getByText('采用预制装配式建造方法')).toBeInTheDocument();
    });

    it('shows materials analysis with properties', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          technicalAnalysis={mockTechnicalAnalysis}
        />
      );

      fireEvent.click(screen.getByText('技术分析'));

      expect(screen.getByText('材料分析')).toBeInTheDocument();
      expect(screen.getByText('钢结构')).toBeInTheDocument();
      expect(screen.getByText('主体结构')).toBeInTheDocument();
      expect(screen.getByText('高强度, 轻质')).toBeInTheDocument();
    });

    it('displays innovations and challenges', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          technicalAnalysis={mockTechnicalAnalysis}
        />
      );

      fireEvent.click(screen.getByText('技术分析'));

      expect(screen.getByText('技术创新')).toBeInTheDocument();
      expect(screen.getByText('预制技术')).toBeInTheDocument();
      expect(screen.getByText('装配工艺')).toBeInTheDocument();

      expect(screen.getByText('技术挑战')).toBeInTheDocument();
      expect(screen.getByText('运输限制')).toBeInTheDocument();
      expect(screen.getByText('精度要求')).toBeInTheDocument();
    });

    it('shows technical impact', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          technicalAnalysis={mockTechnicalAnalysis}
        />
      );

      fireEvent.click(screen.getByText('技术分析'));

      expect(screen.getByText('技术影响')).toBeInTheDocument();
      expect(screen.getByText('推动了建筑工业化发展')).toBeInTheDocument();
    });
  });

  describe('Historical Context Display', () => {
    it('renders historical context when provided', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          historicalContext={mockHistoricalContext}
        />
      );

      fireEvent.click(screen.getByText('历史背景'));

      expect(screen.getByText('历史学家')).toBeInTheDocument();
      expect(screen.getByText('1950年代')).toBeInTheDocument();
    });

    it('displays all context categories', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          historicalContext={mockHistoricalContext}
        />
      );

      fireEvent.click(screen.getByText('历史背景'));

      expect(screen.getByText('社会背景')).toBeInTheDocument();
      expect(screen.getByText('政治环境')).toBeInTheDocument();
      expect(screen.getByText('经济条件')).toBeInTheDocument();
      expect(screen.getByText('文化意义')).toBeInTheDocument();
    });

    it('shows historical influences', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          historicalContext={mockHistoricalContext}
        />
      );

      fireEvent.click(screen.getByText('历史背景'));

      expect(screen.getByText('历史影响因素')).toBeInTheDocument();
      expect(screen.getByText('现代主义')).toBeInTheDocument();
      expect(screen.getByText('工业化')).toBeInTheDocument();
    });
  });

  describe('Contemporary Influence Display', () => {
    it('renders contemporary influence when provided', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          contemporaryInfluence={mockContemporaryInfluence}
        />
      );

      fireEvent.click(screen.getByText('当代影响'));

      expect(screen.getByText('当代影响分析')).toBeInTheDocument();
      expect(screen.getByText('当代研究者')).toBeInTheDocument();
      expect(screen.getByText('对当代建筑的影响描述')).toBeInTheDocument();
    });

    it('displays influenced works and architects', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          contemporaryInfluence={mockContemporaryInfluence}
        />
      );

      fireEvent.click(screen.getByText('当代影响'));

      expect(screen.getByText('影响的作品')).toBeInTheDocument();
      expect(screen.getByText('现代建筑A')).toBeInTheDocument();
      expect(screen.getByText('现代建筑B')).toBeInTheDocument();

      expect(screen.getByText('影响的建筑师')).toBeInTheDocument();
      expect(screen.getByText('建筑师A')).toBeInTheDocument();
      expect(screen.getByText('建筑师B')).toBeInTheDocument();
    });

    it('shows modern applications', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          contemporaryInfluence={mockContemporaryInfluence}
        />
      );

      fireEvent.click(screen.getByText('当代影响'));

      expect(screen.getByText('现代应用')).toBeInTheDocument();
      expect(screen.getByText('应用1')).toBeInTheDocument();
      expect(screen.getByText('应用2')).toBeInTheDocument();
    });

    it('displays contemporary relevance', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          contemporaryInfluence={mockContemporaryInfluence}
        />
      );

      fireEvent.click(screen.getByText('当代影响'));

      expect(screen.getByText('当代相关性')).toBeInTheDocument();
      expect(screen.getByText('当代相关性说明')).toBeInTheDocument();
    });
  });

  describe('Navigation and Interaction', () => {
    it('switches between sections correctly', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={mockExpertAnalyses}
          technicalAnalysis={mockTechnicalAnalysis}
          historicalContext={mockHistoricalContext}
          contemporaryInfluence={mockContemporaryInfluence}
        />
      );

      // Initially shows analyses
      expect(screen.getAllByText('专家分析')[0]).toBeInTheDocument();

      // Switch to technical - use role button to be more specific
      const technicalButton = screen.getByRole('button', { name: /🔧 技术分析/ });
      fireEvent.click(technicalButton);
      expect(screen.getByText('建造方法')).toBeInTheDocument();

      // Switch to historical
      const historicalButton = screen.getByRole('button', { name: /📚 历史背景/ });
      fireEvent.click(historicalButton);
      expect(screen.getByText('社会背景')).toBeInTheDocument();

      // Switch to contemporary
      const contemporaryButton = screen.getByRole('button', { name: /🌟 当代影响/ });
      fireEvent.click(contemporaryButton);
      expect(screen.getByText('影响的作品')).toBeInTheDocument();
    });

    it('highlights active section tab', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={mockExpertAnalyses}
          technicalAnalysis={mockTechnicalAnalysis}
        />
      );

      const analysesTab = screen.getByRole('button', { name: /👥 专家分析/ });
      const technicalTab = screen.getByRole('button', { name: /🔧 技术分析/ });

      expect(analysesTab).toHaveClass('border-accent-copper', 'text-accent-copper');
      expect(technicalTab).not.toHaveClass('border-accent-copper', 'text-accent-copper');

      fireEvent.click(technicalTab);

      expect(technicalTab).toHaveClass('border-accent-copper', 'text-accent-copper');
      expect(analysesTab).not.toHaveClass('border-accent-copper', 'text-accent-copper');
    });

    it('disables unavailable sections', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={mockExpertAnalyses}
        />
      );

      const technicalTab = screen.getByRole('button', { name: /🔧 技术分析/ });
      const historicalTab = screen.getByRole('button', { name: /📚 历史背景/ });
      const contemporaryTab = screen.getByRole('button', { name: /🌟 当代影响/ });

      expect(technicalTab).toBeDisabled();
      expect(historicalTab).toBeDisabled();
      expect(contemporaryTab).toBeDisabled();

      expect(technicalTab).toHaveClass('text-gray-300', 'cursor-not-allowed');
    });

    it('shows analysis count in tab', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={mockExpertAnalyses}
        />
      );

      const analysesTab = screen.getByRole('button', { name: /👥 专家分析/ });
      expect(analysesTab).toHaveTextContent('2'); // Two analyses in mock data
    });
  });

  describe('Accessibility', () => {
    it('uses proper button roles for navigation', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={mockExpertAnalyses}
          technicalAnalysis={mockTechnicalAnalysis}
        />
      );

      const tabs = screen.getAllByRole('button');
      expect(tabs.length).toBeGreaterThan(0);
    });

    it('provides proper heading hierarchy', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={mockExpertAnalyses}
        />
      );

      const mainHeading = screen.getByRole('heading', { level: 3 });
      expect(mainHeading).toHaveTextContent('专家分析');
    });

    it('uses semantic list structure for references', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={mockExpertAnalyses}
        />
      );

      const referencesList = screen.getByRole('list');
      expect(referencesList).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBe(2); // Two references in first analysis
    });
  });

  describe('Error Handling', () => {
    it('handles missing optional data gracefully', () => {
      const minimalAnalysis: ExpertAnalysis = {
        id: 'minimal',
        workId: 'test-work',
        title: '最小分析',
        content: '基本内容',
        author: '作者',
        type: 'technical',
        date: '2023-01-01',
        tags: []
      };

      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={[minimalAnalysis]}
        />
      );

      expect(screen.getByText('最小分析')).toBeInTheDocument();
      expect(screen.getByText('作者')).toBeInTheDocument();
      expect(screen.getByText('基本内容')).toBeInTheDocument();
      
      // Should not show optional sections
      expect(screen.queryByText('参考文献')).not.toBeInTheDocument();
    });

    it('handles empty arrays gracefully', () => {
      render(
        <ExpertCommentary
          workId="test-work"
          expertAnalyses={[]}
        />
      );

      expect(screen.getByText('暂无专家分析内容')).toBeInTheDocument();
    });
  });
});