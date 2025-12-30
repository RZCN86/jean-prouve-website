/**
 * Accessibility utilities for the Jean Prouvé website
 */

export interface AccessibilityConfig {
  enableKeyboardNavigation: boolean;
  enableScreenReaderSupport: boolean;
  enableHighContrast: boolean;
  enableReducedMotion: boolean;
}

/**
 * Generate ARIA labels for different content types
 */
export function generateAriaLabel(type: string, data: any): string {
  switch (type) {
    case 'work':
      return `建筑作品：${data.title}，建造于${data.year}年，位于${data.location}`;
    case 'scholar':
      return `学者：${data.name}，来自${data.institution}，专业领域：${data.specialization?.join('、') || '未指定'}`;
    case 'biography':
      return `传记内容：${data.title}，时期：${data.period}`;
    case 'navigation':
      return `导航链接：${data.label}`;
    case 'image':
      return data.alt?.trim() || `图片：${data.title?.trim() || '无标题'}`;
    case 'button':
      return `按钮：${data.action}`;
    case 'search':
      return `搜索${data.type || '内容'}`;
    default:
      return data.title || data.name || '内容项目';
  }
}

/**
 * Generate ARIA descriptions for complex elements
 */
export function generateAriaDescription(type: string, data: any): string {
  switch (type) {
    case 'work':
      return `这是让·普鲁维的建筑作品《${data.title}》，属于${data.category?.name || '建筑'}类别。点击查看详细信息、技术规格和专家评论。`;
    case 'scholar':
      return `${data.name}是研究让·普鲁维的学者，主要研究领域包括${data.specialization?.join('、') || '未指定'}。点击查看研究成果和出版物。`;
    case 'timeline':
      return `时间轴事件：${data.year}年${data.title}。${data.description}`;
    case 'gallery':
      return `图片画廊，包含${data.imageCount}张图片。使用箭头键或点击缩略图浏览。`;
    case 'search-result':
      return `搜索结果：${data.title}，类型：${data.type}，相关度：${Math.round(data.relevanceScore * 100)}%`;
    default:
      return data.description || '';
  }
}

/**
 * Keyboard navigation handler
 */
export class KeyboardNavigationHandler {
  private focusableElements: HTMLElement[] = [];
  private currentIndex = -1;

  constructor(container: HTMLElement) {
    this.updateFocusableElements(container);
  }

  updateFocusableElements(container: HTMLElement) {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="link"]:not([disabled])'
    ].join(', ');

    this.focusableElements = Array.from(container.querySelectorAll(selector));
    this.currentIndex = -1;
  }

  handleKeyDown(event: KeyboardEvent): boolean {
    switch (event.key) {
      case 'Tab':
        return this.handleTab(event);
      case 'ArrowDown':
      case 'ArrowRight':
        return this.handleArrowNavigation(1);
      case 'ArrowUp':
      case 'ArrowLeft':
        return this.handleArrowNavigation(-1);
      case 'Home':
        return this.handleHome();
      case 'End':
        return this.handleEnd();
      case 'Enter':
      case ' ':
        return this.handleActivation(event);
      case 'Escape':
        return this.handleEscape();
      default:
        return false;
    }
  }

  private handleTab(event: KeyboardEvent): boolean {
    if (this.focusableElements.length === 0) return false;

    if (event.shiftKey) {
      this.currentIndex = this.currentIndex <= 0 ? this.focusableElements.length - 1 : this.currentIndex - 1;
    } else {
      this.currentIndex = this.currentIndex >= this.focusableElements.length - 1 ? 0 : this.currentIndex + 1;
    }

    this.focusableElements[this.currentIndex]?.focus();
    event.preventDefault();
    return true;
  }

  private handleArrowNavigation(direction: number): boolean {
    if (this.focusableElements.length === 0) return false;

    this.currentIndex += direction;
    if (this.currentIndex < 0) this.currentIndex = this.focusableElements.length - 1;
    if (this.currentIndex >= this.focusableElements.length) this.currentIndex = 0;

    this.focusableElements[this.currentIndex]?.focus();
    return true;
  }

  private handleHome(): boolean {
    if (this.focusableElements.length === 0) return false;
    this.currentIndex = 0;
    this.focusableElements[this.currentIndex]?.focus();
    return true;
  }

  private handleEnd(): boolean {
    if (this.focusableElements.length === 0) return false;
    this.currentIndex = this.focusableElements.length - 1;
    this.focusableElements[this.currentIndex]?.focus();
    return true;
  }

  private handleActivation(event: KeyboardEvent): boolean {
    if (typeof document === 'undefined') return false;
    
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && (activeElement.tagName === 'BUTTON' || activeElement.getAttribute('role') === 'button')) {
      activeElement.click();
      event.preventDefault();
      return true;
    }
    return false;
  }

  private handleEscape(): boolean {
    if (typeof document === 'undefined') return false;
    
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
      return true;
    }
    return false;
  }
}

/**
 * Screen reader announcements
 */
export class ScreenReaderAnnouncer {
  private liveRegion: HTMLElement | null = null;

  constructor() {
    // Only create live region on client side
    if (typeof window !== 'undefined') {
      this.liveRegion = this.createLiveRegion();
    }
  }

  private createLiveRegion(): HTMLElement {
    if (typeof document === 'undefined') {
      return null as any;
    }

    const existing = document.getElementById('sr-live-region');
    if (existing) return existing;

    const liveRegion = document.createElement('div');
    liveRegion.id = 'sr-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';

    document.body.appendChild(liveRegion);
    return liveRegion;
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!this.liveRegion || typeof window === 'undefined') return;
    
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = '';
      }
    }, 1000);
  }

  announceNavigation(from: string, to: string) {
    this.announce(`已从${from}导航到${to}`, 'polite');
  }

  announceAction(action: string, result?: string) {
    const message = result ? `${action}，${result}` : action;
    this.announce(message, 'assertive');
  }

  announceError(error: string) {
    this.announce(`错误：${error}`, 'assertive');
  }

  announceSuccess(success: string) {
    this.announce(`成功：${success}`, 'polite');
  }
}

/**
 * Focus management utilities
 */
export class FocusManager {
  private focusHistory: HTMLElement[] = [];

  saveFocus() {
    if (typeof document === 'undefined') return;
    
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      this.focusHistory.push(activeElement);
    }
  }

  restoreFocus() {
    if (typeof document === 'undefined') return false;
    
    const lastFocused = this.focusHistory.pop();
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus();
      return true;
    }
    return false;
  }

  trapFocus(container: HTMLElement) {
    if (typeof document === 'undefined') {
      return () => {};
    }
    
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            event.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }
}

/**
 * Color contrast utilities
 */
export function checkColorContrast(foreground: string, background: string): {
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
} {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) {
    return { ratio: 0, wcagAA: false, wcagAAA: false };
  }

  const fgLuminance = getLuminance(fg.r, fg.g, fg.b);
  const bgLuminance = getLuminance(bg.r, bg.g, bg.b);

  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);

  return {
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7
  };
}

/**
 * Reduced motion utilities
 */
export function respectsReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getAnimationDuration(defaultDuration: number): number {
  return respectsReducedMotion() ? 0 : defaultDuration;
}

/**
 * Skip link component helper
 */
export function createSkipLink(targetId: string, label: string): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = label;
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 1000;
    border-radius: 4px;
  `;

  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });

  return skipLink;
}