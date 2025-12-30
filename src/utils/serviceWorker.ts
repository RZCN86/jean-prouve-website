/**
 * Service Worker注册和管理工具
 * Service Worker registration and management utilities
 */

import { useState, useEffect, useCallback } from 'react';

// Service Worker配置
const SW_CONFIG = {
  swUrl: '/sw.js',
  scope: '/',
  updateCheckInterval: 60000, // 1分钟检查一次更新
};

// Service Worker状态
export type SWStatus = 'installing' | 'waiting' | 'active' | 'redundant' | 'error' | 'unsupported';

// Service Worker事件回调
export interface SWCallbacks {
  onInstalling?: () => void;
  onWaiting?: (registration: ServiceWorkerRegistration) => void;
  onActive?: () => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private callbacks: SWCallbacks = {};
  private updateCheckTimer: NodeJS.Timeout | null = null;

  constructor(callbacks: SWCallbacks = {}) {
    this.callbacks = callbacks;
  }

  // 注册Service Worker
  async register(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('[SW] Service Worker not supported');
      this.callbacks.onError?.(new Error('Service Worker not supported'));
      return null;
    }

    try {
      console.log('[SW] Registering service worker...');
      
      const registration = await navigator.serviceWorker.register(
        SW_CONFIG.swUrl,
        { scope: SW_CONFIG.scope }
      );

      this.registration = registration;
      this.setupEventListeners(registration);
      this.startUpdateCheck();

      console.log('[SW] Service worker registered successfully');
      return registration;
    } catch (error) {
      console.error('[SW] Service worker registration failed:', error);
      this.callbacks.onError?.(error as Error);
      return null;
    }
  }

  // 设置事件监听器
  private setupEventListeners(registration: ServiceWorkerRegistration): void {
    // 监听Service Worker状态变化
    if (registration.installing) {
      this.trackServiceWorker(registration.installing, 'installing');
    }

    if (registration.waiting) {
      this.callbacks.onWaiting?.(registration);
    }

    if (registration.active) {
      this.callbacks.onActive?.();
    }

    // 监听更新
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        this.trackServiceWorker(newWorker, 'installing');
      }
    });

    // 监听网络状态变化
    window.addEventListener('online', () => {
      console.log('[SW] Network online');
      this.callbacks.onOnline?.();
    });

    window.addEventListener('offline', () => {
      console.log('[SW] Network offline');
      this.callbacks.onOffline?.();
    });

    // 监听Service Worker消息
    navigator.serviceWorker.addEventListener('message', this.handleMessage.bind(this));
  }

  // 跟踪Service Worker状态
  private trackServiceWorker(worker: ServiceWorker, initialState: string): void {
    console.log(`[SW] Service worker state: ${initialState}`);

    worker.addEventListener('statechange', () => {
      console.log(`[SW] Service worker state changed: ${worker.state}`);

      switch (worker.state) {
        case 'installing':
          this.callbacks.onInstalling?.();
          break;
        case 'installed':
          this.callbacks.onWaiting?.(this.registration!);
          break;
        case 'activating':
          // Service worker is activating
          break;
        case 'activated':
          this.callbacks.onActive?.();
          break;
        case 'redundant':
          console.log('[SW] Service worker became redundant');
          break;
      }
    });
  }

  // 处理Service Worker消息
  private handleMessage(event: MessageEvent): void {
    const { type, payload } = event.data;
    
    switch (type) {
      case 'SW_UPDATE_AVAILABLE':
        console.log('[SW] Update available');
        this.callbacks.onUpdate?.(this.registration!);
        break;
      case 'SW_CACHE_UPDATED':
        console.log('[SW] Cache updated:', payload);
        break;
      default:
        console.log('[SW] Unknown message:', event.data);
    }
  }

  // 开始定期检查更新
  private startUpdateCheck(): void {
    this.updateCheckTimer = setInterval(() => {
      this.checkForUpdates();
    }, SW_CONFIG.updateCheckInterval);
  }

  // 检查Service Worker更新
  async checkForUpdates(): Promise<void> {
    if (!this.registration) return;

    try {
      await this.registration.update();
    } catch (error) {
      console.error('[SW] Failed to check for updates:', error);
    }
  }

  // 跳过等待，立即激活新的Service Worker
  skipWaiting(): void {
    if (!this.registration?.waiting) return;

    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  // 清理缓存
  clearCache(cacheName?: string): void {
    if (!this.registration?.active) return;

    this.registration.active.postMessage({
      type: 'CLEAR_CACHE',
      payload: { cacheName },
    });
  }

  // 预缓存URL
  precacheUrls(urls: string[]): void {
    if (!this.registration?.active) return;

    this.registration.active.postMessage({
      type: 'PRECACHE_URLS',
      payload: { urls },
    });
  }

  // 获取缓存信息
  async getCacheInfo(): Promise<{ name: string; size: number }[]> {
    if (!('caches' in window)) return [];

    try {
      const cacheNames = await caches.keys();
      const cacheInfo = await Promise.all(
        cacheNames.map(async (name) => {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          return { name, size: keys.length };
        })
      );

      return cacheInfo;
    } catch (error) {
      console.error('[SW] Failed to get cache info:', error);
      return [];
    }
  }

  // 注销Service Worker
  async unregister(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      if (this.updateCheckTimer) {
        clearInterval(this.updateCheckTimer);
        this.updateCheckTimer = null;
      }

      const result = await this.registration.unregister();
      console.log('[SW] Service worker unregistered:', result);
      return result;
    } catch (error) {
      console.error('[SW] Failed to unregister service worker:', error);
      return false;
    }
  }

  // 获取Service Worker状态
  getStatus(): SWStatus {
    if (!('serviceWorker' in navigator)) {
      return 'unsupported';
    }

    if (!this.registration) {
      return 'error';
    }

    if (this.registration.installing) {
      return 'installing';
    }

    if (this.registration.waiting) {
      return 'waiting';
    }

    if (this.registration.active) {
      return 'active';
    }

    return 'redundant';
  }

  // 检查是否在线
  isOnline(): boolean {
    return navigator.onLine;
  }

  // 检查是否支持Service Worker
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator;
  }
}

