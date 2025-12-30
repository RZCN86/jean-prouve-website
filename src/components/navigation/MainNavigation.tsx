import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { NavigationProps, MenuItem } from '@/types';
import GlobalSearch from '@/components/common/GlobalSearch';

interface MainNavigationProps extends NavigationProps {
  className?: string;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ 
  currentPath, 
  locale, 
  className = '' 
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Navigation menu items
  const navigationItems: MenuItem[] = [
    {
      id: 'home',
      label: t('navigation.home'),
      href: '/',
    },
    {
      id: 'biography',
      label: t('navigation.biography'),
      href: '/biography',
    },
    {
      id: 'works',
      label: t('navigation.works'),
      href: '/works',
    },
    {
      id: 'scholars',
      label: t('navigation.scholars'),
      href: '/scholars',
    },
    {
      id: 'search',
      label: t('navigation.search'),
      href: '/search',
    },
  ];

  // Language options
  const languages = [
    { code: 'zh', name: '中文', nativeName: '中文' },
    { code: 'fr', name: 'Français', nativeName: 'Français' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
      setIsLanguageMenuOpen(false);
      setIsSearchOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
      if (!target.closest('.language-menu') && !target.closest('.language-menu-button')) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle language change
  const handleLanguageChange = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
    setIsLanguageMenuOpen(false);
  };

  // Check if current path matches navigation item
  const isActiveLink = (href: string): boolean => {
    if (href === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(href);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsLanguageMenuOpen(false);
    setIsSearchOpen(false);
  };

  // Toggle language menu
  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
    setIsSearchOpen(false);
  };

  // Toggle search
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMobileMenuOpen(false);
    setIsLanguageMenuOpen(false);
  };

  return (
    <nav className={`bg-white shadow-md sticky top-0 z-50 safe-area-inset-top ${className}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-lg sm:text-xl font-heading font-bold text-primary-iron hover:text-accent-copper transition-fast touch-manipulation tap-highlight-none"
            >
              Jean Prouvé
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-fast touch-manipulation tap-highlight-none ${
                    isActiveLink(item.href)
                      ? 'bg-primary-aluminum text-primary-iron'
                      : 'text-primary-steel hover:bg-neutral-light hover:text-primary-iron'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-lg mx-8">
            <GlobalSearch 
              placeholder="搜索作品、学者、传记..."
              showFilters={false}
            />
          </div>

          {/* Language Switcher & Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Search Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleSearch}
                className="inline-flex items-center justify-center p-2 rounded-md text-primary-steel hover:text-primary-iron hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-copper transition-fast btn-touch touch-manipulation tap-highlight-none"
                aria-label="搜索"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            {/* Language Switcher */}
            <div className="relative language-menu">
              <button
                onClick={toggleLanguageMenu}
                className="language-menu-button flex items-center px-2 sm:px-3 py-2 rounded-md text-sm font-medium text-primary-steel hover:bg-neutral-light hover:text-primary-iron transition-fast btn-touch touch-manipulation tap-highlight-none"
                aria-label={t('navigation.language')}
                aria-expanded={isLanguageMenuOpen}
                aria-haspopup="true"
              >
                <span className="hidden sm:inline mr-2">{t('navigation.language')}</span>
                <span className="font-semibold text-xs sm:text-sm">
                  {languages.find(lang => lang.code === locale)?.code.toUpperCase()}
                </span>
                <svg
                  className={`ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform ${
                    isLanguageMenuOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Language Dropdown */}
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1" role="menu">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`block w-full text-left px-4 py-2 text-sm transition-fast btn-touch touch-manipulation tap-highlight-none ${
                          locale === language.code
                            ? 'bg-primary-aluminum text-primary-iron'
                            : 'text-primary-steel hover:bg-neutral-light hover:text-primary-iron'
                        }`}
                        role="menuitem"
                      >
                        <span className="font-medium">{language.nativeName}</span>
                        <span className="ml-2 text-xs text-neutral-medium">
                          ({language.name})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="mobile-menu-button inline-flex items-center justify-center p-2 rounded-md text-primary-steel hover:text-primary-iron hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-copper transition-fast btn-touch touch-manipulation tap-highlight-none"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-5 w-5 sm:h-6 sm:w-6`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-5 w-5 sm:h-6 sm:w-6`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-neutral-light border-t border-neutral-medium safe-area-inset-bottom">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`block px-3 py-3 rounded-md text-base font-medium transition-fast btn-touch touch-manipulation tap-highlight-none ${
                    isActiveLink(item.href)
                      ? 'bg-primary-aluminum text-primary-iron'
                      : 'text-primary-steel hover:bg-white hover:text-primary-iron'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="lg:hidden border-t border-neutral-medium bg-white">
            <div className="px-4 py-4">
              <GlobalSearch 
                placeholder="搜索作品、学者、传记..."
                showFilters={false}
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNavigation;