import React from 'react';
import { useTranslation } from 'next-i18next';

interface SkipLinksProps {
  links?: Array<{
    href: string;
    label: string;
  }>;
}

const SkipLinks: React.FC<SkipLinksProps> = ({ links }) => {
  const { t } = useTranslation('common');

  const defaultLinks = [
    { href: '#main-content', label: t('accessibility.skip_to_main') || '跳转到主要内容' },
    { href: '#main-navigation', label: t('accessibility.skip_to_navigation') || '跳转到导航' },
    { href: '#search', label: t('accessibility.skip_to_search') || '跳转到搜索' },
    { href: '#footer', label: t('accessibility.skip_to_footer') || '跳转到页脚' },
  ];

  const skipLinks = links || defaultLinks;

  return (
    <div className="skip-links">
      {skipLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="skip-link"
          onFocus={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.transform = 'translateY(-100%)';
          }}
        >
          {link.label}
        </a>
      ))}
      
      <style jsx>{`
        .skip-links {
          position: relative;
          z-index: 9999;
        }
        
        .skip-link {
          position: absolute;
          top: 0;
          left: 6px;
          background: #000;
          color: #fff;
          padding: 8px 12px;
          text-decoration: none;
          border-radius: 0 0 4px 4px;
          font-size: 14px;
          font-weight: 500;
          transform: translateY(-100%);
          transition: transform 0.2s ease-in-out;
          z-index: 10000;
        }
        
        .skip-link:focus {
          transform: translateY(0);
          outline: 2px solid #fff;
          outline-offset: 2px;
        }
        
        .skip-link:hover {
          background: #333;
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .skip-link {
            background: #000;
            color: #fff;
            border: 2px solid #fff;
          }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .skip-link {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SkipLinks;