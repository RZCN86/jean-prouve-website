# 设计文档

## 概述

让·普鲁维研究网站是一个现代化的、响应式的Web应用程序，专门展示法国建筑师和设计师让·普鲁维(Jean Prouvé, 1901-1984)的轻型建筑建造系统研究。该网站将采用Next.js框架，结合TypeScript和Tailwind CSS，为用户提供沉浸式的学习和研究体验。

网站的设计理念将体现普鲁维的建筑哲学：功能性、简洁性和工业美学。通过现代Web技术，我们将创建一个既具有学术价值又具有视觉吸引力的数字平台。

## 架构

### 技术栈
- **前端框架**: Next.js 14+ (React 18+)
- **类型系统**: TypeScript
- **样式框架**: Tailwind CSS
- **部署平台**: Vercel
- **图像优化**: Next.js Image组件
- **国际化**: next-i18next
- **SEO优化**: Next.js内置SEO功能

### 架构模式
采用现代的JAMstack架构：
- **静态生成 (SSG)**: 用于内容页面，提供最佳性能
- **服务端渲染 (SSR)**: 用于动态内容和搜索功能
- **客户端渲染 (CSR)**: 用于交互式组件

### 文件结构
```
jean-prouve-website/
├── public/
│   ├── images/
│   │   ├── biography/
│   │   ├── works/
│   │   └── scholars/
│   └── locales/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── biography/
│   │   ├── works/
│   │   ├── scholars/
│   │   └── navigation/
│   ├── pages/
│   ├── styles/
│   ├── data/
│   ├── types/
│   └── utils/
├── content/
│   ├── biography/
│   ├── works/
│   └── scholars/
└── docs/
```

## 组件和接口

### 核心组件

#### 1. 导航组件 (NavigationSystem)
```typescript
interface NavigationProps {
  currentPath: string;
  locale: string;
}

interface MenuItem {
  id: string;
  label: string;
  href: string;
  children?: MenuItem[];
}
```

#### 2. 传记组件 (BiographySystem)
```typescript
interface BiographyData {
  id: string;
  title: string;
  period: string;
  description: string;
  images: ImageData[];
  timeline: TimelineEvent[];
}

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  category: 'education' | 'career' | 'achievement' | 'collaboration';
}
```

#### 3. 作品画廊组件 (GallerySystem)
```typescript
interface ArchitecturalWork {
  id: string;
  title: string;
  year: number;
  location: string;
  category: WorkCategory;
  description: string;
  images: ImageData[];
  technicalDrawings: ImageData[];
  specifications: TechnicalSpec[];
  commentary: Commentary;
  status: 'existing' | 'demolished' | 'reconstructed';
}

interface WorkCategory {
  id: string;
  name: string;
  description: string;
}

interface TechnicalSpec {
  property: string;
  value: string;
  unit?: string;
}
```

#### 4. 学者研究组件 (ScholarSystem)
```typescript
interface Scholar {
  id: string;
  name: string;
  institution: string;
  country: string;
  region: string;
  specialization: string[];
  biography: string;
  contact: ContactInfo;
  publications: Publication[];
  exhibitions: Exhibition[];
}

interface Publication {
  id: string;
  title: string;
  type: 'book' | 'article' | 'thesis' | 'conference';
  year: number;
  publisher?: string;
  abstract: string;
  keywords: string[];
  url?: string;
}
```

#### 5. 搜索组件 (SearchSystem)
```typescript
interface SearchQuery {
  term: string;
  filters: SearchFilters;
  sortBy: SortOption;
}

interface SearchFilters {
  category?: string[];
  year?: [number, number];
  region?: string[];
  type?: string[];
}

interface SearchResult {
  id: string;
  type: 'work' | 'biography' | 'scholar' | 'publication';
  title: string;
  excerpt: string;
  relevanceScore: number;
  metadata: Record<string, any>;
}
```

### 响应式设计接口
```typescript
interface ResponsiveBreakpoints {
  mobile: '320px';
  tablet: '768px';
  desktop: '1024px';
  wide: '1440px';
}

interface ViewportConfig {
  breakpoint: keyof ResponsiveBreakpoints;
  columns: number;
  spacing: string;
  fontSize: string;
}
```

## 数据模型

### 内容数据结构