// 创建全局Service Worker管理器实例
export const swManager = new ServiceWorkerManager({
  onInstalling: () => {
    console.log('[SW] Installing new service worker...');
  },
  
  onWaiting: (registration) => {
    console.log('[SW] New service worker waiting to activate');
    // 可以在这里显示更新提示
  },
  
  onActive: () => {
    console.log('[SW] Service worker activated');
  },
  
  onUpdate: (registration) => {
    console.log('[SW] Service worker update available');
    // 可以在这里显示更新通知
  },
  
  onError: (error) => {
    console.error('[SW] Service worker error:', error);
  },
  
  onOffline: () => {
    console.log('[SW] Application is offline');
    // 可以在这里显示离线提示
  },
  
  onOnline: () => {
    console.log('[SW] Application is online');
    // 可以在这里隐藏离线提示
  },
});

// 自动注册Service Worker（仅在生产环境）
export function initServiceWorker(): void {
  if (process.env.NODE_ENV === 'production' && ServiceWorkerManager.isSupported()) {
    // 页面加载完成后注册
    if (document.readyState === 'complete') {
      swManager.register();
    } else {
      window.addEventListener('load', () => {
        swManager.register();
      });
    }
  }
}

// React Hook for Service Worker
export function useServiceWorker() {
  const [status, setStatus] = useState<SWStatus>('unsupported');
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!ServiceWorkerManager.isSupported()) {
      setStatus('unsupported');
      return;
    }

    // 创建带回调的Service Worker管理器
    const manager = new ServiceWorkerManager({
      onInstalling: () => setStatus('installing'),
      onWaiting: () => {
        setStatus('waiting');
        setUpdateAvailable(true);
      },
      onActive: () => setStatus('active'),
      onError: () => setStatus('error'),
      onOffline: () => setIsOnline(false),
      onOnline: () => setIsOnline(true),
    });

    manager.register();

    // 初始状态
    setIsOnline(navigator.onLine);

    return () => {
      manager.unregister();
    };
  }, []);

  const skipWaiting = useCallback(() => {
    swManager.skipWaiting();
    setUpdateAvailable(false);
  }, []);

  const clearCache = useCallback((cacheName?: string) => {
    swManager.clearCache(cacheName);
  }, []);

  return {
    status,
    isOnline,
    updateAvailable,
    skipWaiting,
    clearCache,
    isSupported: ServiceWorkerManager.isSupported(),
  };
}

export default ServiceWorkerManager;