import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  className = '' 
}) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  // Generate breadcrumb items from current path if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(router.asPath, t);

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumb for home page or single-level pages
  }

  return (
    <nav 
      className={`flex ${className}`} 
      aria-label="面包屑导航"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <svg
                className="w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            )}
            
            {item.href && !item.isActive ? (
              <Link
                href={item.href}
                className="inline-flex items-center text-sm font-medium text-primary-steel hover:text-accent-copper transition-fast"
              >
                {index === 0 && (
                  <svg
                    className="w-3 h-3 mr-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                )}
                {item.label}
              </Link>
            ) : (
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Generate breadcrumb items from URL path
function generateBreadcrumbItems(path: string, t: any): BreadcrumbItem[] {
  const pathSegments = path.split('/').filter(segment => segment && segment !== 'zh' && segment !== 'fr' && segment !== 'en');
  
  const items: BreadcrumbItem[] = [
    {
      label: t('navigation.home'),
      href: '/',
      isActive: pathSegments.length === 0
    }
  ];

  // Map path segments to breadcrumb items
  const pathMap: Record<string, string> = {
    'biography': t('navigation.biography'),
    'works': t('navigation.works'),
    'scholars': t('navigation.scholars')
  };

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    
    // Handle dynamic routes like /works/[id]
    if (segment.startsWith('[') && segment.endsWith(']')) {
      // Skip dynamic segments in breadcrumb for now
      return;
    }

    // Handle work detail pages
    if (pathSegments[0] === 'works' && index === 1) {
      items.push({
        label: getWorkTitle(segment) || segment,
        isActive: isLast
      });
      return;
    }

    const label = pathMap[segment] || segment;
    items.push({
      label,
      href: isLast ? undefined : currentPath,
      isActive: isLast
    });
  });

  return items;
}

// Helper function to get work title by ID
function getWorkTitle(workId: string): string | null {
  const workTitles: Record<string, string> = {
    'maison-tropicale': '热带住宅',
    'cite-universitaire': '大学城学生宿舍',
    'usine-calberson': '卡尔贝松工厂'
  };
  
  return workTitles[workId] || null;
}

export default Breadcrumb;