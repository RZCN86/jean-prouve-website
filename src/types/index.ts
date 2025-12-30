// Core type definitions for Jean Prouvé website

export interface ImageData {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  children?: MenuItem[];
}

export interface NavigationProps {
  currentPath: string;
  locale: string;
}

// Biography related types
export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  category: 'education' | 'career' | 'achievement' | 'collaboration';
}

export interface BiographyData {
  id: string;
  title: string;
  period: string;
  description: string;
  images: ImageData[];
  timeline: TimelineEvent[];
}

// Works related types
export interface WorkCategory {
  id: string;
  name: string;
  description: string;
}

export interface TechnicalSpec {
  property: string;
  value: string;
  unit?: string;
}

export interface Commentary {
  id: string;
  title: string;
  content: string;
  author: string;
  type: 'technical' | 'historical' | 'cultural' | 'contemporary';
  date?: string;
  institution?: string;
  tags?: string[];
}

export interface ExpertAnalysis {
  id: string;
  workId: string;
  title: string;
  content: string;
  author: string;
  authorBio?: string;
  institution?: string;
  type: 'technical' | 'historical' | 'cultural' | 'contemporary' | 'material';
  date: string;
  tags: string[];
  references?: string[];
  images?: ImageData[];
}

export interface TechnicalAnalysis {
  id: string;
  workId: string;
  title: string;
  constructionMethod: string;
  materials: MaterialAnalysis[];
  innovations: string[];
  challenges: string[];
  impact: string;
  author: string;
  date: string;
}

export interface MaterialAnalysis {
  material: string;
  properties: string[];
  usage: string;
  advantages: string[];
  limitations?: string[];
}

export interface HistoricalContext {
  id: string;
  workId: string;
  period: string;
  socialContext: string;
  politicalContext: string;
  economicContext: string;
  culturalSignificance: string;
  influences: string[];
  author: string;
  date: string;
}

export interface ContemporaryInfluence {
  id: string;
  workId: string;
  title: string;
  description: string;
  influencedWorks: string[];
  influencedArchitects: string[];
  modernApplications: string[];
  relevanceToday: string;
  author: string;
  date: string;
}

export interface ArchitecturalWork {
  id: string;
  title: string;
  year: number;
  location: string;
  category: WorkCategory;
  description: string;
  images: ImageData[];
  technicalDrawings: ImageData[];
  specifications: TechnicalSpec[];
  commentary: Commentary; // Legacy single commentary for backward compatibility
  expertAnalyses?: ExpertAnalysis[];
  technicalAnalysis?: TechnicalAnalysis;
  historicalContext?: HistoricalContext;
  contemporaryInfluence?: ContemporaryInfluence;
  status: 'existing' | 'demolished' | 'reconstructed';
}

// Scholar related types
export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
}

export interface Publication {
  id: string;
  title: string;
  type: 'book' | 'article' | 'thesis' | 'conference';
  year: number;
  publisher?: string;
  abstract: string;
  keywords: string[];
  url?: string;
}

export interface Exhibition {
  id: string;
  title: string;
  venue: string;
  year: number;
  description: string;
  role: string;
}

