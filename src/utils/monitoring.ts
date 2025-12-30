/**
 * 性能监控和分析工具
 * Performance monitoring and analytics utilities
 */

// Web Vitals 类型定义
interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: 'navigate' | 'reload' | 'back-forward' | 'back-forward-cache' | 'prerender' | 'restore';
}

// 错误追踪接口
interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

// 用户行为分析接口
interface UserEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  page: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

// 性能指标接口
interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToFirstByte: number;
}

class MonitoringService {
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = this.shouldEnableMonitoring();
    
    if (this.isEnabled && typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private shouldEnableMonitoring(): boolean {
    if (typeof window === 'undefined') return false;
    
    // 检查环境变量
    const isProduction = process.env.NODE_ENV === 'production';
    const monitoringEnabled = process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING === 'true';
    
    return isProduction && monitoringEnabled;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMonitoring(): void {
    // 监听页面卸载事件，发送缓存的数据
    window.addEventListener('beforeunload', () => {
      this.flushPendingData();
    });

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushPendingData();
      }
    });

    // 监听未捕获的错误
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId,
      });
    });

    // 监听未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId,
      });
    });
  }

  // Web Vitals 监控
  public trackWebVitals(metric: WebVitalsMetric): void {
    if (!this.isEnabled) return;

    const vitalsData = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      page: window.location.pathname,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    };

    this.sendToAnalytics('web_vitals', vitalsData);
  }

  // 错误追踪
  public trackError(errorInfo: ErrorInfo): void {
    if (!this.isEnabled) return;

    console.error('Tracked Error:', errorInfo);
    this.sendToAnalytics('error', errorInfo);
  }

  // 用户行为追踪
  public trackEvent(event: Omit<UserEvent, 'timestamp' | 'sessionId' | 'userId' | 'page'>): void {
    if (!this.isEnabled) return;

    const eventData: UserEvent = {
      ...event,
      page: window.location.pathname,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    };

    this.sendToAnalytics('user_event', eventData);
  }

  // 页面浏览追踪
  public trackPageView(page: string, title?: string): void {
    if (!this.isEnabled) return;

    this.trackEvent({
      event: 'page_view',
      category: 'navigation',
      label: title || page,
      metadata: {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      },
    });
  }

  // 性能指标收集
  public collectPerformanceMetrics(): PerformanceMetrics | null {
    if (!this.isEnabled || typeof window === 'undefined' || !window.performance) {
      return null;
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    const firstPaint = paint.find(entry => entry.name === 'first-paint')?.startTime || 0;
    const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

    return {
      pageLoadTime: navigation.loadEventEnd - navigation.startTime,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
      firstPaint,
      firstContentfulPaint,
      largestContentfulPaint: 0, // 需要通过 Web Vitals API 获取
      cumulativeLayoutShift: 0, // 需要通过 Web Vitals API 获取
      firstInputDelay: 0, // 需要通过 Web Vitals API 获取
      timeToFirstByte: navigation.responseStart - navigation.requestStart,
    };
  }

  // 设置用户ID
  public setUserId(userId: string): void {
    this.userId = userId;
  }

  // 发送数据到分析服务
  private sendToAnalytics(type: string, data: any): void {
    // 使用 navigator.sendBeacon 或 fetch 发送数据
    const payload = {
      type,
      data,
      timestamp: Date.now(),
    };

    if (navigator.sendBeacon) {
      // 使用 sendBeacon 确保数据在页面卸载时也能发送
      navigator.sendBeacon('/api/analytics', JSON.stringify(payload));
    } else {
      // 降级到 fetch
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(error => {
        console.error('Failed to send analytics data:', error);
      });
    }
  }

  // 刷新待发送的数据
  private flushPendingData(): void {
    // 在实际实现中，这里会发送所有缓存的数据
    console.log('Flushing pending analytics data...');
  }
}

// 创建全局监控实例
export const monitoring = new MonitoringService();

// Web Vitals 集成
export function initWebVitals(): void {
  if (typeof window === 'undefined') return;

  // 动态导入 web-vitals 库
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(monitoring.trackWebVitals.bind(monitoring));
    getFID(monitoring.trackWebVitals.bind(monitoring));
    getFCP(monitoring.trackWebVitals.bind(monitoring));
    getLCP(monitoring.trackWebVitals.bind(monitoring));
    getTTFB(monitoring.trackWebVitals.bind(monitoring));
  }).catch(error => {
    console.warn('Failed to load web-vitals:', error);
  });
}

// 错误边界集成
export function trackErrorBoundary(error: Error, errorInfo: any): void {
  monitoring.trackError({
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    errorBoundary: errorInfo.errorBoundary,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
    sessionId: monitoring['sessionId'],
    userId: monitoring['userId'],
  });
}

// 便捷的事件追踪函数
export const analytics = {
  // 追踪页面浏览
  pageView: (page: string, title?: string) => monitoring.trackPageView(page, title),
  
  // 追踪用户交互
  click: (element: string, category = 'interaction') => 
    monitoring.trackEvent({ event: 'click', category, label: element }),
  
  // 追踪搜索
  search: (query: string, results: number) => 
    monitoring.trackEvent({ 
      event: 'search', 
      category: 'engagement', 
      label: query, 
      value: results 
    }),
  
  // 追踪内容查看
  viewContent: (contentType: string, contentId: string) => 
    monitoring.trackEvent({ 
      event: 'view_content', 
      category: 'content', 
      label: `${contentType}:${contentId}` 
    }),
  
  // 追踪语言切换
  changeLanguage: (from: string, to: string) => 
    monitoring.trackEvent({ 
      event: 'language_change', 
      category: 'localization', 
      label: `${from}->${to}` 
    }),
  
  // 追踪图像交互
  imageInteraction: (action: string, imageId: string) => 
    monitoring.trackEvent({ 
      event: 'image_interaction', 
      category: 'media', 
      label: `${action}:${imageId}` 
    }),
};

export default monitoring;