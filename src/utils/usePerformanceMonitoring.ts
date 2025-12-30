/**
 * 性能监控React Hook
 * Performance monitoring React hook
 */

import { useEffect, useRef, useCallback } from 'react';
import { monitoring } from './monitoring';

interface PerformanceConfig {
  trackPageLoad?: boolean;
  trackUserInteractions?: boolean;
  trackResourceLoading?: boolean;
  debounceMs?: number;
}

export function usePerformanceMonitoring(config: PerformanceConfig = {}) {
  const {
    trackPageLoad = true,
    trackUserInteractions = true,
    trackResourceLoading = true,
    debounceMs = 100,
  } = config;

  const interactionTimeoutRef = useRef<NodeJS.Timeout>();
  const lastInteractionRef = useRef<number>(0);

  // 追踪页面加载性能
  useEffect(() => {
    if (!trackPageLoad || typeof window === 'undefined') return;

    const measurePageLoad = () => {
      if (document.readyState === 'complete') {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.startTime;
          const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.startTime;
          const firstByte = navigation.responseStart - navigation.requestStart;

          monitoring.trackEvent({
            event: 'page_performance',
            category: 'performance',
            value: Math.round(loadTime),
            metadata: {
              loadTime: Math.round(loadTime),
              domContentLoaded: Math.round(domContentLoaded),
              timeToFirstByte: Math.round(firstByte),
              navigationType: navigation.type,
            },
          });
        }
      } else {
        // 如果页面还没完全加载，等待load事件
        window.addEventListener('load', measurePageLoad, { once: true });
      }
    };

    measurePageLoad();
  }, [trackPageLoad]);

  // 追踪资源加载性能
  useEffect(() => {
    if (!trackResourceLoading || typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          // 只追踪重要资源（图片、脚本、样式表）
          if (resourceEntry.initiatorType === 'img' || 
              resourceEntry.initiatorType === 'script' || 
              resourceEntry.initiatorType === 'link') {
            
            const loadTime = resourceEntry.responseEnd - resourceEntry.startTime;
            
            // 只追踪加载时间超过阈值的资源
            if (loadTime > 100) {
              monitoring.trackEvent({
                event: 'resource_performance',
                category: 'performance',
                label: resourceEntry.name,
                value: Math.round(loadTime),
                metadata: {
                  resourceType: resourceEntry.initiatorType,
                  loadTime: Math.round(loadTime),
                  transferSize: resourceEntry.transferSize,
                  encodedBodySize: resourceEntry.encodedBodySize,
                },
              });
            }
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => {
      observer.disconnect();
    };
  }, [trackResourceLoading]);

  // 追踪用户交互性能
  const trackInteraction = useCallback((interactionType: string, target?: string) => {
    if (!trackUserInteractions) return;

    const now = performance.now();
    const timeSinceLastInteraction = now - lastInteractionRef.current;
    
    // 防抖处理，避免过于频繁的事件追踪
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }

    interactionTimeoutRef.current = setTimeout(() => {
      monitoring.trackEvent({
        event: 'user_interaction',
        category: 'interaction',
        label: `${interactionType}${target ? `:${target}` : ''}`,
        metadata: {
          interactionType,
          target,
          timeSinceLastInteraction: Math.round(timeSinceLastInteraction),
          timestamp: now,
        },
      });
      
      lastInteractionRef.current = now;
    }, debounceMs);
  }, [trackUserInteractions, debounceMs]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  return {
    trackInteraction,
  };
}

// 专门用于追踪组件渲染性能的Hook
export function useRenderPerformance(componentName: string) {
  const renderStartRef = useRef<number>();
  const mountTimeRef = useRef<number>();

  useEffect(() => {
    // 组件挂载时间
    mountTimeRef.current = performance.now();
    
    return () => {
      // 组件卸载时追踪生命周期
      if (mountTimeRef.current) {
        const lifeTime = performance.now() - mountTimeRef.current;
        
        monitoring.trackEvent({
          event: 'component_lifecycle',
          category: 'performance',
          label: componentName,
          value: Math.round(lifeTime),
          metadata: {
            componentName,
            lifeTime: Math.round(lifeTime),
            action: 'unmount',
          },
        });
      }
    };
  }, [componentName]);

  const startRender = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  const endRender = useCallback(() => {
    if (renderStartRef.current) {
      const renderTime = performance.now() - renderStartRef.current;
      
      // 只追踪渲染时间超过阈值的情况
      if (renderTime > 16) { // 超过一帧的时间
        monitoring.trackEvent({
          event: 'component_render',
          category: 'performance',
          label: componentName,
          value: Math.round(renderTime),
          metadata: {
            componentName,
            renderTime: Math.round(renderTime),
          },
        });
      }
      
      renderStartRef.current = undefined;
    }
  }, [componentName]);

  return {
    startRender,
    endRender,
  };
}

// 用于追踪异步操作性能的Hook
export function useAsyncPerformance() {
  const trackAsyncOperation = useCallback(async <T>(
    operationName: string,
    operation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      monitoring.trackEvent({
        event: 'async_operation',
        category: 'performance',
        label: operationName,
        value: Math.round(duration),
        metadata: {
          operationName,
          duration: Math.round(duration),
          success: true,
          ...metadata,
        },
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      monitoring.trackEvent({
        event: 'async_operation',
        category: 'performance',
        label: operationName,
        value: Math.round(duration),
        metadata: {
          operationName,
          duration: Math.round(duration),
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          ...metadata,
        },
      });
      
      throw error;
    }
  }, []);

  return {
    trackAsyncOperation,
  };
}