export interface Scholar {
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

// Search related types
export interface SearchFilters {
  category?: string[];
  year?: [number, number];
  region?: string[];
  type?: string[];
}

export type SortOption = 'relevance' | 'year' | 'title' | 'author';

export interface SearchQuery {
  term: string;
  filters: SearchFilters;
  sortBy: SortOption;
}

export interface SearchResult {
  id: string;
  type: 'work' | 'biography' | 'scholar' | 'publication';
  title: string;
  excerpt: string;
  relevanceScore: number;
  metadata: Record<string, any>;
}

// Responsive design types
export interface ResponsiveBreakpoints {
  mobile: '320px';
  tablet: '768px';
  desktop: '1024px';
  wide: '1440px';
}

export interface ViewportConfig {
  breakpoint: keyof ResponsiveBreakpoints;
  columns: number;
  spacing: string;
  fontSize: string;
}

// Localization types
export interface LocalizedContent {
  zh: ContentData;
  fr: ContentData;
  en: ContentData;
}

export interface ContentData {
  navigation: NavigationLabels;
  biography: BiographyLabels;
  works: WorksContent;
  scholars: ScholarsContent;
  common: CommonLabels;
}

export interface NavigationLabels {
  home: string;
  biography: string;
  works: string;
  scholars: string;
  search: string;
  language: string;
}

export interface CommonLabels {
  loading: string;
  error: string;
  notFound: string;
  readMore: string;
  close: string;
  next: string;
  previous: string;
}

export interface BiographyLabels {
  title: string;
  subtitle: string;
  timeline: string;
  earlyLife: string;
  career: string;
  legacy: string;
}

export interface WorksContent {
  title: string;
  subtitle: string;
  categories: string;
  filter: string;
  sort: string;
  details: string;
}

export interface ScholarsContent {
  title: string;
  subtitle: string;
  regions: string;
  specializations: string;
  publications: string;
  contact: string;
}

// Extended Biography Data Models
export interface FamilyMember {
  name: string;
  relationship: string;
  description?: string;
}

export interface EducationRecord {
  institution: string;
  degree?: string;
  period: string;
  location: string;
  description: string;
}

export interface CareerMilestone {
  position: string;
  organization: string;
  period: string;
  location: string;
  achievements: string[];
}

export interface PhilosophyStatement {
  theme: string;
  content: string;
  source?: string;
  year?: number;
}

export interface Collaboration {
  collaborator: string;
  project: string;
  period: string;
  description: string;
  outcome?: string;
}

export interface LegacyItem {
  category: 'influence' | 'innovation' | 'recognition' | 'preservation';
  title: string;
  description: string;
  year?: number;
}

export interface BiographyContent {
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

// Extended Works Data Models
export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'mm' | 'cm' | 'm';
}

export interface FurnitureWork {
  id: string;
  name: string;
  year: number;
  materials: string[];
  dimensions: Dimensions;
  productionMethod: string;
  currentLocation: string;
  images: ImageData[];
  description: string;
}

export interface WorksDatabase {
  residential: ArchitecturalWork[];
  industrial: ArchitecturalWork[];
  educational: ArchitecturalWork[];
  experimental: ArchitecturalWork[];
  furniture: FurnitureWork[];
}

// Extended Scholar Data Models
export interface ScholarDatabase {
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

// API and Data Fetching Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Form and Input Types
export interface SearchFormData {
  query: string;
  category: string;
  yearFrom?: number;
  yearTo?: number;
  region?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
}

export interface ModalState {
  isOpen: boolean;
  content?: React.ReactNode;
  title?: string;
}

// Theme and Styling Types
export interface ThemeColors {
  primary: {
    steel: string;
    aluminum: string;
    iron: string;
  };
  accent: {
    copper: string;
    brass: string;
  };
  neutral: {
    white: string;
    light: string;
    medium: string;
    dark: string;
  };
  semantic: {
    success: string;
    warning: string;
    error: string;
  };
}

export interface TypographyScale {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
}

export interface SpacingScale {
  1: string;
  2: string;
  3: string;
  4: string;
  6: string;
  8: string;
  12: string;
  16: string;
  24: string;
}

// Animation and Transition Types
export interface TransitionConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface AnimationState {
  isAnimating: boolean;
  direction: 'in' | 'out';
  config: TransitionConfig;
}

// Utility Types
export type Locale = 'zh' | 'fr' | 'en';
export type ContentType = 'work' | 'biography' | 'scholar' | 'publication';
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'wide';
export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export interface PageProps {
  locale: Locale;
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
}

export interface LayoutProps extends BaseComponentProps {
  title?: string;
  description?: string;
  keywords?: string[];
}