#### 传记数据模型
```typescript
interface BiographyContent {
  personalInfo: {
    fullName: string;
    birthDate: string;
    deathDate: string;
    birthPlace: string;
    nationality: string;
    family: FamilyMember[];
  };
  education: EducationRecord[];
  career: CareerMilestone[];
  philosophy: PhilosophyStatement[];
  collaborations: Collaboration[];
  legacy: LegacyItem[];
}
```

#### 作品数据模型
```typescript
interface WorksDatabase {
  residential: ArchitecturalWork[];
  industrial: ArchitecturalWork[];
  educational: ArchitecturalWork[];
  experimental: ArchitecturalWork[];
  furniture: FurnitureWork[];
}

interface FurnitureWork {
  id: string;
  name: string;
  year: number;
  materials: string[];
  dimensions: Dimensions;
  productionMethod: string;
  currentLocation: string;
}
```

#### 学者数据模型
```typescript
interface ScholarDatabase {
  byRegion: {
    europe: Scholar[];
    northAmerica: Scholar[];
    asia: Scholar[];
    africa: Scholar[];
    oceania: Scholar[];
    southAmerica: Scholar[];
  };
  bySpecialization: {
    architecturalHistory: Scholar[];
    industrialDesign: Scholar[];
    prefabricatedConstruction: Scholar[];
    modernism: Scholar[];
    materialStudies: Scholar[];
  };
}
```

### 多语言数据模型
```typescript
interface LocalizedContent {
  zh: ContentData;
  fr: ContentData;
  en: ContentData;
}

interface ContentData {
  navigation: NavigationLabels;
  biography: BiographyContent;
  works: WorksContent;
  scholars: ScholarsContent;
  common: CommonLabels;
}
```

## 用户界面设计

### 设计系统

#### 色彩方案
受普鲁维工业美学启发的色彩系统：
```css
:root {
  /* 主色调 - 工业金属色 */
  --primary-steel: #4A5568;
  --primary-aluminum: #E2E8F0;
  --primary-iron: #2D3748;
  
  /* 辅助色 - 温暖色调 */
  --accent-copper: #D69E2E;
  --accent-brass: #F6E05E;
  
  /* 中性色 */
  --neutral-white: #FFFFFF;
  --neutral-light: #F7FAFC;
  --neutral-medium: #CBD5E0;
  --neutral-dark: #1A202C;
  
  /* 语义色 */
  --success: #38A169;
  --warning: #D69E2E;
  --error: #E53E3E;
}
```

#### 字体系统
```css
/* 主要字体 - 现代无衬线字体 */
--font-primary: 'Inter', 'Noto Sans SC', sans-serif;

/* 标题字体 - 几何字体体现工业感 */
--font-heading: 'Poppins', 'Noto Sans SC', sans-serif;

/* 代码字体 */
--font-mono: 'JetBrains Mono', 'Courier New', monospace;

/* 字体大小 */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
--text-5xl: 3rem;
```

#### 间距系统
```css
/* 基于8px网格的间距系统 */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-24: 6rem;    /* 96px */
```

### 页面布局

#### 主页布局
- **英雄区域**: 全屏展示普鲁维标志性作品图像
- **导航栏**: 固定顶部导航，包含主要部分链接
- **内容区域**: 网格布局展示主要内容类别
- **页脚**: 版权信息和相关链接

#### 作品详情页布局
- **图像画廊**: 大尺寸图像展示区域
- **信息面板**: 侧边栏显示技术规格和基本信息
- **评论区域**: 专家分析和评论内容
- **相关作品**: 底部推荐相关作品

#### 学者页面布局
- **筛选侧边栏**: 按地区、专业领域筛选
- **学者卡片网格**: 响应式网格展示学者信息
- **详情模态框**: 点击展开详细信息

### 交互设计

