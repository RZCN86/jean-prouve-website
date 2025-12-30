import React from 'react';
import { render, screen } from '@testing-library/react';
import Timeline from '../Timeline';
import { TimelineEvent } from '@/types';

describe('Timeline', () => {
  const mockTimelineEvents: TimelineEvent[] = [
    {
      year: 1901,
      title: "出生于巴黎",
      description: "让·普鲁维出生在一个艺术世家，父亲维克多·普鲁维是著名的艺术家。",
      category: "education"
    },
    {
      year: 1919,
      title: "建立个人工作室",
      description: "在南锡建立了自己的金属工艺工作室，开始独立的设计和制作生涯。",
      category: "career"
    },
    {
      year: 1945,
      title: "与勒·柯布西耶合作",
      description: "开始与著名建筑师勒·柯布西耶合作，参与马赛公寓等重要项目的设计。",
      category: "collaboration"
    },
    {
      year: 1971,
      title: "获得法国建筑大奖",
      description: "因其在建筑和工业设计领域的杰出贡献，获得法国建筑界的最高荣誉。",
      category: "achievement"
    }
  ];

  describe('Timeline Rendering', () => {
    it('renders all timeline events correctly', () => {
      render(<Timeline events={mockTimelineEvents} />);

      // Check that all events are rendered
      expect(screen.getByText("出生于巴黎")).toBeInTheDocument();
      expect(screen.getByText("建立个人工作室")).toBeInTheDocument();
      expect(screen.getByText("与勒·柯布西耶合作")).toBeInTheDocument();
      expect(screen.getByText("获得法国建筑大奖")).toBeInTheDocument();
    });

    it('displays years correctly for each event', () => {
      render(<Timeline events={mockTimelineEvents} />);

      expect(screen.getByText("1901")).toBeInTheDocument();
      expect(screen.getByText("1919")).toBeInTheDocument();
      expect(screen.getByText("1945")).toBeInTheDocument();
      expect(screen.getByText("1971")).toBeInTheDocument();
    });

    it('renders event descriptions', () => {
      render(<Timeline events={mockTimelineEvents} />);

      expect(screen.getByText(/让·普鲁维出生在一个艺术世家/)).toBeInTheDocument();
      expect(screen.getByText(/在南锡建立了自己的金属工艺工作室/)).toBeInTheDocument();
      expect(screen.getByText(/开始与著名建筑师勒·柯布西耶合作/)).toBeInTheDocument();
      expect(screen.getByText(/因其在建筑和工业设计领域的杰出贡献/)).toBeInTheDocument();
    });

    it('renders timeline visual structure correctly', () => {
      const { container } = render(<Timeline events={mockTimelineEvents} />);

      // Check for timeline line
      const timelineLine = container.querySelector('.absolute.left-8.top-0.bottom-0.w-0\\.5');
      expect(timelineLine).toBeInTheDocument();
      expect(timelineLine).toHaveClass('bg-neutral-medium');

      // Check for timeline dots
      const timelineDots = container.querySelectorAll('.w-16.h-16.rounded-full');
      expect(timelineDots).toHaveLength(4);
    });

    it('applies custom className when provided', () => {
      const { container } = render(
        <Timeline events={mockTimelineEvents} className="custom-timeline-class" />
      );

      const timelineContainer = container.firstChild as HTMLElement;
      expect(timelineContainer).toHaveClass('custom-timeline-class');
    });

    it('handles empty events array gracefully', () => {
      const { container } = render(<Timeline events={[]} />);

      // Should render container but no events
      expect(container.firstChild).toBeInTheDocument();
      expect(container.querySelectorAll('.w-16.h-16.rounded-full')).toHaveLength(0);
    });
  });

  describe('Category Styling', () => {
    it('applies correct colors for education category', () => {
      const educationEvent: TimelineEvent[] = [{
        year: 1916,
        title: "教育事件",
        description: "教育相关描述",
        category: "education"
      }];

      const { container } = render(<Timeline events={educationEvent} />);

      const categoryBadge = screen.getByText("education");
      expect(categoryBadge).toHaveClass('bg-accent-brass', 'text-primary-iron');
    });

    it('applies correct colors for career category', () => {
      const careerEvent: TimelineEvent[] = [{
        year: 1920,
        title: "职业事件",
        description: "职业相关描述",
        category: "career"
      }];

      const { container } = render(<Timeline events={careerEvent} />);

      const categoryBadge = screen.getByText("career");
      expect(categoryBadge).toHaveClass('bg-accent-copper', 'text-white');
    });

    it('applies correct colors for achievement category', () => {
      const achievementEvent: TimelineEvent[] = [{
        year: 1950,
        title: "成就事件",
        description: "成就相关描述",
        category: "achievement"
      }];

      const { container } = render(<Timeline events={achievementEvent} />);

      const categoryBadge = screen.getByText("achievement");
      expect(categoryBadge).toHaveClass('bg-primary-steel', 'text-white');
    });

    it('applies correct colors for collaboration category', () => {
      const collaborationEvent: TimelineEvent[] = [{
        year: 1940,
        title: "合作事件",
        description: "合作相关描述",
        category: "collaboration"
      }];

      const { container } = render(<Timeline events={collaborationEvent} />);

      const categoryBadge = screen.getByText("collaboration");
      expect(categoryBadge).toHaveClass('bg-primary-aluminum', 'text-primary-iron');
    });

    it('applies default colors for unknown category', () => {
      const unknownEvent: TimelineEvent[] = [{
        year: 1930,
        title: "未知事件",
        description: "未知类别描述",
        category: "education" as any // Will be treated as default due to switch fallback
      }];

      // Temporarily modify the event to have an invalid category
      const invalidEvent = { ...unknownEvent[0], category: 'invalid' as any };
      
      const { container } = render(<Timeline events={[invalidEvent]} />);

      const categoryBadge = screen.getByText("invalid");
      expect(categoryBadge).toHaveClass('bg-neutral-medium', 'text-primary-iron');
    });
  });

  describe('Category Icons', () => {
    it('displays correct icon for education category', () => {
      const educationEvent: TimelineEvent[] = [{
        year: 1916,
        title: "教育事件",
        description: "教育相关描述",
        category: "education"
      }];

      render(<Timeline events={educationEvent} />);

      const icon = screen.getByRole('img', { name: 'education' });
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('🎓');
    });

    it('displays correct icon for career category', () => {
      const careerEvent: TimelineEvent[] = [{
        year: 1920,
        title: "职业事件",
        description: "职业相关描述",
        category: "career"
      }];

      render(<Timeline events={careerEvent} />);

      const icon = screen.getByRole('img', { name: 'career' });
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('🏢');
    });

    it('displays correct icon for achievement category', () => {
      const achievementEvent: TimelineEvent[] = [{
        year: 1950,
        title: "成就事件",
        description: "成就相关描述",
        category: "achievement"
      }];

      render(<Timeline events={achievementEvent} />);

      const icon = screen.getByRole('img', { name: 'achievement' });
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('🏆');
    });

    it('displays correct icon for collaboration category', () => {
      const collaborationEvent: TimelineEvent[] = [{
        year: 1940,
        title: "合作事件",
        description: "合作相关描述",
        category: "collaboration"
      }];

      render(<Timeline events={collaborationEvent} />);

      const icon = screen.getByRole('img', { name: 'collaboration' });
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('🤝');
    });

    it('displays default icon for unknown category', () => {
      const unknownEvent: TimelineEvent[] = [{
        year: 1930,
        title: "未知事件",
        description: "未知类别描述",
        category: "education" as any
      }];

      // Temporarily modify the event to have an invalid category
      const invalidEvent = { ...unknownEvent[0], category: 'invalid' as any };
      
      render(<Timeline events={[invalidEvent]} />);

      const icon = screen.getByRole('img', { name: 'invalid' });
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('📅');
    });
  });

  describe('Layout and Structure', () => {
    it('maintains proper spacing between events', () => {
      const { container } = render(<Timeline events={mockTimelineEvents} />);

      const eventsContainer = container.querySelector('.space-y-8');
      expect(eventsContainer).toBeInTheDocument();
    });

    it('positions timeline dots correctly', () => {
      const { container } = render(<Timeline events={mockTimelineEvents} />);

      const timelineDots = container.querySelectorAll('.relative.z-10.flex.items-center.justify-center');
      expect(timelineDots).toHaveLength(4);
      
      timelineDots.forEach(dot => {
        expect(dot).toHaveClass('w-16', 'h-16', 'rounded-full', 'bg-white', 'border-4', 'border-neutral-medium', 'shadow-md');
      });
    });

    it('structures event content correctly', () => {
      const { container } = render(<Timeline events={mockTimelineEvents} />);

      const eventContainers = container.querySelectorAll('.bg-white.rounded-lg.shadow-md.p-6');
      expect(eventContainers).toHaveLength(4);
    });

    it('positions content relative to timeline dots', () => {
      const { container } = render(<Timeline events={mockTimelineEvents} />);

      const contentContainers = container.querySelectorAll('.ml-6.flex-1');
      expect(contentContainers).toHaveLength(4);
    });
  });

  describe('Typography and Styling', () => {
    it('applies correct typography classes to years', () => {
      render(<Timeline events={mockTimelineEvents} />);

      const years = screen.getAllByText(/^\d{4}$/);
      years.forEach(year => {
        expect(year).toHaveClass('text-2xl', 'font-bold', 'text-primary-iron');
      });
    });

    it('applies correct typography classes to titles', () => {
      render(<Timeline events={mockTimelineEvents} />);

      const title = screen.getByText("出生于巴黎");
      expect(title).toHaveClass('text-xl', 'font-heading', 'font-semibold', 'text-primary-iron');
    });

    it('applies correct typography classes to descriptions', () => {
      render(<Timeline events={mockTimelineEvents} />);

      const description = screen.getByText(/让·普鲁维出生在一个艺术世家/);
      expect(description).toHaveClass('text-primary-steel', 'leading-relaxed');
    });

    it('applies correct styling to category badges', () => {
      render(<Timeline events={mockTimelineEvents} />);

      const categoryBadges = screen.getAllByText(/^(education|career|collaboration|achievement)$/);
      categoryBadges.forEach(badge => {
        expect(badge).toHaveClass('px-3', 'py-1', 'rounded-full', 'text-sm', 'font-medium');
      });
    });
  });

  describe('Accessibility', () => {
    it('provides proper aria-label for category icons', () => {
      render(<Timeline events={mockTimelineEvents} />);

      const educationIcon = screen.getByRole('img', { name: 'education' });
      expect(educationIcon).toHaveAttribute('aria-label', 'education');
    });

    it('maintains semantic structure with proper headings', () => {
      render(<Timeline events={mockTimelineEvents} />);

      const eventTitles = screen.getAllByRole('heading', { level: 3 });
      expect(eventTitles).toHaveLength(4);
    });

    it('provides meaningful text content for screen readers', () => {
      render(<Timeline events={mockTimelineEvents} />);

      // All text content should be accessible
      expect(screen.getByText("出生于巴黎")).toBeInTheDocument();
      expect(screen.getByText(/让·普鲁维出生在一个艺术世家/)).toBeInTheDocument();
    });
  });
});