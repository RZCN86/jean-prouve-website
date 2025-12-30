/**
 * CDN和缓存配置工具
 * CDN and caching configuration utilities
 */

// 缓存策略配置
export const CACHE_CONFIG = {
  // 静态资源缓存时间（秒）
  static: {
    images: 31536000, // 1年
    fonts: 31536000,  // 1年
    css: 31536000,    // 1年
    js: 31536000,     // 1年
    icons: 2592000,   // 30天
  },
  
  // 动态内容缓存时间
  dynamic: {
    html: 3600,       // 1小时
    api: 300,         // 5分钟
    sitemap: 86400,   // 1天
    rss: 3600,        // 1小时
  },
  
  // CDN边缘缓存时间
  edge: {
    static: 31536000, // 1年
    dynamic: 3600,    // 1小时
    api: 300,         // 5分钟
  },
} as const;

// 资源类型检测
export function getResourceType(url: string): keyof typeof CACHE_CONFIG.static | 'dynamic' {
  const extension = url.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'avif':
    case 'svg':
      return 'images';
    
    case 'woff':
    case 'woff2':
    case 'ttf':
    case 'eot':
      return 'fonts';
    
    case 'css':
      return 'css';
    
    case 'js':
    case 'mjs':
      return 'js';
    
    case 'ico':
    case 'png': // favicon
      return 'icons';
    
    default:
      return 'dynamic';
  }
}

// 生成缓存控制头
export function getCacheControlHeader(
  resourceType: keyof typeof CACHE_CONFIG.static | 'dynamic',
  isStatic: boolean = true
): string {
  if (isStatic && resourceType !== 'dynamic') {
    const maxAge = CACHE_CONFIG.static[resourceType as keyof typeof CACHE_CONFIG.static];
    return `public, max-age=${maxAge}, immutable`;
  } else {
    const maxAge = CACHE_CONFIG.dynamic.html;
    return `public, max-age=${maxAge}, s-maxage=${CACHE_CONFIG.edge.dynamic}`;
  }
}

// CDN区域配置
export const CDN_REGIONS = {
  // Vercel Edge Network区域
  vercel: [
    'hkg1', // 香港
    'nrt1', // 东京
    'icn1', // 首尔
    'sin1', // 新加坡
    'sfo1', // 旧金山
    'lax1', // 洛杉矶
    'fra1', // 法兰克福
    'lhr1', // 伦敦
    'cdg1', // 巴黎
  ],
  
  // 推荐的区域配置（基于目标用户）
  recommended: {
    asia: ['hkg1', 'nrt1', 'sin1'],
    europe: ['fra1', 'lhr1', 'cdg1'],
    americas: ['sfo1', 'lax1', 'iad1'],
  },
} as const;

// 获取最佳CDN区域
export function getOptimalCDNRegions(
  primaryRegion: 'asia' | 'europe' | 'americas' = 'asia'
): string[] {
  return [...CDN_REGIONS.recommended[primaryRegion]];
}

// 资源预加载配置
export interface PreloadConfig {
  href: string;
  as: 'script' | 'style' | 'image' | 'font' | 'fetch';
  type?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  media?: string;
}

// 生成关键资源预加载配置
export function generatePreloadConfig(): PreloadConfig[] {
  return [
    // 关键CSS
    {
      href: '/_next/static/css/app.css',
      as: 'style',
    },
    
    // 关键字体
    {
      href: '/fonts/inter-var.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous',
    },
    
    // 英雄图像
    {
      href: '/images/hero/jean-prouve-hero.webp',
      as: 'image',
      type: 'image/webp',
    },
    
    // 关键JavaScript
    {
      href: '/_next/static/chunks/main.js',
      as: 'script',
    },
  ];
}

// 资源提示生成器
export class ResourceHintsGenerator {
  private preloadLinks: PreloadConfig[] = [];
  private prefetchLinks: string[] = [];
  private preconnectLinks: string[] = [];

  // 添加预加载资源
  addPreload(config: PreloadConfig): void {
    this.preloadLinks.push(config);
  }

  // 添加预获取资源
  addPrefetch(href: string): void {
    this.prefetchLinks.push(href);
  }

  // 添加预连接域名
  addPreconnect(href: string): void {
    this.preconnectLinks.push(href);
  }

  // 生成HTML头部标签
  generateHTMLTags(): string {
    const tags: string[] = [];

    // 预连接标签
    this.preconnectLinks.forEach(href => {
      tags.push(`<link rel="preconnect" href="${href}" crossorigin>`);
    });

    // 预加载标签
    this.preloadLinks.forEach(config => {
      let tag = `<link rel="preload" href="${config.href}" as="${config.as}"`;
      
      if (config.type) tag += ` type="${config.type}"`;
      if (config.crossorigin) tag += ` crossorigin="${config.crossorigin}"`;
      if (config.media) tag += ` media="${config.media}"`;
      
      tag += '>';
      tags.push(tag);
    });

    // 预获取标签
    this.prefetchLinks.forEach(href => {
      tags.push(`<link rel="prefetch" href="${href}">`);
    });

    return tags.join('\n');
  }

  // 清空所有配置
  clear(): void {
    this.preloadLinks = [];
    this.prefetchLinks = [];
    this.preconnectLinks = [];
  }
}

// 压缩配置
export const COMPRESSION_CONFIG = {
  // Gzip压缩级别
  gzip: {
    level: 6,
    threshold: 1024, // 1KB以上的文件才压缩
  },
  
  // Brotli压缩配置
  brotli: {
    quality: 6,
    threshold: 1024,
  },
  
  // 文件类型压缩配置
  fileTypes: {
    text: ['html', 'css', 'js', 'json', 'xml', 'txt'],
    compress: ['svg', 'ico'],
    noCompress: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'woff', 'woff2'],
  },
} as const;

// 检查文件是否应该压缩
export function shouldCompress(filename: string, size: number): boolean {
  if (size < COMPRESSION_CONFIG.gzip.threshold) {
    return false;
  }

  const extension = filename.split('.').pop()?.toLowerCase();
  if (!extension) return false;

  return (
    COMPRESSION_CONFIG.fileTypes.text.includes(extension as any) ||
    COMPRESSION_CONFIG.fileTypes.compress.includes(extension as any)
  );
}

// 性能预算配置
export const PERFORMANCE_BUDGET = {
  // 文件大小限制（字节）
  fileSize: {
    html: 50 * 1024,      // 50KB
    css: 100 * 1024,      // 100KB
    js: 200 * 1024,       // 200KB
    image: 500 * 1024,    // 500KB
    font: 100 * 1024,     // 100KB
  },
  
  // 页面性能指标
  metrics: {
    fcp: 1500,            // First Contentful Paint (ms)
    lcp: 2500,            // Largest Contentful Paint (ms)
    fid: 100,             // First Input Delay (ms)
    cls: 0.1,             // Cumulative Layout Shift
    ttfb: 600,            // Time to First Byte (ms)
  },
  
  // 资源数量限制
  resources: {
    totalRequests: 50,
    cssFiles: 5,
    jsFiles: 10,
    images: 20,
    fonts: 3,
  },
} as const;

// 检查是否超出性能预算
export function checkPerformanceBudget(
  metric: keyof typeof PERFORMANCE_BUDGET.metrics,
  value: number
): boolean {
  return value <= PERFORMANCE_BUDGET.metrics[metric];
}

// 生成Service Worker缓存策略
export function generateSWCacheStrategy(): string {
  return `
// Service Worker缓存策略
const CACHE_NAME = 'jean-prouve-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/biography',
  '/works',
  '/scholars',
  '/_next/static/css/app.css',
  '/_next/static/js/main.js',
];

// 缓存策略配置
const CACHE_STRATEGIES = {
  static: 'CacheFirst',
  dynamic: 'NetworkFirst',
  images: 'CacheFirst',
  api: 'NetworkFirst',
};

// 安装事件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_CACHE_URLS))
  );
});

// 获取事件
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 静态资源缓存优先
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
    );
    return;
  }
  
  // 图像缓存优先
  if (url.pathname.startsWith('/images/')) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) return response;
          
          return fetch(request).then(fetchResponse => {
            const responseClone = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, responseClone));
            return fetchResponse;
          });
        })
    );
    return;
  }
  
  // API网络优先
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match(request))
    );
    return;
  }
  
  // 页面网络优先，缓存降级
  event.respondWith(
    fetch(request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => cache.put(request, responseClone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
`;
}

// 导出默认配置
const cdnUtils = {
  CACHE_CONFIG,
  CDN_REGIONS,
  COMPRESSION_CONFIG,
  PERFORMANCE_BUDGET,
  getResourceType,
  getCacheControlHeader,
  getOptimalCDNRegions,
  generatePreloadConfig,
  ResourceHintsGenerator,
  shouldCompress,
  checkPerformanceBudget,
  generateSWCacheStrategy,
};

export default cdnUtils;