#### 动画和过渡
```css
/* 标准过渡时间 */
--transition-fast: 150ms;
--transition-normal: 300ms;
--transition-slow: 500ms;

/* 缓动函数 */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

#### 交互状态
- **悬停效果**: 图像缩放、颜色变化
- **焦点状态**: 键盘导航支持
- **加载状态**: 骨架屏和进度指示器
- **错误状态**: 友好的错误提示

## 性能优化

### 图像优化策略
- 使用Next.js Image组件自动优化
- WebP格式支持，降级到JPEG
- 响应式图像，根据设备提供合适尺寸
- 懒加载实现，提升初始加载速度

### 代码分割
- 页面级别的代码分割
- 组件级别的动态导入
- 第三方库的按需加载

### 缓存策略
- 静态资源长期缓存
- API响应适当缓存
- 浏览器缓存优化

## SEO和可访问性

### SEO优化
- 结构化数据标记 (JSON-LD)
- 动态生成meta标签
- 语义化HTML结构
- 站点地图自动生成
- 多语言SEO支持

### 可访问性 (WCAG 2.1 AA)
- 键盘导航支持
- 屏幕阅读器兼容
- 颜色对比度符合标准
- 替代文本完整
- 焦点管理优化

## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的正式陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### 属性1：内容展示完整性
*对于任何*主要建筑作品，系统应当展示完整的信息集合，包括详细评论、技术分析、历史背景、当代影响和技术规格
**验证需求：需求 3.1, 3.2, 3.3, 3.4, 3.5**

### 属性2：学者信息完整性  
*对于任何*学者记录，系统应当包含完整的学术信息，包括背景、机构、研究方向、研究成果、摘要和联系方式
**验证需求：需求 8.2, 8.3, 8.5, 8.6**

### 属性3：作品数据完整性
*对于任何*建筑作品，系统应当包含基本信息三元组：建造日期、位置和当前状态
**验证需求：需求 2.5**

### 属性4：分类组织一致性
*对于任何*内容类型（作品或学者），系统应当提供一致的分类组织方式，确保每个项目都被正确归类
**验证需求：需求 2.3, 8.4**

### 属性5：交互功能响应性
*对于任何*用户交互（图像点击、导航操作），系统应当提供相应的反馈和功能响应
**验证需求：需求 2.2, 4.1, 4.3**

### 属性6：搜索功能有效性
*对于任何*有效的搜索查询，系统应当返回相关的结果并提供适当的筛选选项
**验证需求：需求 2.4, 7.3, 7.4**

### 属性7：响应式显示适配性
*对于任何*设备类型（桌面、平板、移动），系统应当提供适合该设备的显示布局和交互方式
**验证需求：需求 5.1, 5.4**

### 属性8：性能优化有效性
*对于任何*页面加载请求，系统应当在合理时间内完成加载，并实现适当的优化策略
**验证需求：需求 5.2, 5.5**

### 属性9：SEO和无障碍性合规
*对于任何*页面，系统应当包含必要的SEO元素和无障碍性功能，符合相关标准
**验证需求：需求 6.4, 6.5**

### 属性10：内容格式一致性
*对于任何*内容类型，系统应当维护一致的格式和展示标准
**验证需求：需求 7.5**

## 错误处理

### 网络错误处理
- 连接超时的优雅降级
- 离线状态的缓存内容展示
- 重试机制和错误提示

### 内容加载错误
- 图像加载失败的占位符
- 数据获取失败的友好提示
- 部分内容加载失败时的降级显示

### 用户输入错误
- 搜索查询的输入验证
- 无效URL的404页面处理
- 表单提交的错误反馈

### 浏览器兼容性
- 不支持的浏览器功能降级
- JavaScript禁用时的基本功能保证
- CSS不支持时的基础样式

## 测试策略

### 双重测试方法
本项目将采用单元测试和属性测试相结合的综合测试策略：

- **单元测试**：验证特定示例、边界情况和错误条件
- **属性测试**：验证跨所有输入的通用属性
- 两者互补，提供全面覆盖（单元测试捕获具体错误，属性测试验证通用正确性）

### 单元测试重点
- 组件渲染的特定示例
- 集成点验证
- 边界情况和错误条件处理
- 用户交互的具体场景

### 属性测试配置
- 使用Jest和React Testing Library进行属性测试
- 每个属性测试最少运行100次迭代（由于随机化）
- 每个属性测试必须引用其设计文档属性
- 标签格式：**功能：jean-prouve-website，属性 {编号}：{属性文本}**
- 每个正确性属性必须由单个属性测试实现

### 测试覆盖范围
- **组件测试**：所有React组件的渲染和交互
- **集成测试**：页面级别的功能测试
- **端到端测试**：关键用户流程验证
- **性能测试**：加载时间和响应性验证
- **可访问性测试**：WCAG合规性验证
- **跨浏览器测试**：主要浏览器兼容性

### 持续集成
- 自动化测试在每次提交时运行
- 性能回归测试
- 视觉回归测试
- 部署前的完整测试套件执行

## 国际化

### 支持语言
- 中文 (简体)
- 法语 (普鲁维的母语)
- 英语 (国际通用语言)

### 实现方案
- 使用next-i18next库
- 路由级别的语言切换
- 动态内容翻译
- 日期和数字格式本地化