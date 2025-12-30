import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ScreenReaderAnnouncer, FocusManager, AccessibilityConfig } from '@/utils/accessibility';

interface AccessibilityContextType {
  config: AccessibilityConfig;
  announcer: ScreenReaderAnnouncer;
  focusManager: FocusManager;
  updateConfig: (newConfig: Partial<AccessibilityConfig>) => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  announceNavigation: (from: string, to: string) => void;
  announceAction: (action: string, result?: string) => void;
  saveFocus: () => void;
  restoreFocus: () => boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<AccessibilityConfig>({
    enableKeyboardNavigation: true,
    enableScreenReaderSupport: true,
    enableHighContrast: false,
    enableReducedMotion: false,
  });

  const [announcer] = useState(() => new ScreenReaderAnnouncer());
  const [focusManager] = useState(() => new FocusManager());

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check for user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

    setConfig(prev => ({
      ...prev,
      enableReducedMotion: prefersReducedMotion,
      enableHighContrast: prefersHighContrast,
    }));

    // Add CSS classes based on preferences
    if (prefersReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
    if (prefersHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }

    // Listen for preference changes
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastMediaQuery = window.matchMedia('(prefers-contrast: high)');

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setConfig(prev => ({ ...prev, enableReducedMotion: e.matches }));
      document.documentElement.classList.toggle('reduce-motion', e.matches);
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setConfig(prev => ({ ...prev, enableHighContrast: e.matches }));
      document.documentElement.classList.toggle('high-contrast', e.matches);
    };

    motionMediaQuery.addEventListener('change', handleMotionChange);
    contrastMediaQuery.addEventListener('change', handleContrastChange);

    return () => {
      motionMediaQuery.removeEventListener('change', handleMotionChange);
      contrastMediaQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  const updateConfig = (newConfig: Partial<AccessibilityConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (config.enableScreenReaderSupport) {
      announcer.announce(message, priority);
    }
  };

  const announceNavigation = (from: string, to: string) => {
    if (config.enableScreenReaderSupport) {
      announcer.announceNavigation(from, to);
    }
  };

  const announceAction = (action: string, result?: string) => {
    if (config.enableScreenReaderSupport) {
      announcer.announceAction(action, result);
    }
  };

  const saveFocus = () => {
    focusManager.saveFocus();
  };

  const restoreFocus = () => {
    return focusManager.restoreFocus();
  };

  const value: AccessibilityContextType = {
    config,
    announcer,
    focusManager,
    updateConfig,
    announce,
    announceNavigation,
    announceAction,
    saveFocus,
    restoreFocus,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityProvider;