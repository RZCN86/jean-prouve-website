/**
 * 图像优化工具
 * Image optimization utilities for global content delivery
 */

// 图像格式和质量配置
export const IMAGE_CONFIG = {
  // 支持的图像格式（按优先级排序）
  formats: ['image/avif', 'image/webp', 'image/jpeg'] as const,
  
  // 不同用途的质量设置
  quality: {
    thumbnail: 60,
    preview: 75,
    full: 85,
    hero: 90,
  },
  
  // 响应式断点
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
    ultra: 1920,
  },
  
  // 图像尺寸配置
  sizes: {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 200 },
    medium: { width: 600, height: 400 },
    large: { width: 1200, height: 800 },
    hero: { width: 1920, height: 1080 },
  },
} as const;

// 图像类型定义
export interface ImageSource {
  src: string;
  width: number;
  height: number;
  alt: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export interface ResponsiveImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  quality?: keyof typeof IMAGE_CONFIG.quality;
  placeholder?: 'blur' | 'empty';
  className?: string;
}

// 生成响应式图像的srcset
export function generateSrcSet(
  baseSrc: string,
  sizes: number[],
  quality: number = IMAGE_CONFIG.quality.full
): string {
  return sizes
    .map(size => {
      const optimizedSrc = optimizeImageUrl(baseSrc, size, quality);
      return `${optimizedSrc} ${size}w`;
    })
    .join(', ');
}

// 生成sizes属性
export function generateSizes(breakpoints?: Partial<typeof IMAGE_CONFIG.breakpoints>): string {
  const bp = { ...IMAGE_CONFIG.breakpoints, ...breakpoints };
  
  return [
    `(max-width: ${bp.mobile}px) 100vw`,
    `(max-width: ${bp.tablet}px) 50vw`,
    `(max-width: ${bp.desktop}px) 33vw`,
    '25vw'
  ].join(', ');
}

// 优化图像URL（适用于Next.js Image组件）
export function optimizeImageUrl(
  src: string,
  width?: number,
  quality?: number,
  format?: string
): string {
  // 如果是外部URL，直接返回
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // 构建Next.js Image优化URL
  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  if (quality) params.set('q', quality.toString());
  if (format) params.set('f', format);

  const queryString = params.toString();
  const separator = queryString ? '?' : '';
  
  return `/_next/image${separator}${queryString}&url=${encodeURIComponent(src)}`;
}

// 生成模糊占位符数据URL
export function generateBlurDataURL(
  width: number = 10,
  height: number = 10,
  color: string = '#f3f4f6'
): string {
  // 创建简单的SVG占位符
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `;
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// 检测浏览器支持的图像格式
export function getSupportedImageFormat(): string {
  if (typeof window === 'undefined') return 'image/jpeg';
  
  // 检测AVIF支持
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  try {
    const avifSupported = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    if (avifSupported) return 'image/avif';
  } catch (e) {
    // AVIF不支持
  }
  
  try {
    const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    if (webpSupported) return 'image/webp';
  } catch (e) {
    // WebP不支持
  }
  
  return 'image/jpeg';
}

// 预加载关键图像
export function preloadImage(src: string, priority: boolean = false): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = priority ? 'preload' : 'prefetch';
  link.as = 'image';
  link.href = src;
  
  // 设置图像格式提示
  const format = getSupportedImageFormat();
  if (format !== 'image/jpeg') {
    link.type = format;
  }
  
  document.head.appendChild(link);
}

// 批量预加载图像
export function preloadImages(images: string[], priority: boolean = false): void {
  images.forEach(src => preloadImage(src, priority));
}

// 图像懒加载观察器
export class ImageLazyLoader {
  private observer: IntersectionObserver | null = null;
  private images: Set<HTMLImageElement> = new Set();

  constructor(options?: IntersectionObserverInit) {
    if (typeof window === 'undefined') return;

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      }
    );
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        this.loadImage(img);
        this.observer?.unobserve(img);
        this.images.delete(img);
      }
    });
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
    }
    
    if (srcset) {
      img.srcset = srcset;
      img.removeAttribute('data-srcset');
    }
    
    img.classList.remove('lazy');
    img.classList.add('loaded');
  }

  public observe(img: HTMLImageElement): void {
    if (!this.observer) return;
    
    this.images.add(img);
    this.observer.observe(img);
  }

  public unobserve(img: HTMLImageElement): void {
    if (!this.observer) return;
    
    this.images.delete(img);
    this.observer.unobserve(img);
  }

  public disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.images.clear();
    }
  }
}

// 创建全局懒加载实例
export const globalImageLazyLoader = new ImageLazyLoader();

// CDN配置
export const CDN_CONFIG = {
  // Vercel自动提供的CDN
  vercel: {
    domains: ['*.vercel.app', '*.vercel.com'],
    features: ['auto-webp', 'auto-avif', 'compression', 'resize'],
  },
  
  // 可选的第三方CDN配置
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    baseUrl: 'https://res.cloudinary.com',
    transformations: {
      auto: 'f_auto,q_auto',
      webp: 'f_webp,q_auto',
      avif: 'f_avif,q_auto',
    },
  },
};

// 生成CDN优化的图像URL
export function getCDNImageUrl(
  src: string,
  transformations?: string,
  cdnProvider: 'vercel' | 'cloudinary' = 'vercel'
): string {
  switch (cdnProvider) {
    case 'cloudinary':
      if (!CDN_CONFIG.cloudinary.cloudName) return src;
      
      const cloudinaryBase = `${CDN_CONFIG.cloudinary.baseUrl}/${CDN_CONFIG.cloudinary.cloudName}/image/upload`;
      const transform = transformations || CDN_CONFIG.cloudinary.transformations.auto;
      
      return `${cloudinaryBase}/${transform}/${src}`;
    
    case 'vercel':
    default:
      // Vercel自动处理图像优化
      return src;
  }
}

// 图像压缩质量建议
export function getRecommendedQuality(
  imageType: 'photo' | 'illustration' | 'icon',
  usage: 'thumbnail' | 'preview' | 'full' | 'hero'
): number {
  const baseQuality = IMAGE_CONFIG.quality[usage];
  
  switch (imageType) {
    case 'photo':
      return baseQuality;
    case 'illustration':
      return Math.min(baseQuality + 10, 95);
    case 'icon':
      return Math.min(baseQuality + 15, 100);
    default:
      return baseQuality;
  }
}

// 导出默认配置
const imageOptimizationUtils = {
  IMAGE_CONFIG,
  generateSrcSet,
  generateSizes,
  optimizeImageUrl,
  generateBlurDataURL,
  getSupportedImageFormat,
  preloadImage,
  preloadImages,
  ImageLazyLoader,
  globalImageLazyLoader,
  CDN_CONFIG,
  getCDNImageUrl,
  getRecommendedQuality,
};

export default imageOptimizationUtils;