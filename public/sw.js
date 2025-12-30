/**
 * Service Worker for Jean Prouvé Website
 * 让·普鲁维网站服务工作者
 * 
 * 提供离线缓存、资源预缓存和性能优化
 */

const CACHE_NAME = 'jean-prouve-v1.0.0';
const RUNTIME_CACHE = 'runtime-cache-v1.0.0';

// 需要预缓存的关键资源
const PRECACHE_URLS = [
  '/',
  '/biography',
  '/works',
  '/scholars',
  '/offline',
  '/manifest.json',
];

// 缓存策略配置
const CACHE_STRATEGIES = {
  // 静态资源：缓存优先
  static: {
    pattern: /\/_next\/static\/.*/,
    strategy: 'CacheFirst',
    maxAge: 365 * 24 * 60 * 60, // 1年
  },
  
  // 图像：缓存优先，网络降级
  images: {
    pattern: /\/images\/.*/,
    strategy: 'CacheFirst',
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  
  // 字体：缓存优先
  fonts: {
    pattern: /\/fonts\/.*/,
    strategy: 'CacheFirst',
    maxAge: 365 * 24 * 60 * 60, // 1年
  },
  
  // API：网络优先，缓存降级
  api: {
    pattern: /\/api\/.*/,
    strategy: 'NetworkFirst',
    maxAge: 5 * 60, // 5分钟
  },
  
  // 页面：网络优先，缓存降级
  pages: {
    pattern: /^https:\/\/.*\/(biography|works|scholars|search).*/,
    strategy: 'NetworkFirst',
    maxAge: 60 * 60, // 1小时
  },
  
  // 外部资源：网络优先
  external: {
    pattern: /^https:\/\/(?!.*\.vercel\.app).*/,
    strategy: 'NetworkFirst',
    maxAge: 24 * 60 * 60, // 1天
  },
};

// 安装事件：预缓存关键资源
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching resources...');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Service worker installed successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Failed to install service worker:', error);
      })
  );
});

// 激活事件：清理旧缓存
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
            })
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated successfully');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('[SW] Failed to activate service worker:', error);
      })
  );
});

// 获取事件：处理网络请求
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 只处理GET请求
  if (request.method !== 'GET') {
    return;
  }
  
  // 跳过Chrome扩展请求
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // 根据URL模式选择缓存策略
  const strategy = getStrategyForRequest(request);
  
  if (strategy) {
    event.respondWith(handleRequest(request, strategy));
  }
});

// 根据请求选择缓存策略
function getStrategyForRequest(request) {
  const url = new URL(request.url);
  
  for (const [name, config] of Object.entries(CACHE_STRATEGIES)) {
    if (config.pattern.test(url.href)) {
      return { ...config, name };
    }
  }
  
  // 默认策略：网络优先
  return {
    name: 'default',
    strategy: 'NetworkFirst',
    maxAge: 60 * 60, // 1小时
  };
}

// 处理请求
async function handleRequest(request, strategy) {
  switch (strategy.strategy) {
    case 'CacheFirst':
      return cacheFirst(request, strategy);
    case 'NetworkFirst':
      return networkFirst(request, strategy);
    case 'StaleWhileRevalidate':
      return staleWhileRevalidate(request, strategy);
    default:
      return networkFirst(request, strategy);
  }
}

// 缓存优先策略
async function cacheFirst(request, strategy) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, strategy.maxAge)) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error(`[SW] CacheFirst failed for ${request.url}:`, error);
    
    // 降级到缓存
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 返回离线页面
    if (request.destination === 'document') {
      return caches.match('/offline');
    }
    
    throw error;
  }
}

// 网络优先策略
async function networkFirst(request, strategy) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error(`[SW] NetworkFirst failed for ${request.url}:`, error);
    
    // 降级到缓存
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 返回离线页面
    if (request.destination === 'document') {
      return caches.match('/offline');
    }
    
    throw error;
  }
}

// 过期时重新验证策略
async function staleWhileRevalidate(request, strategy) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);
  
  // 异步更新缓存
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });
  
  // 如果有缓存，立即返回；否则等待网络响应
  return cachedResponse || fetchPromise;
}

// 检查响应是否过期
function isExpired(response, maxAge) {
  if (!maxAge) return false;
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const responseTime = new Date(dateHeader).getTime();
  const now = Date.now();
  
  return (now - responseTime) > (maxAge * 1000);
}

// 消息处理：支持手动缓存清理
self.addEventListener('message', event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      clearCache(payload?.cacheName);
      break;
      
    case 'PRECACHE_URLS':
      precacheUrls(payload?.urls || []);
      break;
      
    default:
      console.log('[SW] Unknown message type:', type);
  }
});

// 清理缓存
async function clearCache(cacheName) {
  try {
    if (cacheName) {
      await caches.delete(cacheName);
      console.log(`[SW] Cleared cache: ${cacheName}`);
    } else {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('[SW] Cleared all caches');
    }
  } catch (error) {
    console.error('[SW] Failed to clear cache:', error);
  }
}

// 预缓存URL
async function precacheUrls(urls) {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(urls);
    console.log('[SW] Precached URLs:', urls);
  } catch (error) {
    console.error('[SW] Failed to precache URLs:', error);
  }
}

// 后台同步（如果支持）
if ('sync' in self.registration) {
  self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
      event.waitUntil(doBackgroundSync());
    }
  });
}

async function doBackgroundSync() {
  console.log('[SW] Performing background sync...');
  // 这里可以实现后台数据同步逻辑
}

// 推送通知（如果需要）
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: data.tag || 'default',
        data: data.data,
      })
    );
  }
});

// 通知点击处理
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

console.log('[SW] Service worker script loaded');