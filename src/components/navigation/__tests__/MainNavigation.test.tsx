import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import MainNavigation from '../MainNavigation';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock next-i18next
jest.mock('next-i18next', () => ({
  useTranslation: jest.fn(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
});

describe('MainNavigation', () => {
  const mockPush = jest.fn();
  const mockRouterEvents = {
    on: jest.fn(),
    off: jest.fn(),
  };

  const mockRouter = {
    push: mockPush,
    events: mockRouterEvents,
    pathname: '/',
    asPath: '/',
    query: {},
  };

  const mockTranslation = {
    t: (key: string) => {
      const translations: Record<string, string> = {
        'navigation.home': 'Home',
        'navigation.biography': 'Biography',
        'navigation.works': 'Works',
        'navigation.scholars': 'Scholarly Research',
        'navigation.language': 'Language',
      };
      return translations[key] || key;
    },
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useTranslation as jest.Mock).mockReturnValue(mockTranslation);
    mockPush.mockClear();
    mockRouterEvents.on.mockClear();
    mockRouterEvents.off.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Navigation Links Functionality', () => {
    it('renders all navigation links correctly', () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Biography')).toBeInTheDocument();
      expect(screen.getByText('Works')).toBeInTheDocument();
      expect(screen.getByText('Scholarly Research')).toBeInTheDocument();
    });

    it('highlights active navigation link correctly', () => {
      render(<MainNavigation currentPath="/biography" locale="en" />);

      const biographyLink = screen.getByText('Biography').closest('a');
      const homeLink = screen.getByText('Home').closest('a');

      expect(biographyLink).toHaveClass('bg-primary-aluminum', 'text-primary-iron');
      expect(homeLink).not.toHaveClass('bg-primary-aluminum', 'text-primary-iron');
    });

    it('highlights home link only when on exact home path', () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveClass('bg-primary-aluminum', 'text-primary-iron');
    });

    it('highlights works link when on works subpages', () => {
      render(<MainNavigation currentPath="/works/some-project" locale="en" />);

      const worksLink = screen.getByText('Works').closest('a');
      expect(worksLink).toHaveClass('bg-primary-aluminum', 'text-primary-iron');
    });

    it('applies correct href attributes to navigation links', () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
      expect(screen.getByText('Biography').closest('a')).toHaveAttribute('href', '/biography');
      expect(screen.getByText('Works').closest('a')).toHaveAttribute('href', '/works');
      expect(screen.getByText('Scholarly Research').closest('a')).toHaveAttribute('href', '/scholars');
    });

    it('renders brand logo link correctly', () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      const brandLink = screen.getByText('Jean Prouvé').closest('a');
      expect(brandLink).toHaveAttribute('href', '/');
      expect(brandLink).toHaveClass('font-heading', 'font-bold');
      // Check for responsive text size classes
      expect(brandLink?.className).toMatch(/text-lg|sm:text-xl/);
    });
  });

  describe('Language Switching Functionality', () => {
    it('displays current language code correctly', () => {
      render(<MainNavigation currentPath="/" locale="fr" />);

      expect(screen.getByText('FR')).toBeInTheDocument();
    });

    it('shows language dropdown when language button is clicked', () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      const languageButton = screen.getByRole('button', { name: /language/i });
      fireEvent.click(languageButton);

      expect(screen.getByText('中文')).toBeInTheDocument();
      expect(screen.getByText('Français')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('highlights current language in dropdown', () => {
      render(<MainNavigation currentPath="/" locale="zh" />);

      const languageButton = screen.getByRole('button', { name: /language/i });
      fireEvent.click(languageButton);

      const chineseOption = screen.getByText('中文').closest('button');
      expect(chineseOption).toHaveClass('bg-primary-aluminum', 'text-primary-iron');
    });

    it('calls router.push with correct locale when language is changed', () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      const languageButton = screen.getByRole('button', { name: /language/i });
      fireEvent.click(languageButton);

      const frenchOption = screen.getByText('Français').closest('button');
      fireEvent.click(frenchOption!);

      expect(mockPush).toHaveBeenCalledWith(
        { pathname: '/', query: {} },
        '/',
        { locale: 'fr' }
      );
    });

    it('closes language dropdown after language selection', async () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      const languageButton = screen.getByRole('button', { name: /language/i });
      fireEvent.click(languageButton);

      const chineseOption = screen.getByText('中文').closest('button');
      fireEvent.click(chineseOption!);

      await waitFor(() => {
        expect(screen.queryByText('Français')).not.toBeInTheDocument();
      });
    });

    it('sets correct aria attributes for language button', () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      const languageButton = screen.getByRole('button', { name: /language/i });
      expect(languageButton).toHaveAttribute('aria-expanded', 'false');
      expect(languageButton).toHaveAttribute('aria-haspopup', 'true');

      fireEvent.click(languageButton);
      expect(languageButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes language dropdown when clicking outside', () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      const languageButton = screen.getByRole('button', { name: /language/i });
      fireEvent.click(languageButton);

      expect(screen.getByText('Français')).toBeInTheDocument();

      // Simulate clicking outside
      fireEvent.mouseDown(document.body);

      expect(screen.queryByText('Français')).not.toBeInTheDocument();
    });
  });

  describe('Mobile Interaction', () => {
    it('shows mobile menu button on mobile screens', () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      const mobileMenuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      expect(mobileMenuButton).toBeInTheDocument();
      
      // Check that the button is in a container with md:hidden class
      const mobileContainer = mobileMenuButton.closest('.md\\:hidden');
      expect(mobileContainer).toBeInTheDocument();
    });

    it('toggles mobile menu when mobile menu button is clicked', () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      const mobileMenuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      
      // Initially closed
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();

      // Open mobile menu
      fireEvent.click(mobileMenuButton);
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
      
      // Check if mobile menu items are visible
      const mobileMenuContainer = document.querySelector('.mobile-menu');
      expect(mobileMenuContainer).toBeInTheDocument();
    });

    it('displays navigation items in mobile menu', () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      const mobileMenuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      fireEvent.click(mobileMenuButton);

      // Check if all navigation items are present in mobile menu
      const mobileMenuContainer = document.querySelector('.mobile-menu');
      expect(mobileMenuContainer).toBeInTheDocument();
      
      // Navigation items should be visible in mobile menu
      const mobileLinks = screen.getAllByText('Home');
      const mobileLinksInMenu = mobileLinks.filter(link => 
        link.closest('.mobile-menu')
      );
      expect(mobileLinksInMenu.length).toBeGreaterThan(0);
    });

    it('highlights active link in mobile menu', () => {
      render(<MainNavigation currentPath="/works" locale="en" />);

      const mobileMenuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      fireEvent.click(mobileMenuButton);

      const mobileMenuContainer = document.querySelector('.mobile-menu');
      const worksLinkInMobile = mobileMenuContainer?.querySelector('a[href="/works"]');
      
      expect(worksLinkInMobile).toHaveClass('bg-primary-aluminum', 'text-primary-iron');
    });

    it('closes mobile menu when clicking outside', () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      const mobileMenuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      fireEvent.click(mobileMenuButton);

      expect(document.querySelector('.mobile-menu')).toBeInTheDocument();

      // Simulate clicking outside
      fireEvent.mouseDown(document.body);

      expect(document.querySelector('.mobile-menu')).not.toBeInTheDocument();
    });

    it('shows correct icons for mobile menu button states', () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      const mobileMenuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      
      // Check hamburger icon is visible when closed
      const hamburgerIcon = mobileMenuButton.querySelector('svg[class*="block"]');
      const closeIcon = mobileMenuButton.querySelector('svg[class*="hidden"]');
      
      expect(hamburgerIcon).toBeInTheDocument();
      expect(closeIcon).toBeInTheDocument();

      // Open menu and check close icon is visible
      fireEvent.click(mobileMenuButton);
      
      const hamburgerIconAfter = mobileMenuButton.querySelector('svg[class*="hidden"]');
      const closeIconAfter = mobileMenuButton.querySelector('svg[class*="block"]');
      
      expect(hamburgerIconAfter).toBeInTheDocument();
      expect(closeIconAfter).toBeInTheDocument();
    });

    it('closes mobile menu when route changes', async () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      const mobileMenuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      fireEvent.click(mobileMenuButton);

      expect(document.querySelector('.mobile-menu')).toBeInTheDocument();

      // Simulate route change
      const routeChangeCallback = mockRouterEvents.on.mock.calls.find(
        call => call[0] === 'routeChangeStart'
      )?.[1];

      if (routeChangeCallback) {
        await act(async () => {
          routeChangeCallback();
        });
      }

      await waitFor(() => {
        expect(document.querySelector('.mobile-menu')).not.toBeInTheDocument();
      });
    });

    it('closes language menu when mobile menu is opened', () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      // Open language menu first
      const languageButton = screen.getByRole('button', { name: /language/i });
      fireEvent.click(languageButton);
      expect(screen.getByText('Français')).toBeInTheDocument();

      // Open mobile menu
      const mobileMenuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      fireEvent.click(mobileMenuButton);

      // Language menu should be closed
      expect(screen.queryByText('Français')).not.toBeInTheDocument();
    });

    it('provides proper accessibility attributes for mobile menu', () => {
      render(<MainNavigation currentPath="/" locale="en" />);

      const mobileMenuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
      expect(mobileMenuButton).toHaveAttribute('aria-label', 'Toggle navigation menu');

      fireEvent.click(mobileMenuButton);
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Router Event Handling', () => {
    it('registers and unregisters router event listeners', () => {
      const { unmount } = render(<MainNavigation currentPath="/" locale="en" />);

      expect(mockRouterEvents.on).toHaveBeenCalledWith('routeChangeStart', expect.any(Function));

      unmount();

      expect(mockRouterEvents.off).toHaveBeenCalledWith('routeChangeStart', expect.any(Function));
    });
  });

  describe('Component Props', () => {
    it('applies custom className when provided', () => {
      const { container } = render(
        <MainNavigation currentPath="/" locale="en" className="custom-nav-class" />
      );

      const navElement = container.querySelector('nav');
      expect(navElement).toHaveClass('custom-nav-class');
    });

    it('handles different locale props correctly', () => {
      const { rerender } = render(<MainNavigation currentPath="/" locale="zh" />);
      expect(screen.getByText('ZH')).toBeInTheDocument();

      rerender(<MainNavigation currentPath="/" locale="fr" />);
      expect(screen.getByText('FR')).toBeInTheDocument();

      rerender(<MainNavigation currentPath="/" locale="en" />);
      expect(screen.getByText('EN')).toBeInTheDocument();
    });
  });
});